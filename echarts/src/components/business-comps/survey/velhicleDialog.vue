<template>
  <el-Dialog v-bind="$attrs" v-model="show" width="80%" @close="close"
    :title="typeName + '车辆信息'"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form
      ref="form"
      :model="formData"
      :disabled="isDisabled"
      label-position="top">
      <SurveySection :title="typeName + '车信息'">
        <el-row>
          <FormItem v-for="(item, key) in velhicleList"
            v-model="formData[key]"
            :item="item"
            :key="key"
            :is-disabled="isExamPath">
          </FormItem>
        </el-row>
      </SurveySection>
      <SurveySection title="修理厂信息">
        <el-row>
          <FormItem v-for="(item, key) in repairList" v-model="formData[key]" :item="item" :key="key" :is-disabled="isExamPath"></FormItem>
        </el-row>
      </SurveySection>
      <SurveySection title="配件信息">
        <template #titleSuffix>
          <div class="survey-loss-add-btn" @click="addPart" v-if="isExamPath ? !isExamPath : !isDisabled">新增配件</div>
        </template>
        <el-table :data="partList" style="width: 100%;margin-bottom: 10px" border
          :header-cell-style="{ background: '#EBEEF5', color: '#909399', height: '48px' }">
          <el-table-column type="index" label="序号" width="55"/>
          <TableItem v-for="(item, key) in partTableConfig"
            :key="key"
            :item="item"
            :propName="key"
            :is-disabled="isDisabled" 
            @change-amount="changePartAmount"
            @change-residual="changeResidual"/>
          <el-table-column label="操作" fixed="right" v-if="!isExamPath">
            <template #default="scope">
              <el-button link type="danger" :icon="Delete" @click="deleteSinglePart(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :lg="8" :md="12" :sm="24">
            <!-- 核价金额汇总 -->
            <el-form-item prop="partAmount" label="配件合计">
              <CurrencyInput
                :default-value="formData.partAmount"
                clearable
                is-watch
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <!-- 残值汇总 -->
            <el-form-item prop="residualAmount" label="残值">
              <CurrencyInput
                :default-value="formData.residualAmount"
                clearable
                is-watch
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <!-- 配件合计 - 残值 -->
            <el-form-item prop="partCheckAmount	" label="配件核定金额">
              <CurrencyInput
                :default-value="formData.partCheckAmount"
                clearable
                is-watch
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
      </SurveySection>
      <SurveySection title="工时信息">
        <template #titleSuffix>
          <div class="survey-loss-add-btn" @click="addHour" v-if="isExamPath ? !isExamPath : !isDisabled">新增工时</div>
        </template>
        <el-table :data="workHourList" style="width: 100%;margin-bottom: 10px;" border
          :header-cell-style="{ background: '#EBEEF5', color: '#909399', height: '48px' }">
          <el-table-column type="index" label="序号" width="55"/>
          <TableItem v-for="(item, key) in HourTableConfig"
            :key="key"
            :item="item"
            :propName="key"
            :is-disabled="isDisabled"
            @change-amount="changeHourAmount"/>
          <el-table-column label="操作" fixed="right" v-if="!isExamPath">
            <template #default="scope">
              <el-button link type="danger" :icon="Delete" @click="deleteSingleWork(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :lg="8" :md="12" :sm="24">
            <!-- 核价金额汇总 -->
            <el-form-item prop="workHourAmount" label="工时合计">
              <CurrencyInput
                :default-value="formData.workHourAmount"
                clearable
                is-watch
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
      </SurveySection>
      <SurveySection title="费用汇总">
        <el-row>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item prop="rescueMoney" label="施救费">
              <CurrencyInput
                :default-value="formData.rescueMoney"
                @inputtext="(val) => { formData.rescueMoney = val }"
                clearable
                is-watch
              />
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item prop="checkAmount" :label="typeName + '核定金额'">
              <CurrencyInput
                :default-value="formData.checkAmount"
                @inputtext="(val) => { formData.checkAmount = val }"
                clearable
                is-watch
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
      </SurveySection>
    </el-form>
    <template #footer>
      <div style="text-align: center;">
        <el-button type="primary" @click="submit(1)" v-if="!isDisabled">保存</el-button>
        <el-button type="primary" @click="submit(2)" v-if="!isDisabled">提交</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </template>
  </el-Dialog>
</template>

<script lang="ts" setup>
import { currencyAddAll, currencyAddAllString,
  currencySubtractString, currencyToNumber } from '@/utils/currency';
import { Delete } from '@element-plus/icons-vue';
import { getSelectOption } from '@/api/common'
import { surveySaveOrUpdate } from '@/api/overall-business/survey/index'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus';
import { examSaveOrUpdate } from '@/api/overall-business/exam'

const route = useRoute()
const props = defineProps({
  ckInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

let ckAllinfo = ref({})
let currentClaimNo = ref()
let currentCkvehicleId = ref('')
// 详情类型
const pageType = route.query.type
// 当前路由地址是否是核损
let isExamPath = route.path.indexOf('exam/detail') != -1
let currentPath = ref(route.path)

// 监听props.data变化
watch(() => props.ckInfo, (newValue, oldValue) => {
  ckAllinfo.value = JSON.parse(JSON.stringify(newValue))
  if (ckAllinfo.value['surveyCarDamageRo']['surveyVehicleRo']['ckVehicleId']) {
    currentCkvehicleId.value = ckAllinfo.value['surveyCarDamageRo']['surveyVehicleRo']['ckVehicleId']
  }
})

onMounted(() => {
  getSelect()
  currentClaimNo.value = route.params.id
})

let selectFlag = true
// 下拉获取
let selectData = ref({})
function getSelect() {
  if (selectFlag) {
    // 下拉(修理厂性质、价格方案)
    getSelectOption(['LP_REPAIR_NATURE']).then(({ data }) => {
      selectData.value = data;
      init()
      selectFlag = false;
    })
  }
}

// 车辆信息表单
const formData = ref({
  rescueMoney: '0', // 施救费
  checkAmount: '0', // 总核定金额
  residualAmount: '0', // 残值汇总
  workHourAmount: '0', // 工时合计
  partAmount: '0', // 配件合计
  partCheckAmount: '0', // 配件核定金额
})
// 车物名称
const typeName = ref('')
// 车物标的或三者
const carStatus = ref('')

// 车物ckCarId
let ckCarId = ref('')

// ——————————————————————————————————————————————表单配置——————————————————————————————————————————
// 车信息
const velhicleList = ref()
// 修理厂信息
const repairList = ref()
// 配件信息
const partList = ref([])
// 工时信息
const workHourList = ref([])
// 表格配置
const partTableConfig = ref({})
const HourTableConfig = ref({})

// 初始化所有数据，方便开关弹窗清空数据
function init() {
  ckCarId.value = '' // 初始化车唯一id
  // 表单
  formData.value = {
    rescueMoney: '0', // 施救费
    checkAmount: '0', // 总核定金额
    residualAmount: '0', // 残值汇总
    workHourAmount: '0', // 工时合计
    partAmount: '0', // 配件合计
    partCheckAmount: '0', // 配件核定金额
  }
  // 车信息
  velhicleList.value = {
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
  // 修理厂信息
  repairList.value = {
    repairShopName: {title: '修理厂名称', content: "", type: 'input'},
    repairShopMobile: {title: '修理厂电话', content: "", type: 'input'},
    repairShopNature: {title: '修理厂性质', content: "", type: 'select', options: selectData.value['LP_REPAIR_NATURE']},
  }
  // 表格配置
  const tableConfig = {
    repairPosition: {title: '修理部位', content: "", type: 'input'},
    partName: {title: '配件名称', content: "", type: 'input'},
    partPrice: {title: '价格', content: "", type: 'currency'},
    repairPlan: {title: '维修方案', content: "", type: 'select', options: selectData.value['LP_REPAIR_NATURE']},
    partNumber: {title: '数量', content: "", type: 'input'},
    partMoney: {title: '金额', content: "0", type: 'otherCurrency'},
    checkMoney: {title: '核价金额', content: "", type: 'currency'},
    residualMoney: {title: '残值', content: "", type: 'currency'},
    remark: {title: '备注', content: "", type: 'input'}
  }
  partTableConfig.value = { ...tableConfig }
  HourTableConfig.value = { ...tableConfig }
  // 表格数据列表
  partList.value = []
  workHourList.value = []
}

// ——————————————————————————————————————————————end——————————————————————————————————————————

// 新增配件
function addPart() {
  partList.value.push({
    repairPosition: '',
    partName: '',
    partPrice: '',
    repairPlan: '',
    partNumber: '',
    partMoney: '0',
    checkMoney: '',
    residualMoney: '',
    ckCarStatus: '0'
  })
}

// 新增工时
function addHour() {
  workHourList.value.push({
    repairPosition: '',
    partName: '',
    partPrice: '',
    repairPlan: '',
    partNumber: '',
    partMoney: '0',
    checkMoney: '',
    residualMoney: '',
    remark: '',
    ckCarStatus: '1'
  })
}

// 删除单个配件
function deleteSinglePart(scope) {
  ElMessageBox.confirm(
    '确认删除该车损信息吗？',
    '提示',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
    }
  ).then(() => {
    partList.value.splice(scope.$index, 1)
    changePartAmount()
    changeResidual()
  })
}

// 删除单个工时
function deleteSingleWork(scope) {
  ElMessageBox.confirm(
    '确认删除该车损信息吗？',
    '提示',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
    }
  ).then(() => {
    workHourList.value.splice(scope.$index, 1)
    changeHourAmount()
  })
}

// 配件合计
function changePartAmount() {
  let amountStringList = []
  partList.value.forEach((item) => {
    item.checkMoney && amountStringList.push(item.checkMoney)
  })
  // 配件合计
  formData.value.partAmount = currencyAddAllString(amountStringList)
  // 配件核定金额
  formData.value.partCheckAmount = currencySubtractString(formData.value.partAmount, formData.value.residualAmount)
}
// 残值合计
function changeResidual() {
  let amountStringList = []
  partList.value.forEach((item) => {
    item.residualMoney && amountStringList.push(item.residualMoney)
  })
  // 残值汇总
  formData.value.residualAmount = currencyAddAllString(amountStringList)
  // 配件核定金额
  formData.value.partCheckAmount = currencySubtractString(formData.value.partAmount, formData.value.residualAmount)
}

// 工时合计
function changeHourAmount() {
  let amountStringList = []
  workHourList.value.forEach((item) => {
    amountStringList.push(item.checkMoney)
  })
  // 工时合计
  formData.value.workHourAmount = currencyAddAllString(amountStringList)
}

// 总核定金额
// 监听配件金额、工时合计、施救费
watch(
[ 
  () => formData.value.partCheckAmount,
  () => formData.value.workHourAmount,
  () => formData.value.rescueMoney,
]
  ,
  (value) => {
    formData.value.checkAmount = currencyAddAll([currencyToNumber(value[0]) || 0, 
      currencyToNumber(value[1]) || 0, 
      currencyToNumber(value[2]) || 0]);
  }
)

//————————————————————————————————弹窗相关——————————————————————————————————————
// 打开关闭状态
const show = ref(false)
// 可编辑状态
const isDisabled = ref(false)

function open(velhicleProperties, disabled) {
  show.value = true
  typeName.value = velhicleProperties.dictName
  carStatus.value = velhicleProperties.dictValue
  if (isExamPath) {
    // pageType 1: 核损 2: 查看详情-禁止操作
    if (pageType == '1') {
      isDisabled.value = false
    } else {
      isDisabled.value = true
    }
  } else {
    isDisabled.value = disabled
  }
}

// 从编辑进入
function openEdit(vehicleInfo, disabled) {
  show.value = true
  ckCarId.value = vehicleInfo.ckCarId
  carStatus.value = vehicleInfo.carStatus
  currentCkvehicleId.value = vehicleInfo.ckvehicleId
  formData.value = {...vehicleInfo}
  vehicleInfo.surveyCarPartsVoList.forEach((item) => {
    if (item.ckCarStatus === 0) { // 配件
      partList.value.push(item)
    } else if (item.ckCarStatus === 1) { // 工时
      workHourList.value.push(item)
    }
  })
  if (isExamPath) {
    // pageType 1: 核损 2: 查看详情-禁止操作
    if (pageType == '1') {
      isDisabled.value = false
    } else {
      isDisabled.value = true
    }
  } else {
    isDisabled.value = disabled
  }
}

// 是否有过保存
let updateflag = false

function close() {
  show.value = false
  if (updateflag) {
    emits('updateParent')
  }
  updateflag = false
  // 初始化所有数据（避免重新打开界面上次的数据还存在）
  init()
}
//————————————————————————————————end——————————————————————————————————————
const emits = defineEmits(['updateParent'])

defineExpose({
  open,
  setVelhicleInfo,
  openEdit
})

// 保存/提交
/**
 * 
 * @param type 1保存2提交
 */
function submit(type) {
  // 拼装
  const surveyCarPartRoList2 = workHourList.value // 工时
  const surveyCarPartRoList1 = partList.value // 部件
  const surveyCarRo = {
    ckVehicleId:currentCkvehicleId.value,
    carStatus: carStatus.value,
    ckCarId: ckCarId.value,
    ...formData.value
  }

  const surveyCarInfoRoList = reactive({
    claimNo: currentClaimNo.value,
    surveyCarPartRoList2,
    surveyCarPartRoList1,
    surveyCarRo
  })
  // 获取ckCarId组合成一个列表
  let ckCarIdList = ckAllinfo.value['surveyCarDamageRo']['surveyCarInfoRoList'].map(item => {
    if (item.surveyCarRo.ckCarId) {
      return item.surveyCarRo.ckCarId
    }
  })
  // 通过indexOf判断新增还是更新,新增时ckCarId为''
  if (ckCarIdList.indexOf(ckCarId.value) !== -1) {
    let ckCarIdIndex = ckCarIdList.indexOf(ckCarId.value)
    ckAllinfo.value['surveyCarDamageRo']['surveyCarInfoRoList'].splice(ckCarIdIndex, 1, surveyCarInfoRoList)
  } else {
    ckAllinfo.value['surveyCarDamageRo']['surveyCarInfoRoList'].push(surveyCarInfoRoList)
  }

  // 调接口保存
  if (currentPath.value.indexOf('/exam/detail/') != -1) {
    ckAllinfo.value['examCarDamageRo'] = ckAllinfo.value['surveyCarDamageRo']
    examSaveOrUpdate(ckAllinfo.value).then(({ data }) => {
      if (type === 1) {
        // 保存
        ElMessage.success('保存成功')
        updateflag = true
      } else if (type === 2) {
        // 提交
        ElMessage.success('提交成功')
        emits('updateParent')
        show.value = false
      }
    })
  } else {
    surveySaveOrUpdate(ckAllinfo.value).then(({data}) => {
      if (type === 1) {
        if (!ckCarId.value) {
          ckCarId.value = data.ckCarId
        }
        // 新增车辆时，添加对应字段
        ckAllinfo.value['surveyCarDamageRo']['surveyCarInfoRoList'].forEach(item => {
          // 此处初始化每辆车损id-------------编辑方法中可获取
          if (!item.surveyCarRo.ckCarId) {
            item.surveyCarRo.ckCarId = data.ckCarId
          }
          // 此处初始化车损id-------------编辑/新建方法中可获取
          if (!currentCkvehicleId.value) {
            currentCkvehicleId.value = data.ckVehicleId
          }
        })
        // 判断是否有车损唯一标识ckVehicleId
        if (!ckAllinfo.value['surveyCarDamageRo']['surveyVehicleRo']['ckVehicleId']) {
          ckAllinfo.value['surveyCarDamageRo']['surveyVehicleRo']['ckVehicleId'] = data.ckVehicleId
        }
        // 判断是否是第一次查勘保存surveyBaseId
        if (!('surveyBaseId' in ckAllinfo.value['surveyCarDamageRo']['surveyBaseRo'])) {
          ckAllinfo.value['surveyCarDamageRo']['surveyBaseRo']['surveyBaseId'] = data.surveyBaseId
        }
        // 初始化物损goodsId
        if (!ckAllinfo.value['surveyCarDamageRo']['surveyGoodsInfoRo']['surveyGoodsRo']['goodsId']) {
          ckAllinfo.value['surveyCarDamageRo']['surveyGoodsInfoRo']['surveyGoodsRo']['goodsId'] = data.goodsId
        }
        // 保存
        ElMessage.success('保存成功')
        updateflag = true
      } else if (type === 2) {
        // 提交
        ElMessage.success('提交成功')
        emits('updateParent')
        show.value = false
      }
    })
  }
}

// 处理velhicleloss传过来的信息
// 表格数据列表
//  partList.value = []
//   workHourList.value = []
function setVelhicleInfo(info) {
  partList.value = info.surveyCarPartRoList1
  workHourList.value = info.surveyCarPartRoList2
}
</script>
<style lang="scss" scoped>

.el-input,
.el-select {
  width: 286px;
}
:deep(.el-input__wrapper) {
  width: 286px;
}
</style>
