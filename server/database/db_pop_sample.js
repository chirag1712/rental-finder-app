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
          }, item_selector, pid + concurrency * i);
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

fb_scraper();