<template>
  <div>
    <Collapse>
      <template #title><h1>人伤跟踪信息</h1></template>
      <el-table :data="peopleData" style="width: 100%; margin-bottom: 20px;" border
        :header-cell-style="{ background: '#EBEEF5', color: '#909399', height: '48px' }">
        <el-table-column type="index" width="60px" label="序号"/>
        <el-table-column v-for="(item, key) in peopleTable" :label="item.title" :prop="key"/>
      </el-table>
    </Collapse>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})

onMounted(() => {

})

watch(() => props.data, (newValue, oldValue) => {
  peopleData.value = newValue?.surveyInjureVo?.injureFollowList || []
})

// 人伤跟踪信息
const peopleData = ref([])
// 人伤跟踪表格
const peopleTable = {
  followTime: {title: '跟踪时间', content: "", type: 'input'},
  followExplain: {title: '跟踪说明', content: "", type: 'input'},
  injureName: {title: '跟踪对象姓名', content: "", type: 'input'}, // 医疗项目预估金额合计
}

</script>

<style lang="scss" scoped>
</style>
