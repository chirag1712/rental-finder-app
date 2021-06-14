const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');

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
    // const address_selector = 'body>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>span';
    // const browser = await puppeteer.launch({ devtools: true });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    // console.log(`Connected to ${url}`);
    await page.waitForSelector(item_selector);
    // console.log(`Page has loaded`);
    //save target of original page to know that this was the opener: 
    const pageTarget = page.target();
    const listLen = await page.evaluate(
      sel => document.querySelector(sel).parentElement.parentElement.childElementCount,
      item_selector
    );
    for (let index = 0; index < listLen; ++index) {
      await page.evaluate((sel, ind) => {
        const el = document.querySelectorAll(sel)[ind];
        el.click();
      }, item_selector, index);
      // console.log(`Item clicked`);
      //check that the first page opened this new page:
      const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
      //get the new page object:
      const newPage = await newTarget.page();
      await newPage.waitForNavigation({ waitUntil: 'networkidle0' });
      // console.log(`Item page loaded`);
      const data = await newPage.evaluate(
        (
          start_date_selector, duration_selector, price_selector, gender_selector,
          rooms_available_selector, description_selector
        ) => {
          return {
            start_date: document.querySelector(start_date_selector).innerText,
            duration: document.querySelector(duration_selector).innerText,
            price: document.querySelectorAll(price_selector)[1].innerText,
            gender: document.querySelector(gender_selector).innerText,
            rooms_available: document.querySelector(rooms_available_selector).innerText,
            description: document.querySelector(description_selector).innerText
          };
        },
        start_date_selector, duration_selector, price_selector, gender_selector,
        rooms_available_selector, description_selector
      );
      console.log(data);
      await newPage.close();
    }
    await browser.close();
  } catch (err) {
    console.error(err);
  }
};

bamboo_scraper();