<template>
  <Collapse>
    <template #title><h1>基本信息</h1></template>
    <Detail ref="detail" :data="dataList"/>
    <!-- <Form :data="dataList" :span="8"/> -->
  </Collapse>
</template>

<script lang="ts" setup>

const props = defineProps({
  data: {
    type: Object
  }
})

// 表单配置
const dataList = ref({
  tcNo: {title: '统筹单号', content: "", type: 'input'}, // 统筹单号
  insuredName: {title: '被统筹人名称', content: "", type: 'input'}, // 被统筹人名称
  carNumber: {title: '车牌号码', content: "", type: 'input'}, // 车牌号码
  insuranceStartTime: {title: '统筹起期', content: "", type: 'date'}, // 统筹起期
  insuranceEndTime: {title: '统筹止期', content: "", type: 'date'}, // 统筹止期
  tcItemList: {title: '保障项目', content: "", type: 'tcItem'}, // 保障项目
})

watch(() => props.data, (newValue, oldValue) => {
	for (let key in dataList.value) {
    if (newValue[key]) {
      // 保障项目单独处理
      if (key == 'tcItemBeanList') {
        if (newValue[key].length > 0) {
          let str = ''
          newValue[key].forEach(item => {
            str += item.tcItemName + '/'
          });
          dataList.value[key].content = str
        }
      } else {
        dataList.value[key].content = newValue[key]
      }
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
