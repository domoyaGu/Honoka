<template>
  <div>
    <Collapse>
      <template #title>
        <h1>理算信息</h1>
      </template>
      <el-form v-model="formData" label-position="left" style="margin-top: 10px;">
        <el-row>
          <el-col :lg="12" :md="12" :sm="24">
            <!-- 理算金额 -->
            <el-form-item prop="adjustMoney" label="理算金额">
              <div style="width: 286px;">
                <CurrencyInput
                  :default-value="formData.adjustMoney"
                  clearable
                  is-watch
                  disabled
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="24">
            <!-- 已赔付金额 -->
            <el-form-item prop="paidMoney" label="已赔付金额">
              <div style="width: 286px;">
                {{ paidMoneyComp }}
                <CurrencyInput
                  :default-value="formData.paidMoney"
                  clearable
                  is-watch
                  disabled
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="24">
            <!-- 理算费用 -->
            <el-form-item prop="adjustFee" label="理算费用">
              <div style="width: 286px;">
                <CurrencyInput
                  :default-value="formData.adjustFee"
                  clearable
                  is-watch
                  disabled
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="24">
            <!-- 预支付金额 -->
            <el-form-item prop="prepaidMoney" label="预支付金额">
              <div style="width: 286px;">
              <CurrencyInput
                  :default-value="formData.prepaidMoney"
                  clearable
                  is-watch
                  disabled
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="24">
            <!-- 赔付金额 -->
            <el-form-item prop="compensateMoney" label="赔付金额">
              <div style="width: 286px;">
                <CurrencyInput
                  :default-value="formData.compensateMoney"
                  clearable
                  is-watch
                  disabled
                />
              </div>
            </el-form-item>
          </el-col>
          <!-- todo: 部分支付预留 -->
        </el-row>
      </el-form>
      <el-table :data="tableData" style="width: 100%" border
          :header-cell-style="{ background: '#EBEEF5', color: '#909399', height: '48px' }">
        <el-table-column label="险种" prop="insuranceProjectNames"/>
        <el-table-column label="险种限额" prop="guaranteeAmount"/>
        <el-table-column label="核损金额" prop="examMoney"/>
        <el-table-column label="理算金额" prop="adjustMoney">
          <template #default="scope">
            <CurrencyInput
              :default-value="scope.row.adjustMoney"
              @inputtext="(val) => { scope.row.adjustMoney = val; }"
              :disabled="isDisabled"
              type="text"
              :placeholder="isDisabled ? '' : '请输入'"
              clearable
              is-watch
              is-negative
            />
          </template>
        </el-table-column>
        <el-table-column label="交强赔付" prop="compulsoryMoney">
          <template #default="scope">
            <CurrencyInput
              :default-value="scope.row.compulsoryMoney"
              @inputtext="(val) => { scope.row.compulsoryMoney = val; }"
              :disabled="isDisabled"
              type="text"
              :placeholder="isDisabled ? '' : '请输入'"
              clearable
              is-watch
              is-negative
            />
          </template>
        </el-table-column>
        <el-table-column label="责任系数(%)" prop="accidentRatio"/>
        <el-table-column label="绝对免赔率" prop="absoluteDeduct"/>
        <el-table-column label="扣减额度/比例" prop="singleDeduction"/>
        <el-table-column label="已赔付金额" prop="paidMoney"/>
        <el-table-column label="预支付金额" prop="prepaidMoney">
          <template #default="scope">
            <CurrencyInput
              :default-value="scope.row.prepaidMoney"
              @inputtext="(val) => { scope.row.prepaidMoney = val; }"
              :disabled="isDisabled"
              type="text"
              :placeholder="isDisabled ? '' : '请输入'"
              clearable
              is-watch
              is-negative
            />
          </template>
        </el-table-column>
        <el-table-column label="专票税费" prop="specialFee">
          <template #default="scope">
            <CurrencyInput
              :default-value="scope.row.specialFee"
              @inputtext="(val) => { scope.row.specialFee = val; }"
              :disabled="isDisabled"
              type="text"
              :placeholder="isDisabled ? '' : '请输入'"
              clearable
              is-watch
              is-negative
            />
          </template>
        </el-table-column>
        <el-table-column label="最终理算金额" prop="finalAdjustMoney"/>
      </el-table>
    </Collapse>
    <Collapse>
      <template #title>
        <div style="display: flex; align-items: center;">
          <h1 style="margin-right: 10px;">支付信息</h1>
          <el-button type="primary" size="small" @click="addPayInfo">新增</el-button>
        </div>
      </template>
      <div v-show="payinfoList?.length > 0">
        <el-card class="tc-detail-card" v-for="(info, index) in payinfoList">
          <div class="card-title" style="margin-bottom: 10px;">
            <span class="text" style="margin-right: 10px;">支付信息{{ index + 1 }}</span>
            <el-button link type="primary" :icon="Edit"  @click="editPayInfo(info, index)">编辑</el-button>
            <el-button link type="danger" :icon="Delete" @click="deletePayInfo(info, index)">删除</el-button>
          </div>
          <div class="tc-detail-content">
            <Detail :data="getPayInfoContent(info)"/>
          </div>
        </el-card>
      </div>
    </Collapse>
    <PayinfoDialog ref="dialogRef" :selects="selectData" @submit-info="submitInfo"/>
  </div>
</template>

<script lang="ts" setup>
import { Edit, Delete } from '@element-plus/icons-vue';
import { getSelectOption } from '@/api/common'
import { isNotNull } from '@/utils/validate';
import { currencyAddAllString } from '@/utils/currency';

const props = defineProps({
  // 支付数据：
  data: {
    type: Object
  },
  // 不可修改
  isDisabled: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  getSelect()
})

// 下拉列表
const selectData = ref({})
function getSelect() {
  // 下拉(客户类型、支付对象、支付用途、账户类型、支付方式)
  getSelectOption(['LP_CUSTOMER_TYPE', 'LP_PAY_PERSONAL', 'LP_PAY_PURPOSE', 'LP_ACCOUNT_TYPE', 'LP_PAY_TYPE']).then(({ data }) => {
    selectData.value = data;
  })
}

// 金额表单
const formData = ref({
  adjustMoney: "", //理算金额
  paidMoney: "", //已赔付金额
  adjustFee: "", //理算费用
  prepaidMoney: "", //预支付金额
  compensateMoney: "", //赔付金额
})
let paidMoneyComp = computed(() => {
  let amounts = []
  payinfoList.value?.forEach((item) => {
    amounts.push(item['payMoney'])
  }, [])
  console.log(amounts)
  return currencyAddAllString(amounts)
})

// 理算信息表格
const tableData = ref([])

// 支付信息列表
const payinfoList = ref([])

watch(() => props.data, (newValue, oldValue) => {
  if (newValue) {
    tableData.value = newValue.adjustmentInsureList
    // 初始值赋值
    tableData.value?.forEach(item => {
      // 理算金额默认核损金额
      if(!isNotNull(item.adjustMoney)) {
        item.adjustMoney = item.examMoney
      }
    })
    payinfoList.value = newValue.adjustmentPayList || []
  }
}, {immediate: true})


// 拼装支付信息列表
function getPayInfoContent(info) {
  return {
    // 支付信息
    insuranceProjectId: {title: '险种', content: info.insuranceProjectId, type: 'select', options: []},
    payType: {title: '支付方式', content: info.payType, type: 'input'},
    customerType: {title: '客户类型', content: info.customerType, type: 'select', options: selectData.value['LP_CUSTOMER_TYPE']},
    payPersonal: {title: '支付对象', content: info.payPersonal, type: 'select', options: selectData.value['LP_PAY_PERSONAL']},
    ownerCertificateNo: {title: '收款人户名', content: info.ownerCertificateNo, type: 'input'},
    phoneNo: {title: '移动电话', content: info.phoneNo, type: 'input'},
    payPurpose: {title: '用途', content: info.payPurpose || 'LP_PAY_PURPOSE_1', type: 'select', options: selectData.value['LP_PAY_PURPOSE']},
    payMoney: {title: '金额', content: info.payMoney, type: 'input'},
    depositBank: {title: '开户行名称', content: info.depositBank, type: 'input', span: 12},
    accountType: {title: '账户类型', content: info.accountType, type: 'select', options: selectData.value['LP_ACCOUNT_TYPE']},
    payeeAccount: {title: '收款人账号', content: info.payeeAccount, type: 'input', span: 24},
    remark: {title: '备注', content: info.remark, type: 'input', span: 12}
  }
}

// 提交弹窗信息
function submitInfo(formData) {
  if (index > -1) {
    // 编辑
    for (let key in formData) {
      if (payinfoList.value[index][key] != formData[key]) payinfoList.value[index][key] = formData[key]
    }
  } else {
    payinfoList.value.push({ ...formData })
  }
}

//————————————————————————————————支付信息弹窗相关————————————————————————————————————————
const dialogRef = ref()
// 当前打开的下标
let index = -1

// 新增
function addPayInfo() {
  index = -1
  dialogRef.value.open(null)
}

// 编辑
function editPayInfo(info, idx) {
  index = idx
  dialogRef.value.open(info)
}

// 删除
function deletePayInfo(info, index) {
  ElMessageBox.confirm(
    '确认删除该支付信息？',
    '提示',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
    }
  ).then(() => {
    payinfoList.value.splice(index, 1)
  })
}

//————————————————————————————————end————————————————————————————————————————




</script>

<style lang="scss" scoped>

</style>
