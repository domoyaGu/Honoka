<template>
  <el-Dialog
    v-bind="$attrs"
    v-model="show"
    width="80%"
    @close="close"
    title="支付信息"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <Form ref="form" :data="dataList"/>
    <template #footer>
      <div style="text-align: center;">
        <el-button type="primary" @click="submit()">保存</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </template>
  </el-Dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';


const props = defineProps({
  // 支付数据：
  selects: {
    type: Object
  }
})

// 下拉
const unwatch = watch(() => props.selects, (newValue, oldValue) => {
  // 获取到下拉列表时，停止监听
  if (Object.keys(newValue).length > 0) unwatch()
})

const form = ref()
// 表单配置
const dataList = ref({})
// 拼装支付信息列表
function setList(info, selectData) {
  dataList.value = {
    // 支付信息
    insuranceProjectId: {title: '险种', content: info?.insuranceProjectId || '', type: 'select', options: []},
    payType: {title: '支付方式', content: info?.payType || '', type: 'input'},
    customerType: {title: '客户类型', content: info?.customerType || '', type: 'select', options: selectData['LP_CUSTOMER_TYPE']},
    payPersonal: {title: '支付对象', content: info?.payPersonal || '', type: 'select', options: selectData['LP_PAY_PERSONAL']},
    ownerCertificateNo: {title: '收款人户名', content: info?.ownerCertificateNo || '', type: 'input'},
    phoneNo: {title: '移动电话', content: info?.phoneNo || '', type: 'input'},
    payPurpose: {title: '用途', content: info?.payPurpose || '', type: 'select', options: selectData['LP_PAY_PURPOSE']},
    payMoney: {title: '金额', content: info?.payMoney || '', type: 'input'},
    accountType: {title: '账户类型', content: info?.accountType || '', type: 'select', options: selectData['LP_ACCOUNT_TYPE']},
    depositBank: {title: '开户行名称', content: info?.depositBank || '', type: 'input'},
    payeeAccount: {title: '收款人账号', content: info?.payeeAccount || '', type: 'input'},
    payeeAccount2: {title: '账号复录', content: info?.payeeAccount || '', type: 'input'},
    remark: {title: '备注', content: info?.remark || '', type: 'input', textType: 'textarea', span: 12}
  }
}

const emits = defineEmits(['submitInfo'])

// 提交信息
function submit() {
  form.value.validForm().then((formData) => {
    delete formData.payeeAccount2
    emits('submitInfo', formData)
    ElMessage.success('保存成功')
    show.value =false
  })
}

//————————————————————————————————弹窗相关——————————————————————————————————————
// 打开/关闭状态
const show = ref(false)

function open(info) {
  setList(info, props.selects)
  show.value = true
}

function close() {
  dataList.value = {}
  form.value.resetForm()
  show.value = false
}
//————————————————————————————————end——————————————————————————————————————

defineExpose({
  open
})

</script>

<style lang="scss" scoped>

</style>
