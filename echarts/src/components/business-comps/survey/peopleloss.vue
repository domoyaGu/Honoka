<template>
  <div>
    <Collapse>
      <template #title><h1>损失情况-人伤</h1></template>
      <SurveySection title="人伤信息">
        <template #titleSuffix>
          <span class="survey-loss-add-btn" @click="addNature()" v-if="!isDisabled && segment == 'survey'">新增人伤信息</span>
        </template>
        <el-table :data="peopleData" style="width: 100%" border
          :header-cell-style="{ background: '#EBEEF5', color: '#909399', height: '48px' }">
          <el-table-column
            v-for="(item, key) in peopleTable"
            :label="item.title"
            :key="key"
            :prop="key">
            <template #default="scope">
              <div v-if="key == 'injureName'">
                <el-button link type="primary" @click="editPeople(scope.row)">{{ scope.row[key] }}</el-button>
              </div>
              <div v-else>
                {{ getContent(item, scope.row[key]) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="220px" v-if="segment === 'survey'">
            <template #default="scope">
              <el-button v-if="isDisabled" link type="primary" :icon="Edit"
                @click="setFollow(0, scope.row)">查看设置</el-button>
              <div v-else>
                <el-button link type="primary" :icon="Edit"
                  v-if="!scope.row?.data?.injureSet?.setId"
                  @click="setFollow(0, scope.row)">跟踪设置</el-button>
                <span style="display: inline-block;" v-else>
                  <el-button link type="primary" :icon="Edit" @click="setFollow(1, scope.row)">跟踪</el-button>
                  <el-button link type="primary" :icon="Edit" @click="setFollow(2, scope.row)">修改</el-button>
                </span>
                <el-button link type="danger" :icon="Delete" style="margin-left: 5px;"
                  @click="deletePeople(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-form label-position="top" style="margin-top: 10px;">
          <el-row>
            <el-col :lg="8" :md="12" :sm="24">
              <!-- 预估金额合计 -->
              <el-form-item prop="estimatedTotal" label="预估金额合计">
                <div style="width: 286px;">
                  <CurrencyInput
                    v-if="segment == 'exam'"
                    :default-value="data?.examInjureVo?.surveyInjure?.estimatedTotal"
                    clearable
                    is-watch
                    disabled
                  />
                  <CurrencyInput
                    v-else
                    :default-value="data?.surveyInjureVo?.surveyInjure?.estimatedTotal"
                    clearable
                    is-watch
                    disabled
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" :sm="24" v-if="segment === 'exam'">
              <!-- 预估金额合计 -->
              <el-form-item prop="claimTotal" label="索赔金额合计">
                <div style="width: 286px;">
                  <CurrencyInput
                    :default-value="data?.examInjureVo?.surveyInjure?.claimTotal"
                    clearable
                    is-watch
                    disabled
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" :sm="24" v-if="segment === 'exam'">
              <!-- 预估金额合计 -->
              <el-form-item prop="examTotal" label="核损金额合计">
                <div style="width: 286px;">
                  <CurrencyInput
                    :default-value="data?.examInjureVo?.surveyInjure?.examTotal"
                    clearable
                    is-watch
                    disabled
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </SurveySection>
    </Collapse>
    <PeopleDialog ref="peopleDialogRef" :data="dialogData" @update-parent="updateParent"
      :segment="segment" :is-disabled="isDisabled"/>
    <el-Dialog v-model="showSetFollow" width="500px" @close="closeSetFollow"
      title="人伤跟踪设置"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form
        :model="injureSet"
        :disabled="isDisabled"
        label-position="top">
        <el-form-item label="设置跟踪时间" prop="setNo">
          <div style="width: 100%">
            <el-date-picker
              v-model="injureSet.setDate"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
              placeholder="请选择"
            />
          </div>
        </el-form-item>
        <el-form-item label="设置跟踪次数" prop="setNo">
          <div style="width: 286px">
            <el-input
              v-model="injureSet.setNo"
              type="number"
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="间隔天数" prop="setDay">
          <div style="width: 286px">
            <el-input
              v-model="injureSet.setDay"
              type="number"
              clearable
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center;">
          <el-button v-if="isDisabled || segment == 'exam'" @click="closeSetFollow">取消</el-button>
          <div v-else>
            <el-button type="primary" @click="setSubmit()">设置完成</el-button>
            <el-button @click="closeSetFollow" :disabled="isNotNull(injureSet.setId)">取消跟踪</el-button>
          </div>
        </div>
      </template>
    </el-Dialog>
    <el-Dialog v-model="showFollow" width="500px" @close="closeFollow"
      title="人伤跟踪"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form
        :model="injureSet"
        :disabled="isDisabled"
        label-position="top">
        <el-form-item label="跟踪对象：">
          {{ currentRow['injureName'] }}
        </el-form-item>
        <el-form-item label="跟踪说明">
          <el-input
            v-model="followExplain"
            type="textarea"
            placeholder="请输入跟踪说明"
            :row="6"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="primary" @click="addFollow()">保存</el-button>
        </div>
      </template>
    </el-Dialog>
  </div>
</template>

<script lang="ts" setup>
import { Edit, Delete } from '@element-plus/icons-vue';
import { surveySaveOrUpdate } from '@/api/overall-business/survey'
import { getSelectOption } from '@/api/common'
import { ElMessage } from 'element-plus';
import { isNotNull } from '@/utils/validate';
import { hideLoading, showLoading } from '@/utils/loading';
import dayjs from 'dayjs';
import { currencySubtractString } from '@/utils/currency';

const props = defineProps({
  // 详情接口返回的数据
  data: {
    type: Object,
    default: {}
  },
  // 接口参数结构
  body: {
    type: Object
  },
  // 禁用状态
  isDisabled: {
    type: Boolean,
    default: false
  },
  // 环节
  segment: {
    type:String,
    default: "survey"
  }
})

// 父组件函数
const emits = defineEmits(['openDialog', 'update'])

// 父组件更新所有数据
function updateParent() {
  emits('update')
}

watch(() => props.data, (newValue, oldValue) => {
  initTableData()
})

watch(() => props.body, (newValue, oldValue) => {
  // dialogData.value.surveyCarDamageRo.surveyBaseRo = newValue.surveyCarDamageRo.surveyBaseRo
  // console.log(newValue)
})

onMounted(() => {
  initTableData()
  getSelectOption(['LP_INJURE_NATURE']).then(({ data }) => {
    peopleTable.value.injureNature.options = data['LP_INJURE_NATURE']
  })
})


// 人伤相关数据key值
const dialogkeyList = ['injureBase', 'surveyInjureVisitRo', 'injureNursingList',
  'injureDisabilityList', 'injureHotelList', 'injureMedicalList', 'injureAlimonyList', 'injureCalculationList']

// 人伤信息
const peopleData = ref([])
// 人伤表格
const peopleTable = ref({
  injureNature: {title: '伤者性质', content: "", type: 'cascader', options: []},
  injureName: {title: '伤者姓名', content: "", type: 'input'},
})

// 初始化表格数据
function initTableData() {
  let res = []
  let list = []
  if (props.segment == 'survey') {
    list = props.data?.surveyInjureVo?.injureBaseVoList
    peopleTable.value['medicalTotalAmount'] = {title: '医疗项目预估金额合计', content: "", type: 'input'}; // 医疗项目预估金额合计
    peopleTable.value['deathTotalAmount'] = {title: '死亡伤残预估金额合计', content: "", type: 'input'};// 死亡伤残预估金额合计
    peopleTable.value['estimatedTotalAmount'] = {title: '预估金额总计', content: "", type: 'input'}; // 预估金额总计
  } else if (props.segment == 'exam') {
    list = props.data?.examInjureVo?.injureBaseVoList
    peopleTable.value['estimatedTotalAmount'] = {title: '预估金额总计', content: "", type: 'input'}; // 预估金额总计
    peopleTable.value['claimTotalAmount'] = {title: '索赔金额总计', content: "", type: 'input'}; // 索赔金额总计
    peopleTable.value['examTotalAmount'] = {title: '核损金额总计', content: "", type: 'input'}; // 核损金额总计
  }
  if (list?.length > 0) {
    list.forEach(item => {
      let data = { ...item }
      res.push({ ...item.injureBase , data })
    })
  }
  peopleData.value = res
}

// 删除人伤
function deletePeople(row) {
  ElMessageBox.confirm(
    '确认删除该伤者信息？',
    '提示',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
    }
  ).then(() => {
    let params = props.body
    params.updateType = 17
    dialogkeyList.forEach(key => {
      if (row.data[key]) params.surveyInjureRo[key] = row.data[key]
    })
    params.surveyInjureRo.surveyInjure.estimatedTotal = currencySubtractString(
      params.surveyInjureRo.surveyInjure.estimatedTotal || '0',
      row.data?.injureBase?.estimatedTotalAmount || '0')
    surveySaveOrUpdate(params).then(({}) => {
      ElMessage.success('删除成功')
      updateParent()
    })
  })
}

// 表格数据填充
function getContent(item, value) {
  if (item.type == 'select') {
    return item.options?.find(item => item.dictValue == value)?.dictName
  } else if (item.type == 'cascader') {
    // 伤者性质回显
    for (let i = 0; item.options && i < item.options.length; i++) {
      if (item.options[i].dictList && item.options[i].dictList.length > 0) {
        let optionValue = item.options[i].dictList.find(dict => dict.dictValue == value)
        if (optionValue) {
          return item.options[i].dictName + '/' + optionValue.dictName
        }
      }
    }
  }
  return value || '---';
}

//——————————————————————————————————————人伤跟踪相关——————————————————————————————————
// 弹窗表单
const injureSet = ref({
  setNo: '',
  setDate: '',
  setDay: '',
  setId: '',
  injureId: ''
})

let currentRow = ref({
  injureId: ''
})

// 点击展开不同的跟踪设置窗口
// todo: 注意： 如作业人员已经进行了1次跟踪，或已经到达/超过设置的跟踪时间，则不可以取消跟踪
function setFollow(type, row) {
  // 0: 跟踪设置, 1: 跟踪， 2：修改跟踪设置
  if (type === 0 || type === 2) {
    injureSet.value = {
      setNo: row.data?.injureSet?.setNo || '',
      setDate: row.data?.injureSet?.setDate || '',
      setDay: row.data?.injureSet?.setDay || '',
      setId: row.data?.injureSet?.setId || '',
      injureId: row.injureId
    }
    currentRow.value = row;
    showSetFollow.value = true
  } else if (type === 1) {
    currentRow.value = row;
    // 跟踪
    showFollow.value = true
  }
}

// 跟踪设置提交
function setSubmit() {
    showLoading()
    // 提交跟踪信息
    let params = props.body
    params.updateType = 11
    params.surveyInjureRo.injureSet = injureSet.value
    surveySaveOrUpdate(params).then(() => {
      currentRow.value['data']['injureSet'] = injureSet.value
      updateParent()
      ElMessage.success('设置成功')
      closeSetFollow()
      hideLoading()
    })
}

// 跟踪设置弹窗
const showSetFollow = ref(false)
function closeSetFollow() {
  injureSet.value = {
    setNo: '',
    setDate: '',
    setDay: '',
    setId: '',
    injureId: ''
  }
  showSetFollow.value = false;
  currentRow.value = {
    injureId: ''
  }
}

// 人伤跟踪弹窗
const showFollow = ref(false)
function closeFollow() {
  followExplain.value = ''
  currentRow.value = {
    injureId: ''
  }
  showFollow.value = false;
}
// 保存跟踪信息
function addFollow() {
  showLoading()
  // 提交跟踪信息
  let params = props.body
  params.updateType = 16
  params.surveyInjureRo.injureFollow = {
    followTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    followExplain: followExplain.value,
    injureId: currentRow.value.injureId,
    surveyId: params.surveyInjureRo.surveyId
  }
  surveySaveOrUpdate(params).then(() => {
    updateParent()
    ElMessage.success('保存成功')
    hideLoading()
    closeFollow()
  })
}
// 跟踪说明
const followExplain = ref('')

//——————————————————————————————————————end——————————————————————————————————————————


//————————————————————————————————————————————弹窗——————————————————————————————————
// 人伤
const peopleDialogRef = ref()
// 数据
const dialogData = ref(props.body)

// 新增人伤
function addNature() {
  emits('openDialog')
  peopleDialogRef.value.open(null, false,
    {estimatedTotal: props.data?.surveyInjureVo?.surveyInjure?.estimatedTotal})
}

// 编辑人伤
function editPeople(row) {
  dialogkeyList.forEach(key => {
    if (row.data[key]) {
      dialogData.value.surveyInjureRo[key] = row.data[key]
      if (props.segment === 'exam') {
        dialogData.value.examInjureRo[key] = row.data[key]
      }
    }
  })
  emits('openDialog')
  let estimatedTotal = props.segment === 'exam' ? 
    props.data?.examInjureVo?.surveyInjure?.estimatedTotal
    : props.data?.surveyInjureVo?.surveyInjure?.estimatedTotal
  peopleDialogRef.value.open(dialogData.value, props.isDisabled, 
    {
      estimatedTotal,
      claimTotal: props.data?.examInjureVo?.surveyInjure?.claimTotal,
      examTotal: props.data?.examInjureVo?.surveyInjure?.examTotal,
    }
    )
}

</script>

<style lang="scss" scoped>

</style>
