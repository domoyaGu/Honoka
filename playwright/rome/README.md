<h1 align="center">Welcome to Rome_Playwright 👋</h1>
<p>
</p>

## Install

```sh
npm install
```

## Usage

```sh
npm run dev ##  开发环境
npm run start ##  生产环境
```

## Show your support
## 文档
https://playwright.nodejs.cn/
## 初始化浏览器
  const browser = await chromium.launch();
## 创建新页面
  const page = await browser.newPage();
## 请求监听
  await page.route('**', async (route) => {
    await page.on('requestfailed', async (request) => {
        ##  网络请求失败
      console.log(request.url() + '---err:-------' + request.failure()?.errorText);
      ...
    });
    await page.on('requestfinished', (res) => {
##  网络请求成功
##  console.log('res---', res);
      ...
    });
    await page.on('response', (response) => {
##  监听网络请求结果
      console.log('response---', response);
      ...
    });
##  操作继续
    route.continue();
  });

##  自动等待事件结果
  await page.waitForEvent('requestfinished');

##  路由跳转
  await page.goto('http://localhost:8080/');
  ...

##  点击事件
  await page.getByText('业务管理').click();
  ...

##  延迟下一步操作
  await page.waitForTimeout(3000);

##  等待页面跳转完成
  await page.waitForURL('http://localhost:8080/#/manage');
  ...

##  文本输入
  await page.getByPlaceholder('请输入级联码').fill('uAtLZOtI');

##  自动等待元素准备好
  await page.waitForSelector('#subscribe-btn');

##  文件下载
  await page.getByText('点击下载模板').click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByText('点击下载模板').click()
  ]);
  console.log('download---', download);

##  图片上传
  const [fileChooser1] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: '图标: plus 上传图片' }).click()
  ]);
  await fileChooser1.setFiles('src/assets/5.jpg');

##  获取元素，等待元素可见
  const elementHandle = await page.$('text=级联目录');
  ##  监听滚动
  await elementHandle.scrollIntoViewIfNeeded({ timeout: 50 });
  ##  滚动到元素可见
  await elementHandle.isVisible();
  ...

##  截图，path可自定义，type：截图的图片格式
  await page.screenshot({
    path: picPath + 'view-tranle-modal-2.png',
    type: 'png'
  });
  ...

##  断言
  await expect(page).toHaveURL('http://localhost:8800/#/manage');

  await page.close();
  await browser.close();

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_