const { Month, Accident } = require('../constant/enum.type');
const request = require('request');
const { isLogin } = require('../login.controller')
const fs = require('fs');

/**
 * 华泰团体意外险（互联网）(GD) 
 */
class OrderController {
  /**
   * 生成订单
   * @param {*} reqBody 
   * @returns 
   */
  async order(reqBody) {
    return new Promise(async (resolve, reject) => {
      logger.info(reqBody, 'reqBody')
      // 本地营业执照保存路径（用fs包解析）
      const imgPath = `./src/images/${reqBody.id}.jpg`;
      logger.info("图片路径：", imgPath)
      try {
        const pageData = await isLogin(reqBody)
        // 判断cookie是否过期
        if (pageData) {
          const { browser, page } = pageData
          // 认证信息
          const channelInfo = reqBody.channelInfo
          await page.goto(`https://groupinsure.zhongbaounion.com/broker/groupinsureauto/productInfo?product=${reqBody.productCode}&channel_id=${channelInfo.channelId}&user_channel=${channelInfo.userChannel}`);
          //------------------------------------------------------------------------------------------------------------
          page.on('response', async (response) => {
            if (response.url()?.indexOf('/broker/groupinsureauto/saveApply') > -1) {
              logger.info('——————————————————————————————完成提交——————————————————————————————————')
              response.json().then(async res => {
                logger.info(response.url())
                logger.info(res)
                await page.close();
                await browser.close();
                logger.info("————————————————————————————————浏览器已关闭————————————————————————————————————")
                if (res.status == '1') {
                  resolve({
                    status: 200,
                    msg: '提交订单成功',
                    orderUnique: res.order_uniqid,
                    sign: res.sign
                  })
                } else {
                  resolve({
                    status: -1,
                    message: res.msg
                  })
                }
              })
            }
            // ocr接口(营业执照上传完后再填写公司信息并最后提交订单)
            if (response.url()?.indexOf('/broker/organization/ocr') > -1) {
              // 删除下刚刚上传的图片
              fs.unlink(imgPath, (err) => {
                if (err) {
                  logger.error(err);
                  return;
                }
                logger.info('文件删除成功');
              });
              logger.info('——————————————————————————————公司信息——————————————————————————————————')
              // 企业统一信用代码
              await page.getByPlaceholder('请输入证件号码').click();
              await page.getByPlaceholder('请输入证件号码').fill(reqBody.orderGroupBean.certificateNo);
              await page.getByPlaceholder('请填写单位全称').click();
              await page.getByPlaceholder('请填写单位全称').fill(reqBody.orderGroupBean.insureCompanyName);
              await page.getByRole('textbox', { name: '请输入详细地址' }).click();
              await page.getByRole('textbox', { name: '请输入详细地址' }).fill(reqBody.orderGroupBean.addressDetail);
              // 延时0.3s让页面反应，计算保费
              await new Promise((r,rj) => setTimeout(() => {
                r(1)
              }, 500))
              // 这边提交按钮需要拦截弹窗校验
              await page.getByText('提交订单').click();
              logger.info('开始等待7s')
              setTimeout(async() => {
                await page.locator('span', { hasText: '我知道了'}).click();
              }, 7000);
            }
          });
          // 弹窗拦截
          let dialogMsg = ''
          page.on('dialog', async dialog => {
            logger.info('弹窗信息', dialog.message())
            dialogMsg = dialog.message()
            if (dialogMsg.indexOf('成功') === -1) {
              await page.close();
              await browser.close();
              logger.info("————————————————————————————————浏览器已关闭————————————————————————————————————")
              resolve({
                status: -1,
                message: '第三方平台报错',
                error: dialog.message()
              })
            }
            await dialog.accept().then(res => {
            });
          });
          await OrderController.fillProgrammeAndEmployee(page,reqBody)
          logger.info('——————————————————————————————基础信息——————————————————————————————————')
          // 开票信息
          logger.info('开票信息')
          await page.getByRole('combobox').nth(4).selectOption(reqBody.orderGroupBean.invoiceType);
          switch(reqBody.orderGroupBean.invoiceType) {
            case '1':
              // 电子票
              await page.getByPlaceholder('请输入发票抬头').click();
              await page.getByPlaceholder('请输入发票抬头').fill(reqBody.orderGroupBean.invoiceHeader);
              await page.getByPlaceholder('请输入纳税人号码').click();
              await page.getByPlaceholder('请输入纳税人号码').fill(reqBody.orderGroupBean.taxNumber);
              break;
            case '2':
              // 专票
              await page.getByPlaceholder('请输入发票抬头').click();
              await page.getByPlaceholder('请输入发票抬头').fill(reqBody.orderGroupBean.invoiceHeader);
              await page.getByPlaceholder('请输入纳税人号码').click();
              await page.getByPlaceholder('请输入纳税人号码').fill(reqBody.orderGroupBean.taxNumber);
              await page.getByPlaceholder('请输入开户行', { exact: true }).click();
              await page.getByPlaceholder('请输入开户行', { exact: true }).fill(reqBody.orderGroupBean.depositBank);
              await page.getByPlaceholder('请输入开户行帐号').click();
              await page.getByPlaceholder('请输入开户行帐号').fill(reqBody.orderGroupBean.depositBankAccount);
              await page.getByPlaceholder('请输入公司电话').click();
              await page.getByPlaceholder('请输入公司电话').fill(reqBody.orderGroupBean.companyPhone);
              await page.getByPlaceholder('专票上的公司地址').click();
              await page.getByPlaceholder('专票上的公司地址').fill(reqBody.orderGroupBean.specialTicketAddress);
              break;
            default: break;
          }
          logger.info('——————————————————————————————联系人——————————————————————————————————')
          logger.info('录入联系人')
          await page.getByPlaceholder('请输入联系人姓名').click();
          await page.getByPlaceholder('请输入联系人姓名').fill(reqBody.orderGroupBean.contactsName || '');
          await page.getByPlaceholder('请输入手机号码').click();
          await page.getByPlaceholder('请输入手机号码').fill(reqBody.orderGroupBean.contactsPhone || '');
          await page.getByPlaceholder('请输入电子邮箱').click();
          await page.getByPlaceholder('请输入电子邮箱').fill(reqBody.orderGroupBean.contactsEmail || '');
          // 营业执照
          // 图片链接
          const imageUrl = reqBody.orderGroupBean.businessLicenseUrl;
          logger.info(imageUrl)
          // 本地保存路径（用fs包解析）
          const localPath = `./src/images/${reqBody.id}.jpg`;
          request(imageUrl)
            .pipe(fs.createWriteStream(localPath))
            .on('close', async() => {
              try {
                logger.info('营业执照已保存到：', localPath, '文件开始上传')
                const fileChooserPromise = page.waitForEvent('filechooser');
                await page.getByRole('link', { name: '上传并识别' }).click();
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
        } else {
          resolve({
            status: -1,
            message: '登录信息更新失败',
          })
        }
      } catch (err){
        logger.error(err)
        await page.close();
        await browser.close();
        resolve({
          status: -1,
          message: '自动化脚本出错，请联系开发人员',
        })
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
      // 人员列表
      let employeeList = reqBody.orderGroupBean.employeeList
      logger.info(employeeList)
      try {
        // 渠道信息
        const channelInfo = reqBody.channelInfo
        let responseData = null
        const pageData = await isLogin(reqBody)
        // 判断cookie是否过期
        if (pageData) {
          const { browser, page } = pageData
          // 监听
          page.on('response', async (response) => {
            // logger.info(response.url())
            if (response.url()?.indexOf('/broker/groupinsureauto/calcPremium') > -1) {
              response.json().then(res => {
                logger.info(response.url())
                logger.info(res.data)
                responseData = res.data
              })
            }
          });
          await page.goto(`https://groupinsure.zhongbaounion.com/broker/groupinsureauto/productInfo?product=${reqBody.productCode}&channel_id=${channelInfo.channelId}&user_channel=${channelInfo.userChannel}`);
          await OrderController.fillProgrammeAndEmployee(page,reqBody)
          // 企业统一信用代码
          await page.getByPlaceholder('请输入证件号码').click();
          await page.getByPlaceholder('请输入证件号码').fill(reqBody.orderGroupBean.certificateNo);
          await page.getByPlaceholder('请填写单位全称').click();
          await page.getByPlaceholder('请填写单位全称').fill(reqBody.orderGroupBean.insureCompanyName);
          await page.getByRole('textbox', { name: '请输入详细地址' }).click();
          setTimeout(async () => {
            await page.close();
            await browser.close();
            logger.info("————————————————————————————————浏览器已关闭————————————————————————————————————")
            resolve({
              status: 200,
              data: {
                positionInfo: responseData?.position_info || {},
                totalFee: responseData?.total_premium || 0
              }
            })
          }, 300)
        } else {
          await page.close();
          await browser.close();
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
  
  /**
   * 填写投保方案、保障日期、人员信息
   * @param {*} page 
   * @param {*} reqBody 
   * @returns 
   */
  static fillProgrammeAndEmployee(page, reqBody) {
    return new Promise(async (resolve, reject) => {
      // 获取保障内容
      let typeBeanList = reqBody.typeBeanList
      // 人员列表
      let employeeList = reqBody.orderGroupBean.employeeList
      logger.info(employeeList)
      // 投保方案（保障内容从上到下，每个产品不一样）
      logger.info('——————————————————————————————投保方案——————————————————————————————————')
      logger.info('投保方案')
      logger.info(reqBody.programmeDetailName)
      if (await page.locator('.plan-item', { hasText: '投保方案' }).locator('.option', { hasText: reqBody.programmeDetailName }).count()> 0) {
        await page.locator('.plan-item', { hasText: '投保方案' }).locator('.option', { hasText: reqBody.programmeDetailName }).click();
      }
      for(let i = 0; i < typeBeanList?.length; i++) {
        const t = typeBeanList[i]
        logger.info(t.typeStr)
        let name = ''
        t.typeStr = t.typeStr.replace('民航客户意外', '民航客机意外')
        switch(t.typeStr) {
          case '保险期间': 
            name = Month[t.optionName] || t.optionName
            logger.info(name)
            await page.locator('.plan-item', { hasText: t.typeStr }).locator('.option', { hasText: name, exact: true }).click();
            break;
          default:
            name = t.optionName
            logger.info(name)
            await page.locator('.plan-item', { hasText: t.typeStr }).locator('.option', { hasText: name, exact: true }).click();
            break;
        }
      }
      await page.getByText('立即投保').click();
      logger.info('——————————————————————————————基础信息——————————————————————————————————')
      // 延时0.5s让页面加载好
      await new Promise((r,rj) => setTimeout(() => {
        r(1)
      }, 500))
      // 开始时间（填了时间后，点开来然后再点一下就行，未验证是否可行）
      // 新方案：insert
      let sTime = reqBody.orderStartTime.substring(0, 11)
      logger.info('开始时间', sTime)
      await page.locator('#start_date').click(); // 打开聚焦
      await page.evaluate(`document.querySelector('#start_date').removeAttribute('readonly')`) // 取消readonly
      await page.evaluate(`document.querySelector('#start_date').value = ''`)
      await page.locator('#start_date').click(); // 点击关闭
      await page.keyboard.insertText(sTime); // 填入信息
      await page.locator('#end_date').click(); // 取消聚焦
      await page.locator('#start_date').click(); // 打开聚焦
      await page.locator('.active').getByText(sTime.substring(sTime.length - 3, sTime.length)).click() // 点击已经选择的日期
      // 拼装职业
      let occupMap = {}
      for(let i = 0; i < employeeList.length; i++) {
        let e = employeeList[i]
        if (occupMap[e.occupationCode]) {
          occupMap[e.occupationCode].employeeList.push(e)
        } else {
          occupMap[e.occupationCode] = {
            employeeList: [e]
          }
        }
      }
      logger.info(occupMap)
      // 职业循环
      let keyIdx = 0
      for (let key in occupMap) {
        let o = occupMap[key]
        // （职业三个编码）
        if (keyIdx === 0) {
          await page.locator('.insured_header', { hasText: `职业方案${keyIdx+1}`}).getByPlaceholder('点击选择').click();
        } else {
          await page.locator('.add_person_info').click();
          // 延时0.05s让页面加载好
          await new Promise((r,rj) => setTimeout(() => {
            r(1)
          }, 50))
          await page.locator('.insured_header', { hasText: `职业方案${keyIdx+1}`}).getByPlaceholder('点击选择').click();
        }
        let position = key.split(',')
        // 延时0.05s让页面加载好
        await new Promise((r,rj) => setTimeout(() => {
          r(1)
        }, 50))
        logger.info('职业', position)
        await page.locator('#positionLevel1').selectOption(position[0].substring(position[0].length - 2, position[0].length));
        await page.locator('#positionLevel2').selectOption(position[1].substring(position[1].length - 4, position[1].length));
        await page.locator('#positionLevel3').selectOption(position[2]);
        await page.getByText('确定').click();
        // 职业下方的每个职业的不同保障内容
        // await page.getByRole('table').getByRole('cell').first().getByRole('combobox').selectOption(
        //   {
        //     '不投保': '0', '5万': '1', '10万': '2'
        //   }[typeBeanList[4] || '0']
        // );
        logger.info('——————————————————————————————人员信息——————————————————————————————————')
        for(let i = 0; i < o.employeeList.length; i++) {
          let e = o.employeeList[i]
          logger.info('录入')
          await page.locator('.insured_header', { hasText: `职业方案${keyIdx+1}`}).getByText('添加被保人').click();
          await page.getByPlaceholder('请填写姓名').click();
          await page.getByPlaceholder('请填写姓名').fill(e.name);
          await page.getByPlaceholder('请填写证件号码').click();
          // 证件号码填了后性别、生日会自动填充（仅限身份证）
          // 其他类型证件需要单独判断
          await page.getByPlaceholder('请填写证件号码').fill(e.idNo); 
          await page.locator('#add_sex').selectOption({1: '男', 2: '女'}[e.sex]);
          await page.locator('#add_id_card_type').selectOption(e.idType);
          // 保存
          await page.getByRole('button', { name: '保存' }).click();
          logger.info('——————————————————————————————第' + i +'个结束——————————————————————————————————')
        }
        keyIdx++;
      }
      resolve(1)
    })
  }
}


module.exports = new OrderController()
