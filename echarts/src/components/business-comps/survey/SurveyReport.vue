<template>
  <Collapse>
    <template #title><h1>查勘详情</h1></template>
    <Detail v-if="isDetail" :data="dataList"/>
    <Form v-else ref="form" :data="dataList" :span="8" :allDisabled="data.baStatus == '2'"/>
  </Collapse>
</template>

<script lang="ts" setup>
import { getSelectOption } from '@/api/common';
import dayjs from 'dayjs';

const props = defineProps({
  data: {
    type: Object
  },
  isDetail: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// 表单配置
const dataList = ref({
  ckReporterName: {title: '报案人姓名', content: "", type: 'input'},
  ckReporterPhone: {title: '报案人电话', content: "", type: 'input',
                    checkckReporterPhone: (rule, value, callback) => {
                      if (!Number.isInteger(value) && value.length !== 11) {
                        callback('请输入正确的手机号')
                      } else {
                        callback()
                      }
                    }},
  ckReporterType: {title: '报案人身份', content: "", type: 'select', options: []},
  ckReporterTime: {title: '报案日期',
    content: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    disabledDate: (time) => {
      return time.getTime() > new Date().getTime()
    },
    type: 'date', dateType: 'datetime'},
  ckAccidentTime: {title: '出险时间',
    content: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    disabledDate: (time) => {
      return time.getTime() > new Date().getTime()
    },
    type: 'date', dateType: 'datetime'},
  ckContactsName: {title: '联系人姓名', content: "", type: 'input'},
  ckContactsPhone: {title: '联系人电话', content: "", type: 'input',
                    checkckContactsPhone: (rule, value, callback) => {
                      if (!Number.isInteger(value) && value.length !== 11) {
                        callback('请输入正确的手机号')
                      } else {
                        callback()
                      }
                    }},
  ckContactsType: {title: '联系人身份', content: "", type: 'select', options: []},
  ckDriverName: {title: '驾驶员姓名', content: "", type: 'input'},
  ckDriverPhone: {title: '驾驶员电话', content: "", type: 'input', span: 24,
                  checkckDriverPhone: (rule, value, callback) => {
                    if (!Number.isInteger(value) && value.length !== 11) {
                      callback('请输入正确的手机号')
                    } else {
                      callback()
                    }
                  }},
  ckLossPlace: {title: '损失发生地点', content: "", type: 'city'},
  ckLossInfoPlace: {title: '损失地详细地址', content: "", type: 'input', textType: 'textarea', row: 1, span: 13},
  ckAccidentHandleType: {title: '事故处理类型', content: "", type: 'select', options: []},
  ckAccidentCause: {title: '事故原因', content: "", type: 'select', options: []},
  ckAccidentType: {title: '事故类型', content: "", type: 'select', options: []},
  ckIsAccidentOnRoad: {title: '是否道路交通事故', content: "", type: 'radio', options: 'isOrNot'},
  ckAbsoluteQuota: {title: '绝对免赔额', content: "", type: 'input'},
  ckAbsoluteRate: {title: '绝对免赔率', content: "", type: 'input'},
  ckDeductibleReason: {title: '免赔原因', content: "", type: 'select', options: []},
  ckAccidentDeductibleRate: {title: '事故责任免赔率', content: "", type: 'input'},
  ckAccidentLiabilityType: {title: '事故责任', content: {}, type: 'duty', span: 24,
                            checkckAccidentLiabilityType: (rule, value, callback) => {
                              if (value.content && Object.keys(value.content).length === 0) {
                                callback('请选择事故责任')
                              } else {
                                callback()
                              }
                            }},
  ckAccidentDetail: {title: '事故经过', content: "", type: 'input', textType: 'textarea', row: 3, span: 14},
})

// 校验
const rules = getRules()

function getRules() {
  let res = {}
  for(let key in dataList.value) {
    if (key != 'ckDeductibleReason' && key !== 'ckAbsoluteRate'&&
        key != 'ckAbsoluteQuota' && key !== 'ckAccidentDeductibleRate') {
      const ruleType = dataList.value[key].type === 'input' ? '请输入' : '请选择'
      if (dataList.value[key][`check${key}`]) {
        res[key] = [{required: true, message: ruleType + dataList.value[key].title},
        {validator: dataList.value[key][`check${key}`], trigger: 'blur'}]
      } else {
        res[key] = [{required: true, message: ruleType + dataList.value[key].title}]
      }
    }
  }
  return res
}

// 处理由父组件传来的数据，进行字段匹配以及赋值
watch(props.data, (newValue, oldValue) => {
  // 深拷贝整合信息
  let ckAllinfo = ref({})
  ckAllinfo.value = JSON.parse(JSON.stringify(newValue))
  /**
   * newReport处理后的保安数据
   */
  let baseObj = ckAllinfo.value['surveyCarDamageRo']['surveyBaseRo']

  // 数据匹配都参照newReport
	for (let key in dataList.value) {
    if (baseObj[key] || baseObj[key] == 0) {
      if (key == 'ckAccidentLiabilityType') {
        // 事故责任
        dataList.value[key].content = {
          ckAccidentLiabilityType: baseObj['ckAccidentLiabilityType'] ,
          ckAccidentLiability: baseObj['ckAccidentLiability']
        }
      } else {
        dataList.value[key].content = baseObj[key]
      }
    }
  }
});

// 获取下拉
function getSelect() {
  getSelectOption(['LP_IDENTITY', 'LP_HANDLE_TYPE', 'LP_ACCIDENT_CAUSE', 'LP_ACCIDENT_TYPE', 'LP_DEDUCTIBLE_REASON']).then(({ data }) => {
    dataList.value.ckReporterType.options = data['LP_IDENTITY'] // 报案人身份
    dataList.value.ckContactsType.options = data['LP_IDENTITY'] // 联系人身份
    dataList.value.ckAccidentHandleType.options = data['LP_HANDLE_TYPE'] // 事故处理类型
    dataList.value.ckAccidentCause.options = data['LP_ACCIDENT_CAUSE'] // 事故原因
    dataList.value.ckAccidentType.options = data['LP_ACCIDENT_TYPE'] // 事故类型
    dataList.value.ckDeductibleReason.options = data['LP_DEDUCTIBLE_REASON'] // 免赔原因
  })
}

onMounted(() => {
  // 获取下拉
  getSelect()
})

const form = ref()
// 表单提交父组件
function getFormData(noValidate) {
	return noValidate ? new Promise((resolve, reject) => { resolve(form.value.formData) }) : form.value.validForm() 
}

defineExpose({
  getFormData
})

</script>

<style lang="scss" scoped>

</style>
