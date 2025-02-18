<template>
  <Collapse>
    <template #title><h1>报案详情</h1></template>
    <Detail v-if="isDetail" :data="dataList"/>
    <Form v-else ref="form" :rules="rules" :data="dataList" :span="8" :allDisabled="data.baStatus == '2'"/>
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
  baReporterName: {title: '报案人姓名', content: "", type: 'input'},
  baReporterPhone: {title: '报案人电话', content: "", type: 'input'},
  baReporterType: {title: '报案人身份', content: "", type: 'select', options: []},
  baReporterTime: {title: '报案时间',
    content: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    disabledDate: (time) => {
      return time.getTime() > new Date().getTime()
    },
    type: 'date', dateType: 'datetime'},
  baAccidentTime: {title: '出险时间',
    content: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    disabledDate: (time) => {
      return time.getTime() > new Date().getTime()
    },
    type: 'date', dateType: 'datetime', span: 16},
  baDriverName: {title: '驾驶员姓名', content: "", type: 'input'},
  baDriverPhone: {title: '驾驶员电话', content: "", type: 'input'},
  baDriverType: {title: '驾驶员身份', content: "", type: 'select', options: []},
  baAccidentPlace: {title: '出险地点', content: "", type: 'city'},
  baAccidentInfoPlace: {title: '出险详细地点', content: "", type: 'input', textType: 'textarea', row: 1, span: 12},
  baIsOffsite: {title: '是否异地', content: "", type: 'radio', options: 'isOrNot'},
  baCommitCompanyName: {title: '案件处理机构', content: "", type: 'select', disabled: true},
  baAccidentReason: {title: '出险原因', content: "", type: 'select', options: []},
  baCarIsCanMove: {title: '车辆是否可移动', content: "", type: 'radio', options: 'isOrNot'},
  baReportToPolice: {title: '是否报交警', content: "", type: 'radio', options: 'isOrNot'},
  baIsAccidentScene: {title: '是否现场报案', content: "", type: 'radio', options: 'isOrNot'},
  baIsAccidentOnFreeway: {title: '是否高速公路出险', content: "", type: 'radio', options: 'isOrNot'},
  baAccidentLiabilityType: {title: '事故责任', content: {}, type: 'duty', options: [], span: 24},
  baAccidentDetail: {title: '出险经过', content: "", type: 'input', textType: 'textarea', row: 3, span: 14},
  baRemark: {title: '报案备注', content: "", type: 'input', textType: 'textarea', row: 3, span: 14}
})

// 校验
const rules = getRules()

function getRules() {
  let res = {}
  for(let key in dataList.value) {
    if (key != 'baAccidentLiabilityType' && key != 'baCommitCompanyName') {
      const ruleType = dataList.value[key].type == 'input' ? '请输入' : '请选择'
      res[key] = { required: true, message: ruleType + dataList.value[key].title }
    }
  }
  return res
}

watch(() => props.data, (newValue, oldValue) => {
	for (let key in dataList.value) {
    if (newValue[key] || newValue[key] == 0) {
      if (key == 'baAccidentLiabilityType') {
        // 事故责任
        dataList.value[key].content = {
          baAccidentLiabilityType: newValue[key],
          baAccidentLiability: newValue['baAccidentLiability']
        }
      } else {
        dataList.value[key].content = newValue[key]
      }
    }
  }
});

// 获取下拉
function getSelect() {
  getSelectOption(['LP_IDENTITY', 'LP_DANGER', 'LP_ACCIDENT_LIABILITY']).then(({ data }) => {
    dataList.value.baReporterType.options = data['LP_IDENTITY']
    dataList.value.baDriverType.options = data['LP_IDENTITY']
    dataList.value.baAccidentReason.options = data['LP_DANGER']
    dataList.value.baAccidentLiabilityType.options = data['LP_ACCIDENT_LIABILITY']
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
