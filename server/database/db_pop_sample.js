const { createWriteStream } = require('fs');
const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');
const https = require('https');
const bcrypt = require('bcrypt');
const User = require('../app/models/user.model.js');
const { Posting, Address, AddressOf } = require('../app/models/posting.model.js');

// WIP boilerplate for the future
const fb_scraper = async () => {
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
          myConsole.log({pid, i, index, price});
        } catch (err) {
          console.error({pid, i, index, err});
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

const bamboo_list_scraper = async ({ browser, page, data: { pid, url, selectors } }) => {
  const logStream= createWriteStream(`database/logs/scraped_page${pid}.log`);
  const myConsole = new console.Console(logStream, logStream);
  try {
    const {
      item_selector, start_date_selector, duration_selector, price_selector,
      gender_selector, rooms_available_selector, description_selector,
      created_at_selector, address_selector
    } = selectors;
    await page.goto(url, { timeout: 60000 });
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

      const newUser = await createNewUser(); // consider scraping real profiles on Bamboo (need an account)
      // TODO: user validation
      const user_id = await User.signup(newUser);
      // TODO: posting validation
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
      const newPosting = await Posting.create(posting);
      // TODO: address validation
      const addressRegex = /((.*),\s*)?(\d+)\s+(.*),\s*(\w+(\s*\w+)*)/;
      const address = new Address({
        street_num: parseInt(data.address.match(addressRegex)[3]),
        street_name: data.address.match(addressRegex)[4],
        city: data.address.match(addressRegex)[5],
        postal_code: randomPostalCode(), // should improve this
      });
      myConsole.log(address);
      // Copied from controller for now
      const foundAddress = await Address.search(address);
      if (foundAddress[0]) {
        const addressOf = new AddressOf({
          posting_id: newPosting.posting_id,
          address_id: foundAddress[0].address_id,
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
    await browser.close();
    myConsole.log('Browser closed');
  } catch (err) {
    console.error(err);
  } finally {
    logStream.end();
  }
};

const bamboo_scraper = async () => {
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
    // const cluster = await Cluster.launch({
    //   concurrency: Cluster.CONCURRENCY_BROWSER,
    //   maxConcurrency: 5,
    //   timeout: 90000 // ms
    // });
    const paginationLen = 1; // WIP can only scrape 1st page for now
    // await cluster.task(bamboo_list_scraper);
    // for (let pid = 1; pid <= paginationLen; ++pid) {
    //   cluster.queue({
    //     pid,
    //     url: `https://bamboohousing.ca/homepage?page=${pid}&RoomsAvailable=&Coed=&StartTerm=&Ensuite=&LeaseType=&Price=`,
    //     selectors
    //   });
    // }
    // await cluster.idle();
    // await cluster.close();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    for (let pid = 1; pid <= paginationLen; ++pid) {
      await bamboo_list_scraper({ browser, page, data: {
        pid,
        url: `https://bamboohousing.ca/homepage?page=${pid}&RoomsAvailable=&Coed=&StartTerm=&Ensuite=&LeaseType=&Price=`,
        selectors
      } });
    }
  } catch (err) {
    console.error(err);
  }
};

const getFakeUser = async () => {
  return await new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: 'randomuser.me', port: 443, path: '/api/', method: 'GET' },
      res => {
        let body = '';
        res.on('data', chunk => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(err);
          }
        });
      }
    ).end();
  });
};

const createNewUser = async () => {
  const data = await getFakeUser();
  const first_name = data.results[0].name.first;
  const last_name = data.results[0].name.last;
  const email = `${data.results[0].email.replace(/@.*/, '')}@uwaterloo.ca`;
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(data.results[0].login.password, salt);
  return { email, password, first_name, last_name };
};


const dateToTerm = (startDate, duration) => {
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

const parseGender = gender => {
  if (gender.toLowerCase() === 'male only') return 'male';
  else if (gender.toLowerCase() === 'female only') return 'female';
  else if (gender.toLowerCase().includes('coed')) return 'co-ed';
  else throw 'unhandled gender';
};

const randomPostalCode = () => {
  const nums = [1, 2, 3].map(() => Math.floor(Math.random() * 10));
  const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
  const chars = ['A', 'B'].map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
  return `N${nums[0]}${chars[0]}${nums[1]}${chars[1]}${nums[2]}`;
};

(async () => {
  await bamboo_scraper();
  console.log('Finished scraping, DB connection still open!\nPress ctrl+c for now');
})();