import { test, expect, chromium } from '@playwright/test';

test('huawei', async ({  }) => {
   // // 你本地谷歌浏览器的路径
  // let browser = await chromium.launch({
  //   headless: false,
  //   executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  // })
  // let page = await browser.newPage()
  const userDataDir = './path/to/huawei';
  let context = await chromium.launchPersistentContext(userDataDir, {
      headless: false
  })
  let page = await context.newPage()
  await page.goto('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E5%8D%8E%E4%B8%BA&fenlei=256&rsv_pq=0xd39f2ee5000930d9&rsv_t=4d41zDtCrWMnXm5k3j%2FTKGYq8RGPDfKF9g5aiPxU3s90RLxQdplGKJtGaRZ4&rqlang=en&rsv_enter=1&rsv_dl=tb&rsv_sug3=8&rsv_sug1=7&rsv_sug7=100&rsv_sug2=0&rsv_btype=i&prefixsug=%25E5%258D%258E%25E4%25B8%25BA&rsp=5&inputT=696&rsv_sug4=1842')
  
  await new Promise<void>((r, rj) => {
    setTimeout(() => {
      r()
    }, 30000);
  })
  await page.goto('https://www.vmall.com/product/comdetail/index.html?prdId=10086499369393&sbomCode=2601010506011')
  let a = 0
  while(await page.getByText('立即购买').count() == 0) {
    if (a == 0) {
      await page.getByText('16GB+512GB', { exact: true }).click();
      a = 1
    } else {
      await page.getByText('16GB+1TB', { exact: true }).click();
      a = 0
    }
  }
  await page.locator('#product_content_box').getByText('立即购买').click()
  const page1Promise = page.waitForEvent('popup');
  const page1 = await page1Promise;
  await page1.waitForLoadState();
  await new Promise<void>((r, rj) => {
    setTimeout(() => {
      r()
    }, 5);
  })
  await page1.locator('#checkoutSubmit').click()
  await new Promise<void>((r, rj) => {
    setTimeout(() => {
      r()
    }, 120000);
  })
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
