const { sql, getPostalCodeAPI } = require('./db_fill_missing_postal_codes.js');
const { createWriteStream, readdirSync, unlinkSync } = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const Cluster = require('./my-puppeteer-cluster/Cluster.js').default;
const https = require('https');
const bcrypt = require('bcrypt');
const User = require('../app/models/user.model.js');
const { Posting, Address, AddressOf } = require('../app/models/posting.model.js');

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

async function getFakeUser(myConsole = console) {
  const data = await new Promise((resolve, reject) => {
    const options = { hostname: 'randomuser.me', port: 443, path: '/api/', method: 'GET' };
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
  const first_name = data.results[0].name.first;
  const last_name = data.results[0].name.last;
  const email = data.results[0].email.replace(/@.*/, '@uwaterloo.ca');
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(data.results[0].login.password, salt);
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

function dateToTerm(startDate, duration) {
  const w = 'winter', s = 'spring', f = 'fall';
  const termMatrix = [
    [w, s, f],
    [s, f, w],
    [f, w, s]
  ];
  const numTerms = duration >= 9 ? 3 : Math.ceil(duration / 4);
  const option = (1 <= startDate.getMonth() && startDate.getMonth() <= 4) ? 0 :
    (5 <= startDate.getMonth() && startDate.getMonth() <= 8) ? 1 : 2;
  return termMatrix[option].slice(0, numTerms).join(',');
};

function parseGender(gender) {
  if (gender.toLowerCase() === 'male only') return 'male';
  else if (gender.toLowerCase() === 'female only') return 'female';
  else if (gender.toLowerCase().includes('coed')) return 'co-ed';
  else throw 'unhandled gender';
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
      resolve({ existingAddress: null, postal_code: null });
    }
  });
};

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
  const endDate = new Date(startDate.setMonth(startDate.getMonth() + duration));
  const created_at = new Date(data.created_at.match(/\w+\s\d\d,\s\d\d\d\d/)[0]).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  const posting = new Posting({
    user_id,
    term: dateToTerm(startDate, duration),
    start_date: startDate.toISOString().replace(/T.*/, ''),
    end_date: endDate.toISOString().replace(/T.*/, ''),
    price_per_month: parseFloat(data.price.match(/\d+(\.\d\d)?/)[0]),
    gender_details: parseGender(data.gender),
    rooms_available: parseInt(data.rooms_available),
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
    gender_selector, rooms_available_selector, description_selector,
    created_at_selector, address_selector
  } = selectors;
  try {
    await page.goto(url, { timeout });
    myConsole.log(`Connected to ${url}`);
    await page.waitForSelector(item_selector);
    myConsole.log(`Page has loaded`);
    //save target of original page to know that this was the opener: 
    const pageTarget = page.target();
    const listLen = await page.evaluate(
      sel => document.querySelector(sel).parentElement.parentElement.childElementCount,
      item_selector
    );
    myConsole.log(`Found ${listLen} items`);
    for (let index = 0; index < listLen; ++index) {
      await page.evaluate((sel, ind) => {
        const el = document.querySelectorAll(sel)[ind];
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
          rooms_available_selector, description_selector, created_at_selector,
          address_selector
        ) => {
          return {
            start_date: document.querySelector(start_date_selector).innerText,
            duration: document.querySelector(duration_selector).innerText,
            price: document.querySelectorAll(price_selector)[1].innerText,
            gender: document.querySelector(gender_selector).innerText,
            rooms_available: document.querySelector(rooms_available_selector).innerText,
            description: document.querySelector(description_selector).innerText,
            created_at: document.querySelector(created_at_selector).innerText,
            address: document.querySelector(address_selector).innerText
          };
        },
        start_date_selector, duration_selector, price_selector, gender_selector,
        rooms_available_selector, description_selector, created_at_selector,
        address_selector
      );
      myConsole.log(data);
      await newPage.close();
      myConsole.log(`Item page closed`);

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
        AddressOf.create(addressOf);
      } else {
        const newAddress = await Address.create(address);
        const addressOf = new AddressOf({
          posting_id: newPosting.posting_id,
          address_id: newAddress.address_id,
        });
        AddressOf.create(addressOf);
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
      description_selector: '.listingdescription',
      created_at_selector: '.ui.segment>h4.ui.header',
      address_selector: 'h1.header'
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
