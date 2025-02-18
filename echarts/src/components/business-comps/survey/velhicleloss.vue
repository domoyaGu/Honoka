<template>
  <div>
    <Collapse>
      <template #title><h1>车辆损失情况-车损、物损</h1></template>
      <el-form
        ref="form"
        :model="formData"
        label-position="top">
        <SurveySection title="车损信息">
          <template #titleSuffix>
            <el-popover
              title="选择车辆性质"
              :width="200"
              trigger="click"
              v-if="!isDisabled"
            >
              <template #reference v-if="isExamPath ? !isExamPath : !isDisabled ? !isDetail : !isDisabled">
                <span class="survey-loss-add-btn">新增车辆信息 <el-icon><ArrowDown /></el-icon></span>
              </template>
              <el-button
                type="primary"
                link
                :icon="Plus"
                v-for="item in velhicleStatus"
                @click="addNature(item)"
              >
                {{ item.dictName }}
              </el-button>
            </el-popover>
          </template>
          <el-table :data="velhicleData" style="width: 100%" border
            :header-cell-style="{ background: '#EBEEF5', color: '#909399', height: '48px' }">
            <el-table-column v-for="(item, key) in velhicleTable" :label="item.title" :prop="key">
              <template #default="scope">
                <el-button v-if="key == 'carNumber'" link type="primary" @click="carDetail(scope.row)">
                  {{ scope.row[key] }}
                </el-button>
                <div v-else-if="key != 'carStatus'">
                  {{ item['type'] == 'select' ? 
                    (item['options']?.find(item => item.dictValue == scope.row[key])?.dictName) 
                    : scope.row[key]}}
                </div>
                <!-- 这边暂时写死 -->
                <span v-else>
                  {{ scope.row[key] == 'LP_VEHICLE_NATURE_1' ? '标的' : '三者' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180px" v-if="isExamPath ? !isExamPath : !isDisabled ? !isDetail : !isDisabled">
              <template #default="scope">
                <el-button link type="primary" :icon="Edit"  @click="editVelhicleInfo(scope.row)">编辑</el-button>
                <el-button link type="danger" :icon="Delete" @click="deleteVelhicle(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="summary_expenses" style="margin-top: 20px;">
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item prop="subjectCarLossAmount" label="标的车损核定金额">
                <CurrencyInput
                  :default-value="formData.subjectCarLossAmount"
                  clearable
                  is-watch
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item prop="threeLossAmount" label="三者车损合计核定金额">
                <CurrencyInput
                  :default-value="formData.threeLossAmount"
                  clearable
                  is-watch
                  disabled
                />
              </el-form-item>
            </el-col>
          </div>
        </SurveySection>
        <SurveySection title="物损信息">
          <template #titleSuffix>
            <span class="survey-loss-add-btn" @click="openGoodsDialog" v-if="isExamPath ? !isExamPath : !isDisabled ? !isDetail : !isDisabled">新增物损信息</span>
          </template>
          <el-table :data="goodsData" style="width: 100%" border
            :header-cell-style="{ background: '#EBEEF5', color: '#909399', height: '48px' }">
            <el-table-column v-for="(item, key) in goodsTable" :label="item.title" :prop="key">
              <template #default="scope" v-if="key == 'goodsName'">
                <el-button link type="primary" @click="goodsDetail">{{ scope.row[key] }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180px" v-if="isExamPath ? !isExamPath : !isDisabled ? !isDetail : !isDisabled">
              <template #default="scope">
                <el-button link type="primary" :icon="Edit"  @click="editGoodsInfo()">编辑</el-button>
                <el-button link type="danger" :icon="Delete" @click="deleteGoods(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 20px;">
            <el-col :lg="8" :md="12" :sm="24">
              <el-form-item prop="goodsCheckAmount" label="物损核定金额">
                <CurrencyInput
                  :default-value="formData.goodsCheckAmount"
                  clearable
                  is-watch
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </SurveySection>
      </el-form>
    </Collapse>
    <Collapse>
      <template #title><h1>费用汇总</h1></template>
      <el-row>
        <el-form
          :model="summaryOfExpenses"
          label-position="top">
          <div class="summary_expenses">
            <template v-for="(item, key) in summaryOfExpenses" :key="key">
              <el-col :span="8">
                <el-form-item
                  :label="item.title"
                  :prop="key"
                >
                  <el-input
                    v-if="item.type == 'input'"
                    v-model="item.content"
                    clearable
                    is-watch
                    disabled
                  />
                </el-form-item>
              </el-col>
            </template>
          </div>
        </el-form>
      </el-row>
    </Collapse>
    <VelhicleDialog ref="velhicleDialogRef" :ckInfo="ckAllinfo" @update-parent="updateParent" />
    <VelhicleGoodsDialog ref="goodsDialogRef" :ckInfo="ckAllinfo" @update-parent="updateParent"/>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Edit, Delete, Plus } from '@element-plus/icons-vue';
import { currencyAddAllString, currencyAddString,
  currencyDivide, currencyMultiply, currencySubtractString } from '@/utils/currency';
import { useRoute } from 'vue-router'

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 禁用状态
  isDisabled: {
    type: Boolean,
    default: false
  },
  isDetail: {
    type: Boolean,
    default: true
  }
})

onMounted(() => {
  initTableData()
})

const route = useRoute()
// 当前路由地址是否是核损
let isExamPath = route.path.indexOf('exam/detail') != -1

// 深拷贝整合信息
let ckAllinfo = ref({})
// 监听props.data变化
watch(props.data, (newValue, oldValue) => {
  ckAllinfo.value = JSON.parse(JSON.stringify(newValue))
  resetInfo()
})

// 回显
function resetInfo() {
  // 车损
  velhicleData.value = []
  ckAllinfo.value['surveyCarDamageRo']['surveyCarInfoRoList'].forEach(item => {
    velhicleData.value.push(item.surveyCarRo)
  })
  // 物损
  goodsData.value = []
  ckAllinfo.value['surveyCarDamageRo']['surveyGoodsInfoRo']['surveyGoodsItemRoList'].forEach(item => {
    goodsData.value.push(item)
  })

  // 事故责任比例
  let ckAccidentRate = ckAllinfo.value['surveyCarDamageRo'].surveyBaseRo.ckAccidentLiability

  // 费用总会
  let subjectAmountStringList = []
  let threeAmountStringList = []
  let rescueAmountStringList = [] // 施救费总汇列表

  // 物损施救费总汇
  let goodsRescueAmount = ''
  if (goodsData.value.length != 0) {
    goodsRescueAmount =  ckAllinfo.value['surveyCarDamageRo']['surveyGoodsInfoRo']['surveyGoodsRo']['rescueMoney']
    if (goodsRescueAmount) {
      rescueAmountStringList.push(goodsRescueAmount)
    }
  }
  
  if (velhicleData.value.length !== 0) {
    velhicleData.value.forEach(item => {
      if (item.carStatus == 'LP_VEHICLE_NATURE_1') {
        subjectAmountStringList.push(item.checkAmount)
      } else if (item.carStatus == 'LP_VEHICLE_NATURE_2') {
        threeAmountStringList.push(item.checkAmount)
      }
      if (item.rescueMoney) {
        rescueAmountStringList.push(item.rescueMoney)
      }
    })
    formData.value.subjectCarLossAmount = currencyAddAllString(subjectAmountStringList)
    // 标的车损核定金额
    summaryOfExpenses.value.subjectCarLossAmount.content = currencyAddAllString(subjectAmountStringList)
    formData.value.threeLossAmount = currencyAddAllString(threeAmountStringList)
  } else {
    formData.value.subjectCarLossAmount = '0'
    // 标的车损核定金额
    summaryOfExpenses.value.subjectCarLossAmount.content = '0'
    formData.value.threeLossAmount = '0'
  }
  // 物损核定金额
  if (goodsData.value.length !== 0) {
    formData.value.goodsCheckAmount = ckAllinfo.value['surveyCarDamageRo']['surveyGoodsInfoRo']['surveyGoodsRo']['checkAmount']
  } else {
    formData.value.goodsCheckAmount = ''
  }
  // 三者车物合计核定金额
  summaryOfExpenses.value.threeCarLossAmount.content = currencyAddString( formData.value.threeLossAmount, formData.value.goodsCheckAmount)
  // 施救费金额
  summaryOfExpenses.value.rescueAmount.content = currencyAddAllString(rescueAmountStringList)
  // 总核定损失金额
  let subjectThreeAmount = currencyAddString(formData.value.subjectCarLossAmount, summaryOfExpenses.value.threeCarLossAmount.content)
  let rate = currencyDivide(ckAccidentRate, 100)
  summaryOfExpenses.value.totalAmount.content = currencyMultiply(Number(subjectThreeAmount), rate)
}
// 车辆性质(暂时写死)
const velhicleStatus = [
{
  dictValue: 'LP_VEHICLE_NATURE_1',
  dictName: '标的'
},
{
  dictValue: 'LP_VEHICLE_NATURE_2',
  dictName: '三者'
}
]

const formData = ref({
  subjectCarLossAmount: '0', // 标的车损核定金额
  threeLossAmount: '0', // 三者车损合计核定金额
  goodsCheckAmount: '0'// 物损核定金额
})
// 费用总汇 在surveyVehicleVo对象中
const summaryOfExpenses = ref({
  subjectCarLossAmount: {title: '标的车损核定金额', content:'', type: 'input'},
  threeCarLossAmount: {title: '三者车物合计核定金额', content:'', type: 'input'},
  rescueAmount: {title: '施救费金额', content:'', type: 'input'},
  totalAmount: {title: '总核定损失金额', content:'', type: 'input'}
})

// 车损信息
const velhicleData = ref([])
// 车损表格
const velhicleTable = {
  carStatus: {title: '性质'},
  carNumber: {title: '车牌号码', content: "", type: 'input'},
  vinNo: {title: '车架号', content: "", type: 'input'},
  engineNumber: {title: '发动机号', content: "", type: 'input'},
  carBrand: {title: '车辆品牌', content: "", type: 'input'},
  carStyle: {title: '车辆款式', content: "", type: 'input'},
  outputVolume: {title: '排量', content: "", type: 'input'},
  driverName: {title: '驾驶员姓名', content: "", type: 'input'},
  driverSex: {title: '性别', content: "", type: 'select',
    options: [{dictValue: 0, dictName: '女'}, {dictValue: 1, dictName: '男'}]},
  driverPhone: {title: '联系电话', content: "", type: 'input'},
}
// 物损信息
const goodsData = ref([])
// 物损表格
const goodsTable = {
  goodsName: {title: '物损名称', content: "", type: 'input'},
  goodsNumber: {title: '数量', content: "", type: 'input'},
  checkAmount: {title: '核定金额', content: "", type: 'otherCurrency'},
}

// 初始化表格数据
function initTableData() {
  velhicleData.value = []
  goodsData.value = []
  formData.value = {
    subjectCarLossAmount: '0', // 标的车损核定金额
    threeLossAmount: '0', // 三者车物合计核定金额
    goodsCheckAmount: '0'// 物损核定金额
  }
}

//————————————————————————————————————————————end——————————————————————————————————
// 车损
const velhicleDialogRef = ref()
// 物损
const goodsDialogRef = ref()

// 新增车损
/**
* dictName: "标的/三者" dictValue: "LP_VEHICLE_NATURE_1标的，LP_VEHICLE_NATURE_2三者"
*/
function addNature(velhicleProperties) {
  emits('openDialog')
  velhicleDialogRef.value.open(velhicleProperties, false)
}

// 新增物损
function openGoodsDialog() {
  emits('openDialog')
  goodsDialogRef.value.openEdit(ckAllinfo.value, false)
}

// 接受车物传过来的信息并传给父组件
const emits = defineEmits(['velhicleToDetail', 'openDialog', 'update', 'delete'])

/**
 * 查看
 * @param rowInfo 当前车辆车损信息
 */
function carDetail(row) {
  emits('openDialog')
  velhicleDialogRef.value.openEdit(row, true)
}

/**
 * 编辑
 * @param rowInfo 当前车辆车损信息
 */
function editVelhicleInfo(rowInfo) {
  emits('openDialog')
  velhicleDialogRef.value.openEdit(rowInfo, false)
}

/**
 * 编辑
 * @param rowInfo 当前车辆物损信息
 */
function editGoodsInfo() {
  emits('openDialog')
  goodsDialogRef.value.openEdit(ckAllinfo.value, false)
}

/**
 * 查看
 * @param rowInfo 当前车辆物损损信息
 */
function goodsDetail() {
  emits('openDialog')
  goodsDialogRef.value.openEdit(ckAllinfo.value, true)
}

/**
 * rowInfo 当前行信息
 * 删除车损
 */
function deleteVelhicle(rowInfo) {
  ElMessageBox.confirm(
    '确认删除该车损信息吗？',
    '提示',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
    }
  ).then(() => {
    let deleteObjIndex = null
    ckAllinfo.value['surveyCarDamageRo']['surveyCarInfoRoList'].find((item, index) => {
      if (item.surveyCarRo.ckCarId == rowInfo.ckCarId) {
        deleteObjIndex = index
      }
    })
    ckAllinfo.value['surveyCarDamageRo']['surveyCarInfoRoList'].splice(deleteObjIndex, 1)
    resetInfo()
    emits('delete', ckAllinfo.value)
  })
}

/**
 * rowInfo 当前行信息
 * 删除物损
 */
function deleteGoods(rowInfo) {
  ElMessageBox.confirm(
    '确认删除该物损信息吗？',
    '提示',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
    }
  ).then(() => {
    let deleteObjIndex = null
    ckAllinfo.value['surveyCarDamageRo']['surveyGoodsInfoRo']['surveyGoodsItemRoList'].forEach((item, index) => {
      if (item.itemId == rowInfo.itemId) {
        deleteObjIndex = index
      }
    })
    // 物损四个空格
    // rescueMoney: '0', // 施救费
    // checkAmount: '0', // 物损核定金额
    // residualAmount: '0', // 残值汇总
    // goodsAmount: '0', // 合计
    let obj = ckAllinfo.value['surveyCarDamageRo']['surveyGoodsInfoRo']['surveyGoodsRo']
    let oldCheckAmouont = obj['checkAmount']
    let oldResidualAmount = obj['residualAmount']
    let oldGoodsAmount = obj['goodsAmount']
    ckAllinfo.value['surveyCarDamageRo']['surveyGoodsInfoRo']['surveyGoodsItemRoList'].splice(deleteObjIndex, 1)
    if (ckAllinfo.value['surveyCarDamageRo']['surveyGoodsInfoRo']['surveyGoodsItemRoList'].length == 0) {
      obj['checkAmount'] = ''
      obj['residualAmount'] = ''
      obj['goodsAmount'] = ''
      obj['rescueMoney'] = ''
    } else {
      obj['checkAmount'] = currencySubtractString(oldCheckAmouont, rowInfo.checkAmount)
      obj['residualAmount'] = currencySubtractString(oldResidualAmount, rowInfo.residualMoney)
      obj['goodsAmount'] = currencySubtractString(oldGoodsAmount, rowInfo.checkMoney)
    }
    resetInfo()
    emits('delete', ckAllinfo.value)
  })
}
// 父组件更新所有数据
function updateParent() {
  emits('update')
}

defineExpose({
  summaryOfExpenses
})
</script>

<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  width: 286px;
}
:deep(.cell) {
  text-overflow: unset;
}
:deep(.el-input,.el-select) {
  // width: 286px;
}
.summary_expenses {
  display: flex;
  flex-wrap: wrap;
}
:deep(.summary_expenses .el-input) {
  width: 286px;
}
</style>
