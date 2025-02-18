<template>
  <el-Dialog v-bind="$attrs" v-model="show" width="80%" @close="close"
    :title="typeName + '车辆定损信息'"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form
      ref="form"
      :model="formData"
      :disabled="isDisabled"
      label-position="top">
      <SurveySection title="物损">
        <template #titleSuffix>
          <div class="survey-loss-add-btn" @click="addPart" v-if="isExamPath ? !isExamPath : !isDisabled">新增物损</div>
        </template>
        <el-table :data="goodsList" style="width: 100%;margin-bottom: 10px" border
          :header-cell-style="{ background: '#EBEEF5', color: '#909399', height: '48px' }">
          <el-table-column type="index" label="序号" width="55"/>
          <TableItem v-for="(item, key) in goodsTableConfig"
            :key="key"
            :item="item"
            :propName="key"
            :is-disabled="isDisabled"
            @change-amount="changeGoodsAmount"
            @change-residual="changeResidual"/>
          <el-table-column label="操作" fixed="right" v-if="!isExamPath">
            <template #default="scope">
              <el-button link type="danger" :icon="Delete" @click="deleteSingleGood(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :lg="8" :md="12" :sm="24">
            <!-- 核价金额汇总 -->
            <el-form-item prop="goodsAmount" label="合计">
              <CurrencyInput
                :default-value="formData.goodsAmount"
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
            <!-- 物损合计 - 残值 -->
            <el-form-item prop="checkAmount	" label="物损核定金额">
              <CurrencyInput
                :default-value="formData.checkAmount"
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
import { currencyAddAllString, currencyAddString,
  currencySubtractString } from '@/utils/currency'
import { Delete } from '@element-plus/icons-vue'
import { surveySaveOrUpdate } from '@/api/overall-business/survey/index'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { examSaveOrUpdate } from '@/api/overall-business/exam'

const props = defineProps({
  ckInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const route = useRoute()
// 详情类型
const pageType = route.query.type
let ckAllinfo = ref({})
let currentGoodsId = ref('')
let currentPath = ref(route.path)
// 当前路由地址是否是核损
let isExamPath = route.path.indexOf('exam/detail') != -1

watch( () => props.ckInfo, (newValue, oldValue) => {
  ckAllinfo.value = JSON.parse(JSON.stringify(newValue))
  if (ckAllinfo.value['surveyCarDamageRo']['surveyGoodsInfoRo']['surveyGoodsRo']['goodsId']) {
    currentGoodsId.value = ckAllinfo.value['surveyCarDamageRo']['surveyGoodsInfoRo']['surveyGoodsRo']['goodsId']
  }
})

onMounted(() => {
  init()
})

// 物损信息表单
const formData = ref({
  rescueMoney: '0', // 施救费
  checkAmount: '0', // 物损核定金额
  residualAmount: '0', // 残值汇总
  goodsAmount: '0', // 合计
})
// 车物名称
const typeName = ref('')

// ——————————————————————————————————————————————表单配置——————————————————————————————————————————
// 物损列表数据
const goodsList = ref([])
// 表格配置
const goodsTableConfig = ref()

// 初始化所有数据，方便开关弹窗清空数据
function init() {
  // 表单
  formData.value = {
    rescueMoney: '0', // 施救费
    checkAmount: '0', // 物损核定金额
    residualAmount: '0', // 残值汇总
    goodsAmount: '0', // 合计
  }
  // 表格配置 
  goodsTableConfig.value = {
    goodsName: {title: '物损名称', content: "", type: 'input'},
    goodsPrice: {title: '价格', content: "", type: 'currency'},
    goodsNumber: {title: '数量', content: "", type: 'input'},
    goodsMoney: {title: '物损金额', content: "0", type: 'otherCurrency'},
    workPrice: {title: '工时价格', content: "", type: 'currency'},
    workNumber: {title: '数量', content: "", type: 'input'},
    workMoney: {title: '工时金额', content: "0", type: 'otherCurrency'},
    checkMoney: {title: '核价金额', content: "", type: 'input'},
    residualMoney: {title: '残值', content: "", type: 'currency'},
    checkAmount: {title: '核定金额', content: "", type: 'otherCurrency'},
    remark: {title: '备注', content: "", type: 'input'}
  }
  // 表格数据列表
  goodsList.value = []
}

// ——————————————————————————————————————————————end——————————————————————————————————————————

// 新增物损
function addPart() {
  goodsList.value.push({
    repairPosition: '',
    partName: '',
    partPrice: '',
    repairPlan: '',
    partNumber: '',
    partMoney: '0',
    checkMoney: '',
    residualMoney: ''
  })
}

// 删除单个物损
function deleteSingleGood(scope) {
  ElMessageBox.confirm(
    '确认删除该车损信息吗？',
    '提示',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
    }
  ).then(() => {
    goodsList.value.splice(scope.$index, 1)
    changeGoodsAmount()
    changeResidual() 
  })
}

// 合计
function changeGoodsAmount() {
  let amountStringList = []
  goodsList.value.forEach((item) => {
    item.checkMoney && amountStringList.push(item.checkMoney)
  })
  // 合计
  formData.value.goodsAmount = currencyAddAllString(amountStringList)
}
// 残值合计
function changeResidual() {
  let amountStringList = []
  goodsList.value.forEach((item) => {
    item.residualMoney && amountStringList.push(item.residualMoney)
  })
  // 残值汇总
  formData.value.residualAmount = currencyAddAllString(amountStringList)
}

// 物损核定金额
// 监听残值、合计、施救费
watch(
  [ 
    () => formData.value.goodsAmount,
    () => formData.value.residualAmount,
    () => formData.value.rescueMoney,
  ],
  (value) => {
    formData.value.checkAmount = currencyAddString(currencySubtractString(value[0] || '0', value[1] || '0'), value[2] || '0')
  }
)

//————————————————————————————————弹窗相关——————————————————————————————————————
// 打开关闭状态
const show = ref(false)
const emits = defineEmits(['updateParent'])

// 可编辑状态
const isDisabled = ref(false)
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

// 新建/编辑进入
function openEdit(info, disabled) {
  show.value = true
  info.surveyCarDamageRo.surveyGoodsInfoRo.surveyGoodsItemRoList.forEach(item => {
    goodsList.value.push(item)
  })
  for (let key in info.surveyCarDamageRo.surveyGoodsInfoRo.surveyGoodsRo) {
    formData.value[key] = info.surveyCarDamageRo.surveyGoodsInfoRo.surveyGoodsRo[key]
  }
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

//————————————————————————————————end——————————————————————————————————————

// 1保存/2提交
function submit(type) {
  // 拼装
  const surveyGoodsRo = {goodsId: currentGoodsId.value, claimNo: route.params.id, ...formData.value}
  const surveyGoodsItemRoList = goodsList.value
  surveyGoodsItemRoList.forEach(item => {
    if(!('goodsId' in item && item.goodsId != '')) {
      item['goodsId'] = currentGoodsId.value
    }
  })
  let tempObj = ckAllinfo.value['surveyCarDamageRo']['surveyGoodsInfoRo']
  tempObj['surveyGoodsRo'] = { ...surveyGoodsRo }
  tempObj['surveyGoodsItemRoList'] = surveyGoodsItemRoList
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
        // 保存
        // 初始化物损goodsId
        if (!currentGoodsId.value) {
          currentGoodsId.value = data.goodsId
        }
        // 此处初始化车损id
        if (!ckAllinfo.value['surveyCarDamageRo']['surveyVehicleRo']['ckVehicleId']) {
          ckAllinfo.value['surveyCarDamageRo']['surveyVehicleRo']['ckVehicleId'] = data.ckVehicleId
        }
        // 判断是否是第一次保存surveyBaseId
        if (!('surveyBaseId' in ckAllinfo.value['surveyCarDamageRo']['surveyBaseRo'])) {
          ckAllinfo.value['surveyCarDamageRo']['surveyBaseRo']['surveyBaseId'] = data.surveyBaseId
        }
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

defineExpose({
  openEdit
})

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
