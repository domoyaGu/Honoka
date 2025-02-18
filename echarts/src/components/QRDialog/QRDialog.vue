<template>
  <el-dialog v-bind="$attrs" width="650" v-model="showDialog" @close="close">
    <template #header>
      <span>支付</span>
    </template>
    <div class="money-container">
      <div style="border-bottom: 1px solid lightgrey;">
        <p class="p-container">投保单号: <span style="font-weight:300">{{current['applicationNo']}}</span></p>
        <p class="p-container">支付金额: 
          <div v-loading="(loading && money < 0)" style="display:inline-block">
            <div v-if="!money || money < 0">金额获取失败</div>
            <div v-else class="dollor">￥{{ money }}</div>
          </div>
        </p>
      </div>
      <div style="margin: 20px 0">
        <p class="p-container">支付方式：</p>
        <el-radio-group v-model="paytype" @change="changePayType">
          <el-radio size="large" label="W01" border>
            <div class="radio-container">
              <svg-icon icon-class="wechat"/>
              <span style="color: #757575">微信支付</span>
            </div>
          </el-radio>
          <el-radio size="large" label="A01" border>
            <div class="radio-container">
              <svg-icon icon-class="alipay"/>
              <span style="color: #757575">支付宝</span>
            </div>
          </el-radio>
        </el-radio-group>
      </div>
      <div v-loading="loading" style="position: relative; width: fit-content;">
        <div v-show="isLoadingFalse" class='qr-mask'>
          二维码获取失败,
          <span class="refresh-qrcode" @click="getQrCode">点击刷新</span>
        </div>
        <qrcode-vue :value="qrCode[paytype]"></qrcode-vue>
      </div>
      <div class="tips">请打开{{paytype == 'W01' ? '微信' : '支付宝'}}，扫一扫完成支付</div>
    </div>
    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submit">
          确定
        </el-button>
      </span>
    </template> -->
  </el-dialog>
</template>

<script lang="ts" setup>
import QrcodeVue from 'qrcode.vue'
import { getQrCodeKey } from '@/api/common'

  // const props = defineProps({
  //   // 调接口的数据
  //   params: {} as any,
  // })

  // 支付方式
  const paytype = ref('W01');
  // 当前投保单对象
  const current = ref({});
  // 二维码信息
  const qrCode = ref({
    'W01': '',
    'A01': ''
  });

  // 金额
  const money = ref(-1)

  // 加载状态
  const loading = ref(false)

  // 二维码加载失败
  const isLoadingFalse = ref(false)

  // 调接口获取当前二维码
  function getQrCode() {
    loading.value = true
    getQrCodeKey({
      reqsn: current.value['applicationNo'], // 投保单号
      insuranceId: current.value['insuranceId'], // 保险id
      payType: paytype.value, // 交易方式
      applicationSource: 10000, // 	交易类型 目前写死投保的
      applicationId: current.value['applicationId']
    }).then(({ data }) => {
      loading.value = false
      if (data.payinfo) {
        // 二维码
        qrCode.value[paytype.value] = data.payinfo
      }
      // 金额
      money.value = data.tcTotalExpense
    }).finally(() => {
      if (loading.value) {
        isLoadingFalse.value = true
      } else {
        isLoadingFalse.value = false
      }
      loading.value = false
    })
  }

  // 更换支付方式
  function changePayType() {
    getQrCode()
  }

  // 父组件函数
  const emit = defineEmits(['submit']);

  // 确认提交表单
  function submit () {
    // emit('submit', state.remark)
  }

  // 弹窗开关
  const showDialog = ref(false)
  
  // 打开弹窗
  function open(data) {
    showDialog.value = true
    current.value = data
    getQrCode()
  }

  // 关闭弹窗
  function close() {
    showDialog.value = false
    // 初始化变量
    qrCode.value = {
      'W01': '',
      'A01': ''
    }
    current.value = {}
    paytype.value = 'W01'
    money.value = -1
  }

  defineExpose({
    open,
    close
  })

</script>

<style lang="scss" scoped>
  // 样式穿透
  :deep(.el-textarea__inner) {
    min-height: 100px !important;
  }

  :deep(.el-radio__input) {
    display: none;
  }
  .svg-icon {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 8px;
  }

  // 选中样式
  .el-radio.is-bordered {
    border-radius: 0;
    width: 130px;
  }
  .el-radio.is-bordered.is-checked {
    border-color: var(--el-color-primary);
    border-width: 2px;
    font-weight: bold;
  }


  // 容器
  .money-container{
    font-size: 15px;
    padding: 0 30px 30px 30px;
  }

  // p标签样式
  .p-container {
    padding: 10px 0;
    color: black;
    font-weight: bold;
    
    span{
      color: #757575;
      font-size: 15px;
      font-weight: 300;
    }
    // 金额样式
    .dollor {
      display: inline-block;
      font-size: 26px;
      color: orangered
    }
  }

  
  // 单选内容样式
  .radio-container {
    display: flex;
    align-items: center;
  }
  // 二维码蒙层
  .qr-mask {
    width: 190px;
    height: 190px;
    background: #f3f3f3;
    position: absolute;
    text-align: center;
    line-height: 190px;
    top:0;
    left: 0;
    // 刷新二维码
    .refresh-qrcode {
      text-decoration: underline;
      color: cornflowerblue;
      cursor: pointer;
    }
  }
  

  // 二维码宽度
  canvas {
    width: 190px !important;
    height: 190px !important;
  }

  // 二维码下提示信息样式
  .tips {
    width: 190px;
    font-size: 12px;
    background-color: rgb(0, 173, 0);
    color: white;
    padding: 8px 10px;
    text-align: center;
  }

</style>
