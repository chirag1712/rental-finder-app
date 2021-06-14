const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');

(async () => {
  try {
    const url = 'https://www.facebook.com/marketplace/112763262068685/propertyrentals';
    const item_selector = 'div>div>div>span>div>div>a[role="link"][tabindex="0"]';
    const address_selector = 'body>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>span';
    // const url = 'https://bamboohousing.ca/homepage';
    // const item_selector = '.ui.items .item .desktoplisting';

    // const browser = await puppeteer.launch({ headless: false, devtools: true });
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.goto(url);
    // console.log(`Connected to ${url}`);

    // await page.waitForSelector(item_selector);
    // await page.evaluate(sel => {
    //   const el = document.querySelectorAll(sel)[0];
    //   el.click();
    // }, item_selector);

    // await page.waitForSelector(address_selector);
    // const address = await page.evaluate(sel => document.querySelector(sel).innerText, address_selector);
    // console.log(address);

    // await page.goBack();
    // await page.waitFor(2000);

    const concurrency = 5;
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: concurrency,
    });
    await cluster.task(async ({ page, data: { pid, url, item_selector, address_selector } }) => {
      for (let i = 1; i <= 10; ++i) { // 5 crawlers * 10 posts = 50 posts
        await page.goto(url);
        console.log(`Connected to ${url}`);
        await page.waitForSelector(item_selector);
        if (i > 3) { // start scrolling to load more posts
          const oldLen = await page.evaluate(sel => {
            return document.querySelector(sel)
            .parentElement.parentElement.parentElement
            .parentElement.parentElement.parentElement
            .childElementCount;
          }, item_selector);
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.evaluate(async (sel, oldLen) => {
            return await new Promise(resolve => {
              const checkLoaded = setInterval(resolve => {
                const newLen = document.querySelector(sel)
                .parentElement.parentElement.parentElement
                .parentElement.parentElement.parentElement
                .childElementCount;
                if (newLen > oldLen) {
                  clearInterval(checkLoaded);
                  resolve();
                  return;
                }
              }, 0, resolve);
            });
          }, item_selector, oldLen);
        }
        console.log(`Page has loaded`);
        await page.evaluate((sel, ind) => {
          const el = document.querySelectorAll(sel)[ind];
          el.click();
        }, item_selector, pid * i);
        console.log(`Item clicked`);
        await page.waitForSelector(address_selector);
        console.log(`Item page loaded`);
        const address = await page.evaluate(sel => document.querySelector(sel).innerText, address_selector);
        console.log(address);
        await page.goBack();
      }
    });
    for (let pid = 0; pid < concurrency; ++pid) {
      cluster.queue({ pid, url, item_selector, address_selector });
    }
    await cluster.idle();
    await cluster.close();

    // await browser.close();
  } catch (err) {
    console.error(err);
  }
})();