const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');
const https = require('https');
const bcrypt = require('bcrypt');
const User = require('../app/models/user.model.js');
const { Posting, Address, AddressOf } = require('../app/models/posting.model.js');

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
      // console.log(`Connected to ${url}`);
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
          // console.log(`Page has loaded`);
          await page.evaluate((sel, ind) => {
            const el = document.querySelectorAll(sel)[ind];
            el.click();
          }, item_selector, index);
          // console.log(`Item clicked`);
          await page.waitForSelector(price_selector);
          // console.log(`Item page loaded`);
          const price = await page.evaluate(sel => document.querySelector(sel).innerText, price_selector);
          await page.goBack();
          console.log({pid, i, index, price});
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

const bamboo_scraper = async () => {
  try {
    const url = 'https://bamboohousing.ca/homepage';
    const item_selector = '.ui.items>.item>.desktoplisting';
    const start_date_selector = '.calendar~.content>.description';
    const duration_selector = '.clock~.content>.description';
    const price_selector = '.ui.segment>h2.ui.header';
    const gender_selector = '.man~.content>.description';
    const rooms_available_selector = '.hashtag~.content>.description';
    const description_selector = '.listingdescription';
    const created_at_selector = '.ui.segment>h4.ui.header';
    const address_selector = 'h1.header';
    // const browser = await puppeteer.launch({ devtools: true });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    console.log(`Connected to ${url}`);
    await page.waitForSelector(item_selector);
    console.log(`Page has loaded`);
    //save target of original page to know that this was the opener: 
    const pageTarget = page.target();
    const listLen = await page.evaluate(
      sel => document.querySelector(sel).parentElement.parentElement.childElementCount,
      item_selector
    );
    console.log(`Found ${listLen} items`);
    for (let index = 0; index < listLen; ++index) {
      await page.evaluate((sel, ind) => {
        const el = document.querySelectorAll(sel)[ind];
        el.click();
      }, item_selector, index);
      console.log(`Item clicked`);
      //check that the first page opened this new page:
      const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
      //get the new page object:
      const newPage = await newTarget.page();
      await newPage.waitForNavigation({ waitUntil: 'networkidle0' });
      console.log(`Item page loaded`);
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
      console.log(data);
      await newPage.close();
      console.log(`Item page closed`);

      const newUser = await createNewUser(); // consider scraping real profiles on Bamboo (need an account)
      // TODO: user validation
      const user_id = await User.signup(newUser);
      // TODO: posting validation
      const startDate = new Date(data.start_date);
      const duration = parseInt(data.duration.replace(/(^\d+)(.+$)/i, '$1'));
      const endDate = new Date(startDate.setMonth(startDate.getMonth() + duration));
      const posting = new Posting({
        user_id,
        term: dateToTerm(startDate, duration),
        start_date: startDate.toISOString().replace(/T.*/, ''),
        end_date: endDate.toISOString().replace(/T.*/, ''),
        price_per_month: parseFloat(data.price.match(/\d+(\.\d\d)?/)[0]),
        gender_details: parseGender(data.gender),
        rooms_available: parseInt(data.rooms_available),
        description: data.description,
        created_at: new Date(data.created_at.match(/\w+\s\d\d,\s\d\d\d\d/)[0]).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      });
      const newPosting = await Posting.create(posting);
      // TODO: address validation
      const address = new Address({
        street_num: parseInt(data.address.match(/\d+/)[0]),
        street_name: data.address.match(/(?:[A-Z][a-z.-]+[ ]?)+/)[0], // copied from stackoverflow should rework validations some day
        city: data.address.match(/\w*$/)[0],
        postal_code: randomPostalCode(), // try to find alternative
      });
      console.log(address);
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
    console.log('Browser closed');
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