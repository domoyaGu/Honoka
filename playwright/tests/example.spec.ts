import { test, expect, chromium } from '@playwright/test';

test('淘宝', async ({  }) => {
   // // 你本地谷歌浏览器的路径
  // executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  const userDataDir = './path/to/directory';
  let context = await chromium.launchPersistentContext(userDataDir, {
      headless: false
  })
  // let context = await browser.newContext();
  let page = await context.newPage()
  // await page.goto('https://login.taobao.com/member/login.jhtml')
  // 监听请求 /user/detail 以获取 x-token
  // page.on('request', async (request) => {
  //   if (request.url().includes('/h5api.m.taobao.com/h5')) {
  //     const headers = request.headers();
  //     const state = await context.storageState();
  //     console.log(state)
  //   }
  // });

  // await page.getByPlaceholder('账号名/邮箱/手机号').click()
  // await page.getByPlaceholder('账号名/邮箱/手机号').fill('15862463336');
  // await page.getByPlaceholder('请输入登录密码').click();
  // await page.getByPlaceholder('请输入登录密码').fill('guyunqi62@HNK');
  // await page.locator('#baxia-dialog-content').contentFrame().getByLabel('滑块').click();
  
   
  await page.goto('https://www.vmall.com/product/comdetail/index.html?prdId=10086499369393')
  // await page.getByText('提交订单').click()
  // await page.getByRole('button').filter({hasText: '全选'}).click()
  // await new Promise<void>((r, rj) => {
  //   setTimeout(() => {
  //     r()
  //   }, 8000);
  // })

});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
