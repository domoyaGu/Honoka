
const { isLogin } = require('./login.controller')

/**
 * 力码支付链接
 */
class PayController {
  /**
   * 支付上传材料
   * @param {*} reqBody 
   * @returns 
   */
  async payFiles(reqBody) {
    return new Promise(async (resolve, reject) => {
      try {
        // 判断cookie是否过期
        const pageData = await isLogin(reqBody)
        if (pageData) {
          const { browser, page } = pageData
          await page.goto(`https://groupinsure.zhongbaounion.com/broker/file/uploadUnderwrite?order_uniqid=${reqBody.orderUnique}&sign=${reqBody.sign}`);
          // 支付确认书链接数组
          let files = reqBody.confirmationFile?.split(',') || []
          logger.info(files)
          if (files?.length > 0) {
            page.on('response', async (response) => {
              if (response.url()?.indexOf('/broker/index/uploadBase64Image') > -1 || response.url()?.indexOf('/broker/index/upload') > -1) {
                // 上传完成后判断还有没有文件未上传的则继续上传
                if (files?.length > 0) {
                  // 取第一个文件链接
                  const fileUrl = files.shift()
                  const path = `./src/payFiles/${fileUrl.substring(fileUrl.indexOf('file') + 5, fileUrl.length)}`;
                  // 本地保存路径（用fs包解析）
                  request(fileUrl)
                    .pipe(fs.createWriteStream(path))
                    .on('close', async() => {
                      try {
                        logger.info('文件已保存到：', path, '文件开始上传')
                        const fileChooserPromise = page.waitForEvent('filechooser');
                        await page.locator('.upfile').click()
                        const fileChooser = await fileChooserPromise;
                        await fileChooser.setFiles(path);
                      } catch(err) {
                        logger.error(err)
                        await page.close();
                        await browser.close();
                        resolve({
                          status: -1,
                          message: '文件上传出错',
                          error: err
                        })
                      }
                    });
                } else {
                  // 上传完成点击提交支付
                  await page.getByText('提交支付').click()
                  logger.info('点击提交')
                  await page.close();
                  await browser.close();
                  logger.info('浏览器已关闭');
                  resolve({
                    status: 200,
                    message: '材料提交完成'
                  })
                }
              }
            });
            // 取第一个文件链接
            const fileUrl = files.shift()
            const path = `./src/payFiles/${fileUrl.substring(fileUrl.indexOf('file') + 5, fileUrl.length)}`;
            // 本地保存路径（用fs包解析）
            request(fileUrl)
              .pipe(fs.createWriteStream(path))
              .on('close', async() => {
                try {
                  logger.info('文件已保存到：', path, '文件开始上传')
                  const fileChooserPromise = page.waitForEvent('filechooser');
                  await page.locator('.upfile').click()
                  const fileChooser = await fileChooserPromise;
                  await fileChooser.setFiles(path);
                  // 上传成功后删除下刚刚上传的图片
                  fs.unlink(path, (err) => {
                    if (err) {
                      logger.error(err);
                      return;
                    }
                    logger.info(`${path}文件删除成功`);
                  });
                } catch(err) {
                  logger.error(err)
                  await page.close();
                  await browser.close();
                  logger.info('浏览器已关闭');
                  resolve({
                    status: -1,
                    message: '文件上传出错',
                    error: err
                  })
                }
              });
          } else {
            await page.close();
            await browser.close();
            logger.info('浏览器已关闭');
            resolve({
              status: -1,
              message: '未上传确认书',
            })
          }
        } else {
          resolve({
            status: -1,
            message: '登录信息更新失败',
          })
        }
      } catch (err) {
        logger.error(err)
        resolve({
          status: -1,
          message: '自动化脚本出错，请联系开发人员',
        })
      }
    })
  }
  
  async pay(reqBody) {
    return new Promise(async (resolve, reject) => {
      logger.info("————————————————————————————————获取支付链接开始————————————————————————————————————")
      const pageData = await isLogin(reqBody)
      // 判断cookie是否过期
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
}

module.exports = new PayController()
