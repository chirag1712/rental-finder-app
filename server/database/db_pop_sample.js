const { sql, getPostalCodeAPI } = require('./db_fill_missing_postal_codes.js');
const { createWriteStream, readdirSync, unlinkSync } = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const Cluster = require('./my-puppeteer-cluster/Cluster.js').default;
const https = require('https');
const { encryptPassword } = require('../app/controllers/user.controller.js');
const User = require('../app/models/user.model.js');
const { Posting, Address, AddressOf } = require('../app/models/posting.model.js');
const Photo = require('../app/models/photo.model.js');

function deleteLogs() {
  const logsDirectory = 'database/logs';
  const files = readdirSync(logsDirectory);
  for (const file of files) {
    unlinkSync(path.join(logsDirectory, file));
  }
}

// WIP boilerplate for the future
async function fb_scraper() {
  try {
    const url = 'https://www.facebook.com/marketplace/112763262068685/propertyrentals';
    const item_selector = 'div>div>div>span>div>div>a[role="link"][tabindex="0"]';
    // const address_selector = 'body>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>span';
    const price_selector = 'body>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>span';
    const concurrency = 5;
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: concurrency,
      timeout: 60000 // ms
    });
    await cluster.task(async ({ page, data: { concurrency, pid, url, item_selector, price_selector } }) => {
      const numPostsPerScraper = 50 / concurrency;
      const scrollThreshold = 20 / concurrency;
      await page.goto(url, { timeout: 0 });
      // myConsole.log(`Connected to ${url}`);
      for (let i = 0; i < numPostsPerScraper; ++i) {
        const index = pid + concurrency * i;
        try {
          await page.waitForSelector(item_selector);
          await page.evaluate(async () => {
            return await new Promise(resolve => {
              let it = 0;
              let scrollInterval;
              const scroll = resolve => {
                window.scrollTo(0, document.body.scrollHeight);
                if (++it > 1) {
                  clearInterval(scrollInterval);
                  resolve();
                }
              }
              scrollInterval = setInterval(scroll, 100, resolve);
            });
          });
          // myConsole.log(`Page has loaded`);
          await page.evaluate((sel, ind) => {
            const el = document.querySelectorAll(sel)[ind];
            el.click();
          }, item_selector, index);
          // myConsole.log(`Item clicked`);
          await page.waitForSelector(price_selector);
          // myConsole.log(`Item page loaded`);
          const price = await page.evaluate(sel => document.querySelector(sel).innerText, price_selector);
          await page.goBack();
          myConsole.log({ pid, i, index, price });
        } catch (err) {
          console.error({ pid, i, index, err });
        }
      }
    });
    for (let pid = 1; pid <= concurrency; ++pid) {
      cluster.queue({ concurrency, pid, url, item_selector, price_selector });
    }
    await cluster.idle();
    await cluster.close();
  } catch (err) {
    console.error(err);
  }
};

function dbFindAddress(address) {
  return new Promise((resolve, reject) => {
    var query = "SELECT * FROM Address WHERE city = ? AND street_name = ? AND street_num = ?";
    sql.query(query, [address.city, address.street_name, address.street_num], (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        console.log("address from db: ", res);
        resolve(res);
      }
    }
    );
  });
};

function getPostalCode(street_num, street_name, city, myConsole = console) {
  return new Promise(async resolve => {
    const existingAddress = await dbFindAddress({ street_num, street_name, city });
    if (existingAddress[0]) { // check for existing address in database
      resolve({ existingAddress: existingAddress[0], postal_code: existingAddress[0].postal_code });
      return;
    }
    try { // lookup postal code for new address
      const postal_code = await getPostalCodeAPI(street_num, street_name, city, myConsole);
      resolve({ existingAddress: null, postal_code });
    } catch (error) { // return null postal code as last resort
      myConsole.error(error);
      resolve({ existingAddress: null, postal_code: null });
    }
  });
};

async function getFakeUser(myConsole = console) {
  const data = await new Promise((resolve, reject) => {
    const options = {
      hostname: 'randomuser.me',
      port: 443,
      path: '/api/?inc=name,email,login',
      method: 'GET'
    };
    myConsole.log(`${options.method} ${options.hostname}${options.path}`);
    const req = https.request(options, res => {
      const all_chunks = [];
      res.on('data', chunk => {
        all_chunks.push(chunk);
      });
      res.on('end', () => {
        try {
          const body = Buffer.concat(all_chunks).toString();
          myConsole.log(
            `RETURNED STATUS ${res.statusCode}\nHEADERS:`,
            res.headers,
            '\nBODY:\n',
            body
          );
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
      });
    }).end();
  });
  const email = data.results[0].email.replace(/@.*/, '@uwaterloo.ca');
  const password = await encryptPassword(data.results[0].login.password);
  const first_name = data.results[0].name.first;
  const last_name = data.results[0].name.last;
  return { email, password, first_name, last_name };
};

async function getUser(myConsole = console) {
  const newUser = await getFakeUser(myConsole); // consider scraping real profiles on Bamboo (need an account)
  try {
    // check for existing user
    const { user_id } = await User.findOne(newUser.email);
    const userPostings = await User.getPostings(user_id);
    if (userPostings.length < 3) {
      return user_id;
    }
    return await getUser(myConsole);
  } catch (error) {
    return await User.signup(newUser);
  }
}

function dateToTerm(startDate, numMonths) {
  const w = 'winter', s = 'spring', f = 'fall';
  const termMatrix = [
    [w, s, f],
    [s, f, w],
    [f, w, s]
  ];
  const numTerms = numMonths >= 9 ? 3 : Math.ceil(numMonths / 4);
  const startTerm = (0 <= startDate.getMonth() && startDate.getMonth() <= 3) ? 0 :
    (4 <= startDate.getMonth() && startDate.getMonth() <= 7) ? 1 : 2;
  return termMatrix[startTerm].slice(0, numTerms).join(',');
};

function getEndDate(startDate, numMonths) {
  const date = new Date(startDate);
  const day = date.getDate();
  date.setMonth(date.getMonth() + numMonths);
  if (date.getDate() != day) { // day overflow
    date.setDate(0);
  }
  return date;
}

function parseGender(gender) {
  if (gender.toLowerCase() === 'male only') return 'male';
  else if (gender.toLowerCase() === 'female only') return 'female';
  else if (gender.toLowerCase().includes('coed')) return 'co-ed';
  else throw 'unhandled gender';
};

function generateTotalRooms(rooms_available) {
  if (rooms_available > 4) return rooms_available;
  return Math.floor(Math.random() * (6 - rooms_available) + rooms_available);
}

function generateDatetime(dateStr) {
  const hours = Math.floor(Math.random() * 20 + 6) % 24;
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  const date = new Date(dateStr);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date.toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '');
}

async function cleanData(data, myConsole = console) {
  // TODO: address validation
  const addressRegex = /((.*),\s*)?(\d+)\s+(.*),\s*(\w+(\s*\w+)*)/;
  const street_num = parseInt(data.address.match(addressRegex)[3]);
  const street_name = data.address.match(addressRegex)[4];
  const city = data.address.match(addressRegex)[5];
  const { existingAddress, postal_code } = await getPostalCode(street_num, street_name, city, myConsole);
  const address = new Address({ street_num, street_name, city, postal_code });
  myConsole.log(address);
  // TODO: posting validation
  const user_id = await getUser(myConsole);
  const startDate = new Date(data.start_date);
  const duration = parseInt(data.duration.replace(/(^\d+)(.+$)/i, '$1'));
  const endDate = getEndDate(startDate, duration);
  const rooms_available = parseInt(data.rooms_available);
  const laundryOptions = ['ensuite', 'same-floor', 'common', 'unavailable'];
  const created_at = generateDatetime(data.created_at.match(/\w+\s\d\d,\s\d\d\d\d/)[0]);
  const posting = new Posting({
    user_id,
    term: dateToTerm(startDate, duration),
    start_date: startDate.toISOString().replace(/T.*/, ''),
    end_date: endDate.toISOString().replace(/T.*/, ''),
    pop: Math.floor(Math.random() * 20),
    price_per_month: parseFloat(data.price.match(/\d+(\.\d\d)?/)[0]),
    gender_details: parseGender(data.gender),
    rooms_available,
    total_rooms: generateTotalRooms(rooms_available),
    ac: data.description.toLowerCase().match(/(ac)|(air conditioning)/) ? true : false,
    washrooms: parseInt(data.washrooms),
    wifi: data.description.toLowerCase().match(/wifi/) ? true : false,
    parking: data.description.toLowerCase().match(/parking/) ? true : false,
    laundry: laundryOptions[Math.floor(Math.random() * 4)],
    description: data.description,
    created_at,
    updated_at: created_at
  });
  myConsole.log(posting);
  return { posting, address, existingAddress };
}

async function bamboo_list_scraper({ browser, page, data: { pid, url, selectors, timeout } }) {
  const logStream = createWriteStream(`database/logs/scraped_page${pid}.log`);
  const myConsole = new console.Console(logStream, logStream);
  const {
    item_selector, start_date_selector, duration_selector, price_selector,
    gender_selector, rooms_available_selector, washrooms_selector,
    description_selector, created_at_selector, address_selector,
    preview_selector
  } = selectors;
  try {
    await page.goto(url, { timeout });
    myConsole.log(`Connected to ${url}`);
    await page.waitForSelector(item_selector);
    myConsole.log(`Page has loaded`);
    //save target of original page to know that this was the opener: 
    const pageTarget = page.target();
    const listLen = await page.evaluate(
      item_selector => document.querySelector(item_selector).parentElement.parentElement.childElementCount,
      item_selector
    );
    myConsole.log(`Found ${listLen} items`);
    for (let index = 0; index < listLen; ++index) {
      await page.evaluate((item_selector, ind) => {
        const el = document.querySelectorAll(item_selector)[ind];
        el.click();
      }, item_selector, index);
      myConsole.log(`Item clicked`);
      //check that the first page opened this new page:
      const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
      //get the new page object:
      const newPage = await newTarget.page();
      await newPage.setDefaultNavigationTimeout(timeout);
      await newPage.waitForNavigation({ waitUntil: 'networkidle0' });
      myConsole.log(`Item page loaded`);
      const data = await newPage.evaluate(
        (
          start_date_selector, duration_selector, price_selector, gender_selector,
          rooms_available_selector, washrooms_selector, description_selector,
          created_at_selector, address_selector
        ) => {
          return {
            start_date: document.querySelector(start_date_selector).innerText,
            duration: document.querySelector(duration_selector).innerText,
            price: document.querySelectorAll(price_selector)[1].innerText,
            gender: document.querySelector(gender_selector).innerText,
            rooms_available: document.querySelector(rooms_available_selector).innerText,
            washrooms: document.querySelector(washrooms_selector).innerText,
            description: document.querySelector(description_selector).innerText,
            created_at: document.querySelector(created_at_selector).innerText,
            address: document.querySelector(address_selector).innerText
          };
        },
        start_date_selector, duration_selector, price_selector, gender_selector,
        rooms_available_selector, washrooms_selector, description_selector,
        created_at_selector, address_selector
      );
      myConsole.log(data);
      await newPage.close();
      myConsole.log(`Item page closed`);

      // clean data
      let cleanedData = null;
      try {
        cleanedData = await cleanData(data, myConsole);
      } catch (error) {
        myConsole.error('Posting skipped due to error: ', error);
        continue;
      }
      const { posting, address, existingAddress } = cleanedData;
      const newPosting = await Posting.create(posting);
      if (existingAddress) {
        const addressOf = new AddressOf({
          posting_id: newPosting.posting_id,
          address_id: existingAddress.address_id,
        });
        await AddressOf.create(addressOf);
      } else {
        const newAddress = await Address.create(address);
        const addressOf = new AddressOf({
          posting_id: newPosting.posting_id,
          address_id: newAddress.address_id,
        });
        await AddressOf.create(addressOf);
      }

      // get photos
      const photos = await page.evaluate((preview_selector, ind) => {
        const photos = [];
        for (const el of document.querySelectorAll(preview_selector)[ind].children) {
          photos.push(el.querySelector('img').src);
        }
        return photos;
      }, preview_selector, index);
      myConsole.log('Found photos:\n', photos);
      // TODO: upload photos to S3
      for (const photo_url of photos) {
        await Photo.create(new Photo({
          posting_id: newPosting.posting_id,
          photo_url
        }));
      }
    }
    myConsole.log(`Finished scraping page list ${pid}`);
  } catch (err) {
    myConsole.error(err);
  } finally {
    logStream.end();
  }
};

async function bamboo_scraper() {
  try {
    const selectors = {
      item_selector: '.ui.items>.item>.desktoplisting',
      start_date_selector: '.calendar~.content>.description',
      duration_selector: '.clock~.content>.description',
      price_selector: '.ui.segment>h2.ui.header',
      gender_selector: '.man~.content>.description',
      rooms_available_selector: '.hashtag~.content>.description',
      washrooms_selector: '.avatar~.content>.description',
      description_selector: '.listingdescription',
      created_at_selector: '.ui.segment>h4.ui.header',
      address_selector: 'h1.header',
      preview_selector: '.ui.items>.item .slider'
    };
    const timeout = 90000; // ms
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER,
      maxConcurrency: 4,
      timeout
    });
    const paginationLen = 6; // update this to number of pages on target site
    await cluster.task(bamboo_list_scraper);
    for (let pid = 1; pid <= paginationLen; ++pid) {
      cluster.queue({
        pid,
        url: `https://bamboohousing.ca/homepage?page=${pid}&RoomsAvailable=&Coed=&StartTerm=&Ensuite=&LeaseType=&Price=`,
        selectors,
        timeout
      });
    }
    await cluster.idle();
    await cluster.close();
  } catch (err) {
    console.error(err);
  }
};

(async () => {
  deleteLogs();
  await bamboo_scraper();
  console.log(
    '\x1b[42m\x1b[30m', // bg-green fg-black
    'Finished scraping, DB connection still open!\nPress ctrl+c for now',
    '\x1b[0m' // reset color
  );
})();
