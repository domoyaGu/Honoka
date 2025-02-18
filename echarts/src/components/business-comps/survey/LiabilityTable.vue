<template>
  <div>
    <Detail v-if="isDetail" :data="dataList"/>
    <Form v-else ref="form" :data="dataList" :span="8"/>
  </div>
</template>
<script setup lang="ts">
import merge from "ts-deepmerge"

const props = defineProps({
  data: {
    type: Object
  },
  isDetail: {
    type: Boolean,
    default: false
  }
})
  // 表单配置
const dataList = ref({
  examAccidentLiabilityType: {title: '事故责任', content: {}, type: 'duty', span: 24,
                            checkckAccidentLiabilityType: (rule, value, callback) => {
                              if (value.content && Object.keys(value.content).length === 0) {
                                callback('请选择事故责任')
                              } else {
                                callback()
                              }
                            }}
})

watch(props.data, (newValue, oldValue) => {
  // 深拷贝整合信息
  let ckAllinfo = ref({})
  ckAllinfo.value = merge({}, newValue)
  let baseObj = ckAllinfo.value['surveyCarDamageRo']['examVehicleVo']
  // 数据匹配都参照newReport
	for (let key in dataList.value) {
    if (key == 'examAccidentLiabilityType') {
      // 事故责任
      dataList.value[key].content = {
        examAccidentLiabilityType: baseObj['examAccidentLiabilityType'] ,
        examAccidentLiability: baseObj['examAccidentLiability']
      }
    }
  }
}, {deep: true});

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