// 太保1至6类团意险

const request = require('request');
const { isLogin } = require('../login.controller')
const fs = require('fs');
const loginController = require('../../login.controller');

class OrderController {
  /**
   * 生成订单
   * @param {*} reqBody 
   * @returns 
   */
  async order(reqBody) {
    return new Promise( async (resolve, reject) => {
      // 获取保障内容
      let typeBeanList = reqBody.typeBeanList
      let typeBeanObject = {}
      typeBeanList.forEach(ele => {
        if (ele.typeStr === '保障内容') {
          // 选择保额
          typeBeanObject['safeguardContent'] = ele.optionName
        }
      });
      // 人员列表
      let employeeList = reqBody.orderGroupBean.employeeList
      // 本地营业执照保存路径（用fs包解析）
      const imgPath = `./src/images/${reqBody.id}.jpg`;
      logger.info("图片路径：", imgPath)
      try {
         // 判断token是否过期
        const pageData = await isLogin(reqBody)
        if (pageData) {
          const { browser, page } = pageData
          logger.info('太保外墙施工雇主险（年单特别版）')

          // 等待倒计时弹窗的出现
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(true)
            }, 8000)
          })
          // 判断是否出现
          if (await page.locator('div').filter({ hasText: /^0$/ }).locator('i').count() !== 0) {
            await page.locator('div').filter({ hasText: /^0$/ }).locator('i').click();
          }
          
          // 等待倒计时弹窗消失后的待处理订单弹窗出现
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(true)
            }, 2000)
          })

          // 判断是否出现
          if (!await page.locator('.el-message-box__wrapper').isHidden()) {
              await page.locator('.el-message-box__wrapper').filter({ hasText: '请及时进行续保操作！' })
              .locator('.el-message-box__btns').getByText('取消').click()
          }
          
          
          page.on('dialog', async dialog => {
            console.log(dialog.type());
            logger.info(await dialog.accept())
          });
          // 监听
          page.on('response', async (response) => {
            if (response.url()?.indexOf('pro.boweibx.com/dist/distInsure/checkUnit') > -1) {
              response.json().then(async res => {
                // 投保企业（上传营业执照可自动识别企业信息）确认成功 originCode '200' 成功； '300' 失败，可以返回后端错误信息
                if (res.originCode == '200') {
                  
                  // await page.close();
                  // await browser.close();
                } else {
                  resolve({
                    status: -1,
                    message: '自动化脚本出错，请联系开发人员',
                    error: err
                  })
                  await page.close();
                  await browser.close();
                }
              })
            } else if (response.url()?.indexOf('pro.boweibx.com/dist/bowei/object?path=/v2/insure/v2/calc_apply') > -1) {
              // 计算保费  计算成功 originCode '0'
              response.json().then(async res => {
                if (res.originCode === '0') {
                  
                  // await page.close();
                  // await browser.close();
                } else {
                  resolve({
                    status: -1,
                    message: '自动化脚本出错，请联系开发人员',
                    error: err
                  })
                  await page.close();
                  await browser.close();
                }
              })
            } else if (response.url()?.indexOf('pro.boweibx.com/dist/distInsure/pay') > -1) {
              // 在线支付
              response.json().then(async res => {
                if (res.originCode === "200") {
                  resolve({
                    code: 200,
                    payUrl: res.data.payUrl,
                    sign: res.data.orderId
                  })
                  // await page.close();
                  // await browser.close();
                } else {
                  resolve({
                    status: -1,
                    message: '自动化脚本出错，请联系开发人员',
                    error: err
                  })
                  await page.close();
                  await browser.close();
                }
              })
            }
          });
          /**
           * 先写死后面需要动态
           */
          
          await page.goto(`https://pro.boweibx.com/#/insuranceCenter/entryCenter/428?act=new&pageId=1726709589273-be13-9d7f-b5b2-9c34235c34ff&insureType=6&sourceProductId=428&productId=419`);
          /**--------------------------关闭建议通知-------------------------------------**/
          await page.getByText('太忙了，稍后查看').click()
          /**--------------------------投保企业（上传营业执照可自动识别企业信息）------------**/
          // 营业执照
          // 图片链接
          const imageUrl = reqBody.orderGroupBean.businessLicenseUrl;
          logger.info(imageUrl)
          // 本地保存路径（用fs包解析）
          const localPath = `./src/images/${reqBody.id}.jpg`;
          // 上传营业执照解析接口
          const responsePromiseYYZZ = page.waitForResponse('https://pro.boweibx.com/dist/distInsure/parseLicense');
          await request(imageUrl)
            .pipe(fs.createWriteStream(localPath))
            .on('close', async() => {
              try {
                logger.info('营业执照已保存到：', localPath, '文件开始上传')
                const fileChooserPromise = page.waitForEvent('filechooser');
                await page.locator('.el-tab-pane').locator('.el-card').filter({ hasText: '投保企业（上传营业执照可自动识别企业信息）' }).locator('.el-icon-plus').first().click();
                const fileChooser = await fileChooserPromise;
                await fileChooser.setFiles(localPath);
              } catch(err) {
                logger.error(err)
                await page.close();
                await browser.close();
                resolve({
                  status: -1,
                  message: '自动化脚本出错，请联系开发人员',
                  error: err
                })
              }
            });
          const responseYYZZ = await responsePromiseYYZZ;
          await responseYYZZ.json().then(async res => {
            // 删除下刚刚上传的图片
            fs.unlink(imgPath, (err) => {
              if (err) {
                logger.error(err);
                return;
              }
              logger.info('文件删除成功');
            });
            // originCode '0' 成功 '1' 失败
            if (res.originCode == '0') {
              await page.getByPlaceholder('请填写企业授权人的手机号').fill(reqBody.orderGroupBean.legalPersonMobile);
              await page.getByPlaceholder('所在地区').click();
              const handleAddressStr = reqBody.orderGroupBean.addressStr.split(',').join(' / ')
              page.keyboard.insertText(handleAddressStr);
              await page.locator('li').filter({ hasText: handleAddressStr }).click();
            } else {
              resolve({
                status: -1,
                message: '自动化脚本出错，请联系开发人员',
                error: err
              })
              await page.close();
              await browser.close();
            }
          })

          // await page.getByPlaceholder('请填写企业授权人的手机号').fill(reqBody.orderGroupBean.legalPersonMobile);
          // await page.getByPlaceholder('所在地区').click();
          // const handleAddressStr = reqBody.orderGroupBean.addressStr.split(',').join(' / ')
          // page.keyboard.insertText(handleAddressStr);
          // await page.locator('li').filter({ hasText: handleAddressStr }).click();

          // 行业信息暂且为测试
          // await page.locator('.el-tab-pane').locator('.el-card')
          //   .filter({ hasText: '投保企业（上传营业执照可自动识别企业信息）' }).getByPlaceholder('请选择行业').click();
          // page.evaluate(`
          //   document.querySelector('input.el-input__inner[placeholder="请选择行业"]').removeAttribute('readonly')
          // `);
          // await page.keyboard.insertText('制造业');
          // await page.locator('li').filter({ hasText: '制造业' }).locator('visible=true').click()

          await page.locator('.el-tab-pane').locator('.el-card')
            .filter({ hasText: '投保企业（上传营业执照可自动识别企业信息）' }).getByText('确认').click();

          await page.locator('.el-tab-pane').locator('.el-card')
            .filter({ hasText: '投保企业（上传营业执照可自动识别企业信息）' }).getByText('修改').waitFor();

          /**--------------------------保障方案----------------------------------------**/
          
          await page.getByPlaceholder('请选择保额').click();
          logger.info('请选择保额', typeBeanObject['safeguardContent'])
          await page.locator('li').filter({ hasText: typeBeanObject['safeguardContent'] }).click(); // 选择保费档

           // 等待收否有确认信息的弹窗出现
           await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(true)
            }, 2000)
          })

          // 判断是否出现
          if (await page.locator('.el-dialog').filter({ hasText: '提示' }).locator('.el-button').filter({ hasText: '我知道了' }).count() !== 0) {
            await page.locator('.el-dialog').filter({ hasText: '提示' }).locator('.el-button').filter({ hasText: '我知道了' }).click();
          }

          const responsePromiseBZFA = page.waitForResponse('https://pro.boweibx.com/dist/bowei/object?path=/v2/insure/v2/check');
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '投保金额' }).getByText('确认').click()
          const responseBZFA = await responsePromiseBZFA;
          await responseBZFA.json().then(async res => {
            const isShowBZFADialog = await page.locator('.el-message-box__wrapper').isHidden()
            // 投保人声明/保障方案  确认成功 originCode '0' 成功；optAllow 1 成功，2 失败 可以返回后端错误信息
            if (res.originCode === '0' && res.data.optAllow == 1) {} else {
              if (!isShowBZFADialog) {
                const TBDMessage = await page.locator('.el-message-box__wrapper').locator('.el-message-box__content').innerText()
                resolve({
                  message: TBDMessage
                })
                await page.close();
                await browser.close();
              }
            }
          })
          
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '投保金额' }).getByText('修改').waitFor();
          
          /**--------------------------保障期限----------------------------------------**/
          
          await page.getByPlaceholder('请选择保单生效时间').click();
          await page.evaluate(`
            document.querySelector('input.el-input__inner[placeholder="请选择保单生效时间"]').removeAttribute('readonly')
          `);
          logger.info('请选择保单生效时间', reqBody.orderStartTime)
          await page.keyboard.insertText(reqBody.orderStartTime);
          await page.getByText('保单起期:').click(); // 点击除日期选择框以外的地方以便隐藏日期选择框

          // await page.getByPlaceholder('请选择保障期限').click();
          // await page.locator('li').filter({ hasText: '7天' }).click(); // 选择保障期限
          
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '保障期限' }).getByText('确认').click()
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '保障期限' }).getByText('修改').waitFor();
          
          /**--------------------------投保盖章文件----------------------------------------**/      
          
          // await page.locator('.el-tab-pane').locator('.el-card__header').filter({ hasText: '投保盖章文件' }).waitFor();   
          // const tbFileChooserPromise = page.waitForEvent('filechooser');
          // await page.locator('.el-tab-pane').locator('.el-card').filter({ hasText:'投保盖章文件' }).locator('.el-icon-plus').first().click();
          // const tbFileChooser = await tbFileChooserPromise;
          // await tbFileChooser.setFiles('./src/controller/IE_BAO/products/szgz.jpg');

          // // 等待图片加载成功后触发提交接口
          // const imgContent = page.locator('.el-tab-pane').locator('.el-card').filter({ hasText: '投保盖章文件' })
          //   .locator('.el-form-item').filter({ hasText: '投保人声明' }).locator('.avue-upload__avatar')
          //   .filter({ has: page.locator('img')}).locator('img')
          // await imgContent.waitFor();

          // const responsePromiseTB = page.waitForResponse('https://pro.boweibx.com/dist/bowei/object?path=/v2/insure/v2/check');
          // await page.locator('.el-tab-pane').locator('.el-card').filter({ hasText: '投保盖章文件' }).getByText('确认').click()
          // const responseTB = await responsePromiseTB;
          // await responseTB.json().then(async res => {
          //   const isShowTBDialog = await page.locator('.el-message-box__wrapper').isHidden()
          //   // 投保人声明/保障方案  确认成功 originCode '0' 成功；optAllow 1 成功，2 失败 可以返回后端错误信息
          //   if (res.originCode === '0' && res.data.optAllow == 1) {} else {
          //     if (!isShowTBDialog) {
          //       const TBDMessage = await page.locator('.el-message-box__wrapper').locator('.el-message-box__content').innerText()
          //       resolve({
          //         message: TBDMessage
          //       })
          //       await page.close();
          //       await browser.close();
          //     }
          //   }
          // })
          
          // await page.locator('.el-tab-pane').locator('.el-card').filter({ hasText: '投保盖章文件' }).getByText('修改').waitFor();

          /**--------------------------保障人员----------------------------------------**/
          for (let i = 0; i < employeeList.length; i++) {
            await page.getByRole('textbox', { name: '请选择姓名' }).nth(i).fill(employeeList[i]['name']);
            await page.getByRole('textbox', { name: '请输入身份证号' }).nth(i).fill(employeeList[i]['idNo']);
          }
          
          await page.getByRole('textbox', { name: '请选择职业' }).first().click();
          page.keyboard.insertText(employeeList[0]['occupationName']);
          await page.locator('li').filter({ hasText: employeeList[0]['occupationName'] }).click();
          // await page.getByRole('menuitem', { name: '交通运输业' }).locator('span').first().click();
          // await page.getByText('铁路').click();
          // await page.getByText('票房工作人员 - 1类').click();

          const responsePromiseBZRY = page.waitForResponse('https://pro.boweibx.com/dist/distInsure/checkIdno');
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '保费合计' }).getByText('确认').click()
          const responseBZRY = await responsePromiseBZRY;
          await responseBZRY.json().then(async res => {
            // logger.info(res, 'responseBZFA')
            const isShowBZRYDialog = await page.locator('.el-message-box__wrapper').isHidden()
            if (!isShowBZRYDialog) {
              const BZRYDMessage = await page.locator('.el-message-box__wrapper').locator('.el-message-box__content').innerText()
              resolve({
                message: BZRYDMessage
              })
            }
          })
          
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '保费合计' }).getByText('修改').waitFor();
      
          /**--------------------------开具发票----------------------------------------**/
          await page.locator('.el-tab-pane').locator('.el-card__header').filter({ hasText: '开具发票' }).waitFor();
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '统一信用代码' }).getByText('确认').click()
          // 当前开票类型：增值税普票 提示框
          await page.locator('.el-message-box__wrapper').filter({ hasText: '应保险公司要求，开票类型提交后将无法变更。' })
            .locator('.el-message-box__btns').getByText('确定').click()

          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '统一信用代码' }).getByText('修改').waitFor();
          
          /**--------------------------投保须知----------------------------------------**/

          // const testEL = await page.locator('.el-tab-pane').locator('.el-card__header').filter({ hasText: '投保须知' }).waitFor();
          // await testEL.evaluate((el)=> {
          //   el.scrollTop = el.scrollHeight
          // })
          
          const totalPageJsHandle = await page.evaluateHandle(() => {
            const pageEle = document.getElementsByClassName('customPage')[0].textContent.split('/')[1]
            return Promise.resolve(pageEle)
          })
          const total = Number(totalPageJsHandle._preview)

          for(let i = 0; i < total; i++) {
            await page.locator('.el-tab-pane').locator('.el-card').filter({ hasText: '投保须知' }).getByText('我已逐条阅读并同意').scrollIntoViewIfNeeded();
            await page.locator('.el-tab-pane').locator('.el-card').filter({ hasText: '投保须知' }).getByText('我已逐条阅读并同意').click()
          }

          /**--------------------------投保人声明----------------------------------------**/

          await page.locator('.el-tab-pane').locator('.el-card__header').filter({ hasText: '投保人声明' }).waitFor();
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '为保障您的合法权益，请您仔细阅读后勾选确认' })
            .locator('.el-checkbox').getByText('本投保人已完整阅读并了解投保须知内容及投保险种的保险条款内容，尤其是对其中免除保险人责任的条款或约定（包括但不限于责任免除、投保人被保险人义务、保险金申请与给付等），本投保人已充分理解并接受上述内容，同意以此作为订立保险合同的依据')
            .click();
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '为保障您的合法权益，请您仔细阅读后勾选确认' })
            .locator('.el-checkbox').getByText('投保时，本投保人已就该产品的保障内容及保险金额等向被保险人进行了明确说明，并征得其同意')
            .click();
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '为保障您的合法权益，请您仔细阅读后勾选确认' })
            .locator('.el-button').getByText('我已逐条阅读并同意投保')
            .click();
          
          /**--------------------------信息确认----------------------------------------**/
          await page.locator('.el-tab-pane').locator('.el-button').getByText('下一步，去支付>>').click();

          /**--------------------------保单支付----------------------------------------**/
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '通过线上付款的方式支付保费' })
            .locator('.el-checkbox').getByText('我已悉知：选择该支付方式后，如果再通过其他支付方式转账给保险公司，保险公司无法生成电子保单，后果自负。如要重新选择线下对公转账，必须重新录单')
            .click();
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '通过线上付款的方式支付保费' })
            .locator('.el-button').getByText('在线支付').click();
        }
      } catch (error) {
        // 包括超超时误
        await page.close();
        await browser.close();
        resolve({
          status: -1,
          message: '自动化脚本出错，请联系开发人员',
        })
        logger.error('error', error)
      }
    })
  }

    /**
   * 根据填写的东西计算金额
   * @param {*} reqBody 
   * @returns 
   */
    async calcFee(reqBody) {
      return new Promise(async (resolve, reject) => {
        // 获取保障内容
      let typeBeanList = reqBody.typeBeanList
      let typeBeanObject = {}
      typeBeanList.forEach(ele => {
        if (ele.typeStr === '保障内容') {
          // 选择保额
          typeBeanObject['safeguardContent'] = ele.optionName
        }
      });
      // 人员列表
      let employeeList = reqBody.orderGroupBean.employeeList
      // 本地营业执照保存路径（用fs包解析）
      const imgPath = `./src/images/${reqBody.id}.jpg`;
      logger.info("图片路径：", imgPath)
      try {
         // 判断token是否过期
        const pageData = await isLogin(reqBody)
        if (pageData) {
          const { browser, page } = pageData
          logger.info('太保外墙施工雇主险（年单特别版）')

          // 等待倒计时弹窗的出现
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(true)
            }, 8000)
          })
          // 判断是否出现
          if (await page.locator('div').filter({ hasText: /^0$/ }).locator('i').count() !== 0) {
            await page.locator('div').filter({ hasText: /^0$/ }).locator('i').click();
          }
          
          // 等待倒计时弹窗消失后的待处理订单弹窗出现
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(true)
            }, 2000)
          })

          // 判断是否出现
          if (!await page.locator('.el-message-box__wrapper').isHidden()) {
              await page.locator('.el-message-box__wrapper').filter({ hasText: '请及时进行续保操作！' })
              .locator('.el-message-box__btns').getByText('取消').click()
          }
          
          
          page.on('dialog', async dialog => {
            console.log(dialog.type());
            logger.info(await dialog.accept())
          });
          // 监听
          page.on('response', async (response) => {
            if (response.url()?.indexOf('pro.boweibx.com/dist/distInsure/checkUnit') > -1) {
              response.json().then(async res => {
                // 投保企业（上传营业执照可自动识别企业信息）确认成功 originCode '200' 成功； '300' 失败，可以返回后端错误信息
                if (res.originCode == '200') {
                  
                  // await page.close();
                  // await browser.close();
                } else {
                  resolve({
                    status: -1,
                    message: '自动化脚本出错，请联系开发人员',
                    error: err
                  })
                  await page.close();
                  await browser.close();
                }
              })
            } else if (response.url()?.indexOf('pro.boweibx.com/dist/bowei/object?path=/v2/insure/v2/calc_apply') > -1) {
              // 计算保费  计算成功 originCode '0'
              response.json().then(async res => {
                if (res.originCode === '0') {
                  
                  // await page.close();
                  // await browser.close();
                } else {
                  resolve({
                    status: -1,
                    message: '自动化脚本出错，请联系开发人员',
                    error: err
                  })
                  await page.close();
                  await browser.close();
                }
              })
            } else if (response.url()?.indexOf('pro.boweibx.com/dist/distInsure/pay') > -1) {
              // 在线支付
              response.json().then(async res => {
                if (res.originCode === "200") {
                  resolve({
                    code: 200,
                    payUrl: res.data.payUrl,
                    sign: res.data.orderId
                  })
                  // await page.close();
                  // await browser.close();
                } else {
                  resolve({
                    status: -1,
                    message: '自动化脚本出错，请联系开发人员',
                    error: err
                  })
                  await page.close();
                  await browser.close();
                }
              })
            }
          });
          /**
           * 先写死后面需要动态
           */
          
          await page.goto(`https://pro.boweibx.com/#/insuranceCenter/entryCenter/428?act=new&pageId=1726709589273-be13-9d7f-b5b2-9c34235c34ff&insureType=6&sourceProductId=428&productId=419`);
          /**--------------------------关闭建议通知-------------------------------------**/
          await page.getByText('太忙了，稍后查看').click()
          /**--------------------------投保企业（上传营业执照可自动识别企业信息）------------**/
          // 营业执照
          // 图片链接
          const imageUrl = reqBody.orderGroupBean.businessLicenseUrl;
          logger.info(imageUrl)
          // 本地保存路径（用fs包解析）
          const localPath = `./src/images/${reqBody.id}.jpg`;
          // 上传营业执照解析接口
          const responsePromiseYYZZ = page.waitForResponse('https://pro.boweibx.com/dist/distInsure/parseLicense');
          await request(imageUrl)
            .pipe(fs.createWriteStream(localPath))
            .on('close', async() => {
              try {
                logger.info('营业执照已保存到：', localPath, '文件开始上传')
                const fileChooserPromise = page.waitForEvent('filechooser');
                await page.locator('.el-tab-pane').locator('.el-card').filter({ hasText: '投保企业（上传营业执照可自动识别企业信息）' }).locator('.el-icon-plus').first().click();
                const fileChooser = await fileChooserPromise;
                await fileChooser.setFiles(localPath);
              } catch(err) {
                logger.error(err)
                await page.close();
                await browser.close();
                resolve({
                  status: -1,
                  message: '自动化脚本出错，请联系开发人员',
                  error: err
                })
              }
            });
          const responseYYZZ = await responsePromiseYYZZ;
          await responseYYZZ.json().then(async res => {
            // 删除下刚刚上传的图片
            fs.unlink(imgPath, (err) => {
              if (err) {
                logger.error(err);
                return;
              }
              logger.info('文件删除成功');
            });
            // originCode '0' 成功 '1' 失败
            if (res.originCode == '0') {
              await page.getByPlaceholder('请填写企业授权人的手机号').fill(reqBody.orderGroupBean.legalPersonMobile);
              await page.getByPlaceholder('所在地区').click();
              const handleAddressStr = reqBody.orderGroupBean.addressStr.split(',').join(' / ')
              page.keyboard.insertText(handleAddressStr);
              await page.locator('li').filter({ hasText: handleAddressStr }).click();
            } else {
              resolve({
                status: -1,
                message: '自动化脚本出错，请联系开发人员',
                error: err
              })
              await page.close();
              await browser.close();
            }
          })

          // await page.getByPlaceholder('请填写企业授权人的手机号').fill(reqBody.orderGroupBean.legalPersonMobile);
          // await page.getByPlaceholder('所在地区').click();
          // const handleAddressStr = reqBody.orderGroupBean.addressStr.split(',').join(' / ')
          // page.keyboard.insertText(handleAddressStr);
          // await page.locator('li').filter({ hasText: handleAddressStr }).click();

          // 行业信息暂且为测试
          // await page.locator('.el-tab-pane').locator('.el-card')
          //   .filter({ hasText: '投保企业（上传营业执照可自动识别企业信息）' }).getByPlaceholder('请选择行业').click();
          // page.evaluate(`
          //   document.querySelector('input.el-input__inner[placeholder="请选择行业"]').removeAttribute('readonly')
          // `);
          // await page.keyboard.insertText('制造业');
          // await page.locator('li').filter({ hasText: '制造业' }).locator('visible=true').click()

          await page.locator('.el-tab-pane').locator('.el-card')
            .filter({ hasText: '投保企业（上传营业执照可自动识别企业信息）' }).getByText('确认').click();

          await page.locator('.el-tab-pane').locator('.el-card')
            .filter({ hasText: '投保企业（上传营业执照可自动识别企业信息）' }).getByText('修改').waitFor();

          /**--------------------------保障方案----------------------------------------**/
          
          await page.getByPlaceholder('请选择保额').click();
          logger.info('请选择保额', typeBeanObject['safeguardContent'])
          await page.locator('li').filter({ hasText: typeBeanObject['safeguardContent'] }).click(); // 选择保费档

           // 等待收否有确认信息的弹窗出现
           await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(true)
            }, 2000)
          })

          // 判断是否出现
          if (await page.locator('.el-dialog').filter({ hasText: '提示' }).locator('.el-button').filter({ hasText: '我知道了' }).count() !== 0) {
            await page.locator('.el-dialog').filter({ hasText: '提示' }).locator('.el-button').filter({ hasText: '我知道了' }).click();
          }

          const responsePromiseBZFA = page.waitForResponse('https://pro.boweibx.com/dist/bowei/object?path=/v2/insure/v2/check');
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '投保金额' }).getByText('确认').click()
          const responseBZFA = await responsePromiseBZFA;
          await responseBZFA.json().then(async res => {
            const isShowBZFADialog = await page.locator('.el-message-box__wrapper').isHidden()
            // 投保人声明/保障方案  确认成功 originCode '0' 成功；optAllow 1 成功，2 失败 可以返回后端错误信息
            if (res.originCode === '0' && res.data.optAllow == 1) {} else {
              if (!isShowBZFADialog) {
                const TBDMessage = await page.locator('.el-message-box__wrapper').locator('.el-message-box__content').innerText()
                resolve({
                  message: TBDMessage
                })
                await page.close();
                await browser.close();
              }
            }
          })
          
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '投保金额' }).getByText('修改').waitFor();
          
          /**--------------------------保障期限----------------------------------------**/
          
          await page.getByPlaceholder('请选择保单生效时间').click();
          await page.evaluate(`
            document.querySelector('input.el-input__inner[placeholder="请选择保单生效时间"]').removeAttribute('readonly')
          `);
          logger.info('请选择保单生效时间', reqBody.orderStartTime)
          await page.keyboard.insertText(reqBody.orderStartTime);
          await page.getByText('保单起期:').click(); // 点击除日期选择框以外的地方以便隐藏日期选择框

          // await page.getByPlaceholder('请选择保障期限').click();
          // await page.locator('li').filter({ hasText: '7天' }).click(); // 选择保障期限
          
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '保障期限' }).getByText('确认').click()
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '保障期限' }).getByText('修改').waitFor();
          
  
          /**--------------------------保障人员----------------------------------------**/
          for (let i = 0; i < employeeList.length; i++) {
            await page.getByRole('textbox', { name: '请选择姓名' }).nth(i).fill(employeeList[i]['name']);
            await page.getByRole('textbox', { name: '请输入身份证号' }).nth(i).fill(employeeList[i]['idNo']);
          }
          
          await page.getByRole('textbox', { name: '请选择职业' }).first().click();
          page.keyboard.insertText(employeeList[0]['occupationName']);
          await page.locator('li').filter({ hasText: employeeList[0]['occupationName'] }).click();
          // await page.getByRole('menuitem', { name: '交通运输业' }).locator('span').first().click();
          // await page.getByText('铁路').click();
          // await page.getByText('票房工作人员 - 1类').click();

          const responsePromiseBZRY = page.waitForResponse('https://pro.boweibx.com/dist/distInsure/checkIdno');
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '保费合计' }).getByText('确认').click()
          const responseBZRY = await responsePromiseBZRY;
          await responseBZRY.json().then(async res => {
            // logger.info(res, 'responseBZFA')
            const isShowBZRYDialog = await page.locator('.el-message-box__wrapper').isHidden()
            if (!isShowBZRYDialog) {
              const BZRYDMessage = await page.locator('.el-message-box__wrapper').locator('.el-message-box__content').innerText()
              resolve({
                message: BZRYDMessage
              })
            }
          })
          
          await page.locator('.el-tab-pane').locator('.el-card__body').filter({ hasText: '保费合计' }).getByText('修改').waitFor();
        }
      } catch (error) {
        // 包括超超时误
        await page.close();
        await browser.close();
        resolve({
          status: -1,
          message: '自动化脚本出错，请联系开发人员',
        })
        logger.error('error', error)
      }
      })
    }
  }