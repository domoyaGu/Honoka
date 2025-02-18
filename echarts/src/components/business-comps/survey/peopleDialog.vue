<template>
  <el-Dialog
    v-bind="$attrs"
    v-model="show"
    width="80%"
    @close="close"
    title="人伤信息"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form
      ref="form"
      :model="formData"
      :disabled="isDisabled"
      label-position="top">
      <!-- 伤者基本信息 -->
      <SurveySection title="伤者基本信息">
        <el-row>
          <FormItem v-for="(item, key) in baseInfoList" :is-disabled="segment == 'exam'"
            v-model="formData[key]" :item="item" :key="key"></FormItem>
        </el-row>
      </SurveySection>
      <!-- 护理信息 -->
      <SurveySection title="护理信息">
        <template #titleSuffix>
          <div v-if="!isDisabled && segment == 'survey'" class="survey-loss-add-btn" @click="addNurse">新增护理人</div>
        </template>
        <el-table :data="injureNursingList" style="width: 100%;margin-bottom: 10px;" border
          :header-cell-style="{ background: '#EBEEF5', color: '#909399', height: '48px' }">
          <TableItem :item="{title: '护理人姓名', content: '', type: 'input'}" propName="nurseName" :is-disabled="isDisabled || segment == 'exam'"/>
          <el-table-column prop="nurseWorkPlace" label="工作单位" width="300px">
            <template #default="scope">
              <el-input
                v-model="scope.row['nurseWorkPlace']"
                placeholder="请输入"
                :disabled="segment == 'exam'"
                clearable
              />
            </template>
          </el-table-column>
          <TableItem :item="{title: '职务', content: '', type: 'input'}" propName="nurseJob" :is-disabled="isDisabled || segment == 'exam'"/>
          <TableItem :item="{title: '月收入(元/月)', content: '', type: 'currency'}" propName="nurseMonthlyIncome" :is-disabled="isDisabled || segment == 'exam'"/>
          <el-table-column label="操作" fixed="right" width="180px" v-if="!isDisabled && segment == 'survey'" >
            <template #default="scope">
              <el-button link type="danger" :icon="Delete"
                @click="() => { injureNursingList.splice(scope.$index, 1) } ">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </SurveySection>
      <!-- 抚养人信息 -->
      <SurveySection title="抚养人信息">
        <template #titleSuffix>
          <div v-if="!isDisabled && segment == 'survey'" class="survey-loss-add-btn" @click="addNourish">新增抚养人</div>
        </template>
        <el-table :data="injureNourishList" style="width: 100%;margin-bottom: 10px;" border
          :header-cell-style="{ background: '#EBEEF5', color: '#909399', height: '48px' }">
          <TableItem v-for="(item, key) in injureNourishTable"
            :key="key"
            :item="item"
            :is-disabled="isDisabled || segment == 'exam'"
            :propName="key"/>
          <el-table-column label="操作" fixed="right" width="180px" v-if="!isDisabled && segment == 'survey'" >
            <template #default="scope">
              <el-button link type="danger" :icon="Delete" @click="() => { injureNourishList.splice(scope.$index, 1) } ">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </SurveySection>
      <!-- 伤者就诊信息 -->
      <SurveySection title="伤者就诊信息">
        <el-row>
          <FormItem v-for="(item, key) in tsurveyInjureVisit" :is-disabled="segment == 'exam'"
            v-model="formData[key]" :item="item" :key="key"></FormItem>
        </el-row>
        <div v-if="!isDisabled && segment == 'survey'" class="survey-loss-add-btn" @click="addDiagnosis" style="margin-bottom: 10px; margin-left: 0;">
          新增诊断
        </div>
        <el-table :data="surveyInjureDiagnosisList" style="width: 100%;margin-bottom: 10px;" border
          :header-cell-style="{ background: '#EBEEF5', color: '#909399', height: '48px' }">
          <TableItem
            :item="{title: '主次诊断', content: '', type: 'select', options: selectData['LP_DIAGNOSE']}"
            :is-disabled="isDisabled || segment == 'exam'"
            propName="primaryDiagnosis"
            width="200px"/>
          <el-table-column prop="clinicalDiagnosis" label="临床诊断">
            <template #default="scope">
              <el-input
                v-model="scope.row['clinicalDiagnosis']"
                placeholder="请输入"
                :disabled="segment == 'exam'"
                clearable
              />
            </template>
          </el-table-column>
          <el-table-column prop="surgicalName" label="手术名称" width="300px">
            <template #default="scope">
              <el-input
                v-model="scope.row['surgicalName']"
                placeholder="请输入"
                :disabled="segment == 'exam'"
                clearable
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="180px" v-if="!isDisabled && segment == 'survey'">
            <template #default="scope">
              <el-button link type="danger" :icon="Delete" @click="() => { surveyInjureDiagnosisList.splice(scope.$index, 1) } ">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :lg="12" :md="12" :sm="24" style="margin-top: 10px;">
          <!-- 主要症状及治疗方案 -->
          <el-form-item prop="symptomsPlan" label="主要症状及治疗方案">
            <el-input
              v-model="formData.symptomsPlan"
              placeholder="请输入"
              type="textarea"
              :disabled="segment == 'exam'"
              :rows="3"
              clearable
            />
          </el-form-item>
        </el-col>
      </SurveySection>
      <!-- 损失项目 -->
      <SurveySection title="损失项目">
        <div style="margin-bottom: 20px;">
          <div v-for="(item, index) in checkData">
            <p class="check-title">{{ index === 0 ? '医疗项目' : (index === 1 ? '死亡伤残项目' : '其他项目') }}</p>
            <el-checkbox
              v-for="project in item"
              :checked="project.checked"
              v-model="project.checked"
              :label="project.lossProjectId"
              :disabled="project.disabled || segment == 'exam'"
              @change="value => setProjectTable(value, project)"
            >
              {{ project.lossName }}
            </el-checkbox>
          </div>
        </div>
        <el-row>
          <FormItem v-for="(item, key) in lossProjectForm" :is-disabled="segment == 'exam'"
            v-model="formData[key]" :item="item" :key="key"></FormItem>
        </el-row>
      </SurveySection>
      <!-- 损失计算表格 -->
      <PeopleTable ref="peopleTable" :data="peopleTableList" @change-amount="changeAmount" :segment="segment"/>
      <!-- 费用汇总 -->
      <SurveySection title="费用汇总">
        <el-row>
          <FormItem v-for="(item, key) in amountBaseList" v-model="formData[key]" :item="item" :key="key"></FormItem>
          <el-col :lg="12" :md="12" :sm="24">
            <el-form-item prop="ckInjureExplan" label="伤者查勘说明">
              <el-input
                v-model="formData.symptomsPlan"
                placeholder="请输入"
                type="textarea"
                :rows="3"
                :disabled="segment == 'exam'"
                clearable
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
        <el-button @click="close">{{ isDisabled ? '返回' : '取消'}}</el-button>
      </div>
    </template>
  </el-Dialog>
</template>

<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue';
import { getLossProject, getSelectOption } from '@/api/common'
import { currencyAddString, currencyMultiply, currencySubtractString } from '@/utils/currency';
import { surveySaveOrUpdate } from '@/api/overall-business/survey'
import { examSaveOrUpdate } from '@/api/overall-business/exam'
import { ElMessage } from 'element-plus';
import { hideLoading, showLoading } from '@/utils/loading';


const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
  // 环节
  segment: {
    type:String,
    default: "survey"
  }
})

function setDialogData(newValue) {
  console.log(newValue)
  if (newValue) {
    // 基础表单赋值
    if (newValue.surveyInjureRo?.injureBase) {
      formData.value = { ...newValue?.surveyInjureRo?.injureBase }
    }
    // 事故责任系数
    if (!formData.value.accidentRatio) {
      // 事故责任系数默认赋值
      formData.value.accidentRatio = newValue.surveyCarDamageRo.surveyBaseRo.ckAccidentLiability
    }
    // 护理信息
    injureNursingList.value = newValue?.surveyInjureRo?.injureNursingList || []
    // 扶养人信息
    injureNourishList.value = newValue?.surveyInjureRo?.injureNourishList || []
    // 就诊信息列表
    surveyInjureDiagnosisList.value = newValue?.surveyInjureRo?.surveyInjureVisitRo?.surveyInjureDiagnosisList || []
    // tsurveyInjureVisit.value = newValue?.surveyInjureRo?.surveyInjureVisitRo?.tsurveyInjureVisit || []
    // 损失信息(需要拼装，根据原始损失勾选项数据)
    // 抚养费信息数组
    let injureAlimonyList = newValue?.surveyInjureRo?.injureAlimonyList || []
    if (injureAlimonyList.length > 0) pushcheckedList(20, injureAlimonyList)
    // 残疾赔偿金数组
    let injureDisabilityList = newValue?.surveyInjureRo?.injureDisabilityList || []
    if (injureDisabilityList.length > 0) pushcheckedList(16, injureDisabilityList)
    // 住宿费数组
    let injureHotelList = newValue?.surveyInjureRo?.injureHotelList || []
    if (injureHotelList.length > 0) pushcheckedList(22, injureHotelList)
    // 续医费数组
    let injureMedicalList = newValue?.surveyInjureRo?.injureMedicalList || []
    if (injureMedicalList.length > 0) pushcheckedList(11, injureMedicalList)
    // 单个数字与2个数字输入框的数组
    let injureCalculationList = newValue?.surveyInjureRo?.injureCalculationList || []
    // 特殊数组需要特殊处理，平铺结构转成id => list
    let idList = {}
    if (injureCalculationList.length > 0) {
      injureCalculationList.forEach(item => {
        if (!idList[item.type]) {
          idList[item.type] = []
        }
        idList[item.type].push({ ...item })
      })
      // 拼装好之后放入数据中
      for (let key in idList) {
        pushcheckedListCalc(key, idList[key])
      }
    }
  } else {
    // 事故责任系数
    if (!formData.value.accidentRatio) {
      console.log(formData.value)
      // 事故责任系数默认赋值
      let amount = ''
      if (props.segment == 'survey') {
        amount = props.data.surveyCarDamageRo.surveyBaseRo.ckAccidentLiability
      } else if (props.segment == 'exam') {
        amount = props.data.surveyCarDamageRo.examVehicleVo.examAccidentLiability
      }
      formData.value.accidentRatio = amount
    }
  }
}

// 赋值拼装损失列表(固定项)
function pushcheckedList(lossProjectId, list) {
  if (checkData.value && checkData.value.length > 0) {
    let isBreak = false;
    for (let i = 0; i < checkData.value.length; i++) {
      for (let j = 0; j < checkData.value[i].length; j++) {
        // 找到对应的费用填入列表
        if (checkData.value[i][j].lossProjectId == lossProjectId) {
          let project = checkData.value[i][j]
          project.checked = true
          project.list = list
          setProjectTable(true, project)
          break;
        }
      }
      if (isBreak) break; 
    }
  }
}
// 赋值拼装损失列表(普通项)
function pushcheckedListCalc(type, list) {
  if (checkData.value && checkData.value.length > 0) {
    let isBreak = false;
    for (let i = 0; i < checkData.value.length; i++) {
      for (let j = 0; j < checkData.value[i].length; j++) {
        // 找到对应的费用填入列表
        if (checkData.value[i][j].type == type) {
          let project = checkData.value[i][j]
          project.checked = true
          project.list = list
          setProjectTable(true, project)
          break;
        }
      }
      if (isBreak) break; 
    }
  }
}

onMounted(() => {
  getSelect()
})

const checkData = ref()

let selectFlag = true
// 下拉获取
let selectData = ref({})
function getSelect() {
  if (selectFlag) {
    // 损失信息勾选项
    getLossProject({typeList: [1, 2, 3]}).then(({ data }) => {
      // 拼装勾选项
      if (data && data.length > 0) {
        let tempData = [[],[],[]]
        data.forEach(item => {
          if (item.module && item.module < 4) {
            // 人伤大表单保存所需要的type
            let type = getType(item.lossProjectId)
            tempData[item.module - 1].push({ ...item, type })
          }
        })
        checkData.value = tempData
      }
    })
    // 下拉(证件类型、户籍、伤者性质、伤者关系、治疗方式、主次诊断)
    getSelectOption(['DOCUMENT_TYPE', 'LP_REGISTERED_NATURE', 'LP_INJURE_NATURE', 
      'LP_INJURE_RELATION', 'LP_TREATMENT_TYPE', 'LP_DIAGNOSE', 'LP_ACCIDENT_HANDLE_TYPE']).then(({ data }) => {
      selectData.value = data;
      init()
      selectFlag = false;
    })
  }
}

// 匹配损失信息和人伤大表单的type
function getType(lossProjectId) {
  let type = -1;
  // 0：医疗费，1：伙食补助费，2：营养费，3：误工费，4：护理费，5：交通费，6：死亡赔偿金，
  // 7：丧葬费，8：精神抚慰金，9：残疾器具费，10：鉴定费，11：诉讼费，12：其他损失
  switch(lossProjectId) {
    case 9: type = 0;break;
    case 10: type = 1;break;
    case 12: type = 2;break;
    case 13: type = 3;break;
    case 14: type = 4;break;
    case 15: type = 5;break;
    case 17: type = 9;break;
    case 18: type = 6;break;
    case 19: type = 7;break;
    case 21: type = 8;break;
    case 23: type = 10;break;
    case 24: type = 11;break;
    case 25: type = 12;break;
  }
  return type
}

// ——————————————————————————————————————————————表单配置——————————————————————————————————————————

// 伤者信息
const initFormData= {
  accidentDate: '', // 事故处理时间
  accidentHandle: '', // 事故处理方式
  accidentRatio: '', // 事故责任系数
  symptomsPlan: '', // 主要症状及治疗方案
  injureNature: '', // 人伤性质，不可更改
  medicalTotalAmount: '0', // 医疗项目预估金额合计
  deathTotalAmount: '0', // 死亡伤残预估金额合计
  estimatedTotalAmount: '0', // 预估金额总计
  medicalClaimAmount: '', // 医疗项目索赔金额合计
  deathClaimAmount: '', // 死亡伤残索赔金额合计
  claimTotalAmount: '', // 索赔金额总计
  medicalExamAmount: '', // 医疗项目核损金额合计
  deathExamAmount: '', // 死亡伤残核损金额合计
  examTotalAmount: '', // 核损金额总计
  ckInjureExplan: '', // 伤者查勘说明
}
const formData = ref(initFormData)
// 伤者基本信息
const baseInfoList = ref({})
// 护理人信息
const injureNursingList = ref([])
// 抚养人信息
const injureNourishList = ref([])
const injureNourishTable = ref({})
// 伤者就诊信息
const tsurveyInjureVisit = ref({})
// 诊断信息列表
const surveyInjureDiagnosisList = ref([])
// 损失项目表单
const lossProjectForm = ref({})
// 损失计算表单数据
const peopleTableList = ref([])
// 费用汇总
const amountBaseList = ref({})

// 表格ref
const peopleTable = ref()

// 初始化所有数据，方便开关弹窗清空数据
function init() {
  if(peopleTable.value) peopleTable.value.initWacthFlag()
  // 表单
  formData.value = JSON.parse(JSON.stringify(initFormData))
  // 人伤基本信息
  baseInfoList.value = {
    injureName: {title: '伤者姓名', content: "", type: 'input'},
    injureNature: {title: '伤者性质', content: "", type: 'cascader',
      options: selectData.value['LP_INJURE_NATURE']},
    injureSex: {title: '性别', content: "", type: 'select',
      options: [{dictValue: 0, dictName: '女'}, {dictValue: 1, dictName: '男'}]},
    injureAge: {title: '年龄', content: "", type: 'input'},
    contactNumber: {title: '联系电话', content: "", type: 'input'},
    certificatesType: {title: '证件类型', content: "", type: 'select', options: selectData.value['DOCUMENT_TYPE']},
    certificatesNo: {title: '证件号码', content: "", type: 'input'},
    birthDate: {title: '出生日期', content: "", type: 'date',
      disabledDate: (time) => {
        return time.getTime() > new Date().getTime()
      }},
    registerNature: {title: '户籍性质', content: "", type: 'select', options: selectData.value['LP_REGISTERED_NATURE']},
    workPlace: {title: '工作单位', content: "", type: 'input'},
    job: {title: '职务', content: "", type: 'input'},
    monthlyIncome: {title: '月收入(元/月)', content: "", type: 'input'},
  }
  // 伤者就诊信息
  tsurveyInjureVisit.value = {
    treatMode: {title: '治疗方式', content: "", type: 'select', options: selectData.value['LP_TREATMENT_TYPE']},
    firstDate: {title: '首诊时间', content: "", type: 'date', dateType: 'datetime'},
    hospitalName: {title: '医院名称', content: "", type: 'input'},
    hospitalizedDate: {title: '入院时间', content: "", type: 'date', dateType: 'datetime',
      disabledDate: (time) => {
        return time.getTime() > new Date().getTime()
      }},
    dischargeDate: {title: '出院时间', content: "", type: 'date', dateType: 'datetime',
      disabledDate: (time) => {
        return time.getTime() > new Date().getTime()
      }},
    deathDate: {title: '死亡时间', content: "", type: 'date', dateType: 'datetime',
      disabledDate: (time) => {
        return time.getTime() > new Date().getTime()
      }},
  }
  // 损失项目表单
  lossProjectForm.value = {
    accidentRatio: {title: '事故责任系数', content: "", type: 'input'}, // 事故责任系数
    accidentHandle: {title: '事故处理方式', content: "", type: 'select',
      options: selectData.value['LP_ACCIDENT_HANDLE_TYPE']}, // 事故处理方式
    accidentDate: {title: '事故处理时间', content: "", type: 'date'}, // 事故处理时间
  }
  // 抚养人表格配置
  injureNourishTable.value = {
    nourishName: {title: '抚养人姓名', content: "", type: 'input'},
    nourishAge: {title: '年龄', content: "", type: 'input'},
    nourishRegisterNature: {title: '户籍性质', content: "", type: 'select', options: selectData.value['LP_REGISTERED_NATURE']},
    nourishRelationship: {title: '伤者关系', content: "", type: 'select', options: selectData.value['LP_INJURE_RELATION']},
    careSiblings: {title: '兄弟姐妹', content: "", type: 'input'}
  }
  // 费用汇总配置
  amountBaseList.value = {
    medicalTotalAmount: {title: '医疗项目预估金额合计', content: "", type: 'currency', disabled: true},
    deathTotalAmount: {title: '死亡伤残预估金额合计', content: "", type: 'currency', disabled: true},
    estimatedTotalAmount: {title: '预估金额总计', content: "", type: 'currency', disabled: true},
    medicalClaimAmount: {title: '医疗项目索赔金额合计', content: "", type: 'currency',
      isHide: props.segment == 'survey', disabled: true},
    deathClaimAmount: {title: '死亡伤残索赔金额合计', content: "", type: 'currency',
      isHide: props.segment == 'survey', disabled:true},
    claimTotalAmount: {title: '索赔金额总计', content: "", type: 'currency',
      isHide: props.segment == 'survey', disabled: true},
    medicalExamAmount: {title: '医疗项目核损金额合计', content: "", type: 'currency',
      isHide: props.segment == 'survey', disabled: true},
    deathExamAmount: {title: '死亡伤残核损金额合计', content: "", type: 'currency',
      isHide: props.segment == 'survey', disabled: true},
    examTotalAmount: {title: '核损金额总计', content: "", type: 'currency',
      isHide: props.segment == 'survey', disabled: true},
  }
  // 表格数据列表
  injureNursingList.value = []
  injureNourishList.value = []
  surveyInjureDiagnosisList.value = []
  // 损失计算
  peopleTableList.value = []
  // 损失取消勾选
  clearChecked()
}

function clearChecked() {
  checkData.value?.forEach(item => {
    item.forEach(project => {
      project.checked = false
      project.list = []
    })
  })
}

// 新增护理人
function addNurse() {
  injureNursingList.value.push({
    nurseName: '',
    nurseWorkPlace: '',
    nurseJob: '',
    nurseMonthlyIncome: '',
    injureId
  })
}

// 新增抚养人
function addNourish() {
  injureNourishList.value.push({
    nourishName: "",
    nourishAge: "",
    nourishRegisterNature: "",
    nourishRelationship: "",
    careSiblings: "",
    injureId
  })
}

// 新增诊断信息
function addDiagnosis() {
  surveyInjureDiagnosisList.value.push({
    primaryDiagnosis: '',
    clinicalDiagnosis: '',
    surgicalName: '',
    injureId
  })
}

// ——————————————————————————————————————————————end——————————————————————————————————————————

//————————————————————————————————损失信息相关——————————————————————————————————————
// 勾选项切换
function setProjectTable(checked, project) {
  if (checked) {
    // 如果已有赋值，则不需要赋值
    if (!(peopleTableList.value?.findIndex(item => item.lossProjectId == project.lossProjectId) > -1)) {
      // 勾选添加
      peopleTableList.value.push({ ...project })
    }
  } else {
    // 删除
    peopleTableList.value.splice(peopleTableList.value.findIndex(item => item.lossProjectId == project.lossProjectId), 1)
    changeAmount()
  }
}

// 金额合计触发
function changeAmount() {
  let medicalTotalAmount = 0; // 医疗项目预估金额合计(医疗费+伙食补助费+营养费+续医费额) * 事故责任系数
  let deathTotalAmount = 0; // 死亡伤残预估金额合计(误工费+护理费+交通费+残疾赔金+残疾器具费+死亡赔偿金+丧葬费+抚养费+精神抚慰金+住宿费) * 事故责任系数
  let estimatedTotalAmount = 0; // 预估金额总计(医疗项目预估金额合计+死亡伤残预估合计金额+（鉴定费+诉讼费+其他损失）*事故责任系数)
  // 核损金额
  let medicalClaimAmount = 0;
  let deathClaimAmount = 0;
  let claimTotalAmount = 0;
  if (peopleTableList.value && peopleTableList.value.length > 0) {
    peopleTableList.value.forEach(project => {
      if (project.list && project.list.length > 0) {
        // 不同项金额字段都不一样，这边没法统一赋值，只能多个分支
        if ([9, 10, 11, 12].includes(project.lossProjectId)) {
          // 医疗项目金额合计(查勘-预估，核损-索赔、核损)
          if (props.segment == 'exam') {
            medicalClaimAmount += Number(project.list[0].claimAmount || 0)
            medicalTotalAmount += Number(project.list[0].examAmount || 0)
          } else {
            medicalTotalAmount += Number(project.list[0].estimatedAmount || 0)
          }
        } else if ([23, 24, 25].includes(project.lossProjectId)) {
          if (props.segment == 'exam') {
            claimTotalAmount += Number(project.list[0].claimAmount || 0)
            estimatedTotalAmount += Number(project.list[0].examAmount || 0)
          } else {
            // 金额总计(查勘-预估，核损-索赔、核损)
            estimatedTotalAmount += Number(project.list[0].estimatedAmount || 0)
          }
        } else {
          if (props.segment == 'exam') {
            deathClaimAmount += Number(project.list[0].claimAmount || 0)
            deathTotalAmount += Number(project.list[0].examAmount || 0)
          } else {
            // 死亡伤残金额合计(查勘-预估，核损-索赔、核损)
            deathTotalAmount += Number(project.list[0].estimatedAmount || 0)
          }
        }
      }
    })
  }
  estimatedTotalAmount += (medicalTotalAmount || 0) + (deathTotalAmount || 0)
  claimTotalAmount += (medicalClaimAmount || 0) + (deathClaimAmount || 0)
  // 查勘联动预估金额
  // 核损联动索赔、核损字段
  if (props.segment == 'exam') {
    // 核损字段（索赔和核损）
    formData.value.medicalExamAmount = (Number(currencyMultiply(medicalTotalAmount, Number(formData.value.accidentRatio || 0))) / 100) + '';
    formData.value.deathExamAmount = (Number(currencyMultiply(deathTotalAmount, Number(formData.value.accidentRatio || 0))) / 100) + '';
    formData.value.examTotalAmount = (Number(currencyMultiply(estimatedTotalAmount, Number(formData.value.accidentRatio || 0))) / 100) + '';
    formData.value.medicalClaimAmount = medicalClaimAmount + '';
    formData.value.deathClaimAmount = deathClaimAmount + '';
    formData.value.claimTotalAmount = claimTotalAmount + '';
  } else {
    // 查勘字段（预估）
    formData.value.estimatedTotalAmount = (Number(currencyMultiply(estimatedTotalAmount, Number(formData.value.accidentRatio || 0))) / 100) + '';
    formData.value.medicalTotalAmount = (Number(currencyMultiply(medicalTotalAmount, Number(formData.value.accidentRatio || 0))) / 100) + '';
    formData.value.deathTotalAmount = (Number(currencyMultiply(deathTotalAmount, Number(formData.value.accidentRatio || 0))) / 100) + '';
  }
}

// 监听事故责任系数，变动的情况更新金额合计
watch(() => formData.value.accidentRatio, (value) => { changeAmount() })
//————————————————————————————————end——————————————————————————————————————

//————————————————————————————————弹窗相关——————————————————————————————————————
// 打开关闭状态
const show = ref(false)
const isDisabled = ref(false)
// 金额（父组件预估合计，索赔合计，损失合计）
let estimatedTotal = ''
let claimTotal = ''
let examTotal = ''
// 禁用状态
function open(value, disabled, amounts) {
  setDialogData(value)
  // 编辑则会有伤者id
  if (props.segment === 'survey') {
    injureId = value?.surveyInjureRo?.injureBase?.injureId || ''
    // 金额赋值
    estimatedTotal = currencySubtractString(
      amounts.estimatedTotal || '0',
      value?.surveyInjureRo?.injureBase?.estimatedTotalAmount || '0')
  } else if (props.segment === 'exam') {
    injureId = value?.examInjureRo?.injureBase?.injureId || ''
    // 金额赋值
    estimatedTotal = currencySubtractString(
      amounts.estimatedTotal || '0',
      value?.examInjureRo?.injureBase?.estimatedTotalAmount || '0')
    claimTotal = currencySubtractString(
      amounts.claimTotal || '0',
      value?.examInjureRo?.injureBase?.claimTotalAmount || '0')
    examTotal = currencySubtractString(
      amounts.examTotal || '0',
      value?.examInjureRo?.injureBase?.examTotalAmount || '0')
  }
  show.value = true
  isDisabled.value = disabled
}

// 是否有过保存
let updateflag = false
// 记录人伤id
let injureId = ""

function close() {
  show.value = false
  if (updateflag) {
    emits('updateParent')
    updateflag = false
  }
  injureId = ""
  estimatedTotal = '0'
  claimTotal = '0'
  examTotal = '0'
  // 初始化所有数据（避免重新打开界面上次的数据还存在）
  init()
}

// 保存/提交
function submit(type) {
  showLoading()
  let body = props.data
  // 拼装各个损失计算项目
  // 抚养费信息数组
  let injureAlimonyList = []
  // 残疾赔偿金数组
  let injureDisabilityList = []
  // 住宿费数组
  let injureHotelList = []
  // 续医费数组
  let injureMedicalList = []
  // 单个数字与2个数字输入框的数组
  let injureCalculationList = []
  if (peopleTableList.value && peopleTableList.value.length > 0) {
    peopleTableList.value.forEach(project => {
      if (project.list && project.list.length > 0) {
        project.list.forEach(item => {
          switch(project.lossProjectId) {
            case 20:
              // 抚养费信息数组
              injureAlimonyList.push({ ...item, injureId })
              break;
            case 16:
              // 残疾赔偿金数组
              injureDisabilityList.push({ ...item, injureId })
              break;
            case 22:
              // 住宿费数组
              injureHotelList.push({ ...item, injureId })
              break;
            case 11:
              // 续医费数组
              injureMedicalList.push({ ...item, injureId })
              break;
            default:
              // 正常类型数组
              injureCalculationList.push({ ...item, injureId })
              break;
          }
        })
      }
    })
  }
  let injureRo = {
    injureAlimonyList, injureDisabilityList, injureHotelList, injureMedicalList, injureCalculationList,
    injureBase: { ...formData.value, injureId }
  }
  // 查勘才需要传别的信息
  if (props.segment == 'survey') {
    // 护理信息
    body.surveyInjureRo.injureNursingList = injureNursingList.value;
    // 抚养人信息
    body.surveyInjureRo.injureNourishList = injureNourishList.value;
    let tsurveyInjureVisitData = {}
    for (let key in tsurveyInjureVisit.value) {
      tsurveyInjureVisitData[key] = formData.value[key]
    }
    // 诊断信息
    body.surveyInjureRo.surveyInjureVisitRo = {
      tsurveyInjureVisit: tsurveyInjureVisitData,
      surveyInjureDiagnosisList: surveyInjureDiagnosisList.value
    }
  }
  // 区分查勘和核损阶段
  if(props.segment == 'exam') {
    body.examInjureRo = { ...body.examInjureRo }
    for(let key in injureRo) {
      body.examInjureRo[key] = injureRo[key]
    }
    body.examInjureRo.examInjure.estimatedTotal
      = currencyAddString(formData.value.estimatedTotalAmount || '0', estimatedTotal || '0');
    body.examInjureRo.examInjure.claimTotal
      = currencyAddString(formData.value.claimTotalAmount || '0', claimTotal || '0');
    body.examInjureRo.examInjure.examTotal
      = currencyAddString(formData.value.examTotalAmount || '0', examTotal || '0');
  } else if (props.segment == 'survey') {
    body.surveyInjureRo = { ...body.surveyInjureRo }
    for(let key in injureRo) {
      body.surveyInjureRo[key] = injureRo[key]
    }
    // 伤者性质在级联下拉下格式有问题（性质不改动的情况下，表单injureNature为string）
    if (formData.value?.injureNature && typeof(formData.value.injureNature) == 'object') {
      body.surveyInjureRo.injureBase.injureNature = formData.value?.injureNature ? formData.value?.injureNature[1]  : ''
    }
    body.surveyInjureRo.surveyInjure.estimatedTotal
      = currencyAddString(formData.value.estimatedTotalAmount || '0', estimatedTotal || '0')
  }
  body['updateType'] = '10'
  // 调用保存接口
  if (props.segment == 'exam') {
    examSaveOrUpdate(body).then(() => {
      // body.examInjureRo.injureBase.injureId = injureId
      finishResponse(type)
    });
  } else if (props.segment == 'survey') {
    surveySaveOrUpdate(body).then(({ data }) => {
      // injureId赋值
      injureId = data.injureId
      body.surveyInjureRo.injureBase.injureId = injureId
      injureNursingList.value?.forEach(item => item.injureId = injureId)
      injureNourishList.value?.forEach(item => item.injureId = injureId)
      finishResponse(type)
    });
  }
}

// 调接口成功后操作
function finishResponse(type) {
  if (type === 1) {
    // 保存
    ElMessage.success('保存成功')
  } else if (type === 2) {
    // 提交
    ElMessage.success('提交成功')
    show.value = false
  }
  updateflag = true
  hideLoading()
}

const emits = defineEmits(['updateParent'])
//————————————————————————————————end——————————————————————————————————————

defineExpose({
  open
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
.check-title {
  color: #303133;
  margin-top: 20px;
}
</style>
