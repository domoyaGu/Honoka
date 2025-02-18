
const { isLogin } = require('./login.controller')
const request = require('request')
const fs = require('fs');
const axios = require('../../utils/axiosUtil');
const FormData = require('form-data')

/**
 * 力码批单
 */
class CorrectController {
  /**
   * 批单批改
   * @param {*} reqBody 
   * @returns 
   */
  async correct(reqBody) {
    return new Promise(async (resolve, reject) => {
      logger.info("————————————————————————————————批单开始————————————————————————————————————")
      const pageData = await isLogin(reqBody)
      // 判断cookie是否过期
      if (pageData) {
        const { browser, context, page } = pageData
        // 获取信息
        let employeeList = reqBody.employeeList || []
        let deleteList = reqBody.deleteList || []
        await page.goto('https://groupinsure.zhongbaounion.com/broker/salesmanindex/group_endorse_apply');
        logger.info("————————————————————————————————跳转完成————————————————————————————————————")
        const page1Promise = page.waitForEvent('popup');
        await page.locator('.order_content', {
          hasText: reqBody.orderNo
        }).locator('.operation').getByText('申请批改').click()
        const page1 = await page1Promise;
        // 强制拦截请求
        await page1.route('**/*', async route => {
          if (route.request().url().indexOf('/broker/groupendorse/applyEndorse') > -1) {
            let urlParam = route.request().postData().split('&')
            let orderNo = ''
            if (urlParam?.length > 0) {
              for(let i = 0; i < urlParam.length; i++) {
                const u = urlParam[i]
                let arr = u.split('=')
                orderNo = (arr?.length > 1 && arr[0] == 'endorse_uniqid') ? arr[1] : ''
                if (orderNo) break;
              }
            }
            console.log(orderNo)
            if (orderNo) {
              await route.continue();
              await page.close();
              await context.close();
              await browser.close();
              logger.info("————————————————————————————————浏览器已关闭————————————————————————————————————")
              resolve({
                status: 1,
                data: {
                  orderNo
                },
                msg: '第三方批单创建成功'
              })
            }
          } else {
            await route.continue();
          }
        });
        // 提交批单的弹窗确认
        page1.once('dialog', async (dialog) => {
          logger.info(`Dialog message: ${dialog.message()}`);
          if (dialog.message().includes('保存成功')) {
            dialog.dismiss().then(async () => {
              await new Promise((resolve2) => {
                setTimeout(async() => {
                  await page1.getByText('提交申请').click();
                  resolve2(2)
                }, 200);
              })
            }).catch(() => {});
          } else {
            logger.error(dialog.message());
            await page.close();
            await context.close();
            await browser.close();
            logger.info("————————————————————————————————浏览器已关闭————————————————————————————————————")
            resolve({
              status: 0,
              data: {
                msg: dialog.message()
              }
            })
          }
        })
        if (deleteList?.length > 0) {
          logger.info("————————————————————————————————开始批减————————————————————————————————————")
          for(let i = 0; i < deleteList.length; i++) {
            let e = deleteList[i]
            logger.info("————————————————————————————————批减人员————————————————————————————————————")
            logger.info(e)
            await page1.locator('.policy_member').filter({ hasText: e.idNo }).locator('.remove').click();
            logger.info("————————————————————————————————批减完成————————————————————————————————————")
          }
        }
        logger.info("————————————————————————————————开始录入————————————————————————————————————")
        for(let i = 0; i < employeeList.length; i++) {
          let e = employeeList[i]
          logger.info("————————————————————————————————录入人员————————————————————————————————————")
          logger.info(e)
          await page1.locator('span').filter({ hasText: /^添加人员$/ }).click();
          // 姓名
          await page1.getByRole('textbox').nth(1).click();
          await page1.getByRole('textbox').nth(1).fill(e.name);
          // 证件类型
          await page1.getByRole('combobox').first().selectOption(e.idType);
          // 证件号
          await page1.getByRole('textbox').nth(2).click();
          await page1.getByRole('textbox').nth(2).fill(e.idNo);
          // 性别
          // await page1.getByText({'1': '男', '2': '女'}[e.sex]).nth(1).click();
          // 职业
          await page1.getByRole('combobox').nth(1).selectOption(e.occupationName);
          // 如果有弹框提示则关闭
          // page1.once('dialog', dialog => {
          //   console.log(`Dialog message: ${dialog.message()}`);
          //   dialog.dismiss().catch(() => {});
          // });
          await page1.getByText('保存').first().click();
          logger.info("————————————————————————————————录入完成————————————————————————————————————")
        }
        logger.info("————————————————————————————————点击提交批单————————————————————————————————————")
        await page1.locator('.save-endorse-btn').getByText('提交批单').click();
        logger.info("————————————————————————————————点击提交批单完成————————————————————————————————————")
      } else {
        resolve({
          status: -1,
          message: '登录信息更新失败',
        })
      }
    })
  }

  /**
   * 批单支付
   * @param {*} reqBody 
   * @returns 
   */
  async correctPay(reqBody) {
    return new Promise(async (resolve, reject) => {
      logger.info("————————————————————————————————获取批单支付链接开始————————————————————————————————————")
      const pageData = await isLogin(reqBody)
      // 判断cookie是否过期
      if (pageData) {
        const { browser, page } = pageData
        await page.goto('https://groupinsure.zhongbaounion.com/broker/salesmanindex/info?type=group_endorse');
        logger.info("————————————————————————————————跳转完成————————————————————————————————————")
        // 根据投保人名字搜索
        await page.locator('#search_key').click()
        await page.locator('#search_key').fill(reqBody.insureName)
        await page.locator('.search-name-btn').click()
        logger.info('投保人搜索完成')
        // 监听链接提前开启
        const page1Promise = page.waitForEvent('popup');
        // 点击前往支付
        await page.locator('.order_content', {
          hasText: reqBody.orderNo
        }).locator('.operation').getByText('前往支付').click()
        logger.info('点击前往支付')
        const page1 = await page1Promise;
        let url = await page1.url()
        logger.info('跳转链接',url)
        page1.close()
        page.close()
        browser.close()
        logger.info('浏览器已关闭')
        resolve({
          status: 200,
          data: url
        })
      } else {
        await page.close();
        await browser.close();
        resolve({
          status: -1,
          message: '登录信息更新失败',
        })
      }
    })
  }

  /**
   * 下载保单
   */
  async downloadPolicy(reqBody) {
    return new Promise(async (resolve, reject) => {
      // 判断cookie是否过期
      const pageData = await isLogin(reqBody)
      if (pageData) {
        const { browser, page } = pageData
        await page.goto('https://groupinsure.zhongbaounion.com/broker/salesmanindex/info');
        logger.info("————————————————————————————————跳转完成————————————————————————————————————")
        // 根据投保人名字搜索
        await page.locator('#search_key').click()
        await page.locator('#search_key').fill(reqBody.insureName)
        await page.locator('.search-name-btn').click()
        logger.info('投保人搜索完成')
        // 监听链接提前开启
        const page1Promise = page.waitForEvent('popup');
        // 点击前往pdf
        await page.locator('.order_content', {
          hasText: reqBody.orderUnique
        }).locator('.operation').getByText('电子版保单').click()
        logger.info('点击前往pdf')
        const page1 = await page1Promise;
        let pdfUrl = await page1.url();
        logger.info('pdf链接',pdfUrl);
        const path = './src/payFiles/保单.pdf'
        request(pdfUrl)
        .pipe(fs.createWriteStream(path))
        .on('close', async() => {
          try {
            logger.info('文件已保存到：', path, '文件开始上传');
            // 读取文件并添加到 FormData
            const formData = new FormData();
            const fileStream = fs.createReadStream(path);
            formData.append('file', fileStream);
            axios({
              url: `/user/file/uploadFile`, 
              method: 'post',
              data: formData,
              headers: {
                ...formData.getHeaders()
              }
            }).then(async (res) => {
              logger.info('文件上传返回：', res);
              // 上传成功后删除下刚刚上传的文件
              fs.unlink(path, (err) => {
                if (err) {
                  logger.error(err);
                  return;
                }
                logger.info(`${path}文件删除成功`);
              });
              await page.close();
              await browser.close();
              logger.info('浏览器已关闭');
              resolve(res)
            }).catch(async (err) => {
              await page.close();
              await browser.close();
              logger.info('浏览器已关闭');
              resolve({
                status: -1,
                message: '文件下载出错',
                error: err
              })
            })
          } catch(err) {
            logger.error(err)
            await page.close();
            await browser.close();
            logger.info('浏览器已关闭');
            resolve({
              status: -1,
              message: '文件出错',
              error: err
            })
          }
        });
      } else {
        resolve({
          status: -1,
          message: '登录信息更新失败',
        })
      }
    })
  }
}

module.exports = new CorrectController()
