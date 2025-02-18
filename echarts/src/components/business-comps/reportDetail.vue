<template>
  <div>
    <el-tabs v-model="tabIndex" class="report-detail-tabs">
      <el-tab-pane label="统筹单" name="0"><TcDetail :data="data"/></el-tab-pane>
      <el-tab-pane label="批改记录" name="1"><TcDetailCorrect :data="data"/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})

const information = ref()

const tabIndex = ref('0')


</script>

<style lang="scss" scoped>
.report-detail-tabs{
  :deep(.el-tabs__header) {
    margin: 0;
    padding: 0;
  }
  :deep(.el-tabs__nav-scroll) {
    background-color: white;
    padding: 0 10px;
    font-size: 16px;
    .el-tabs__active-bar {
      left: 10px;
    }
  }
}
</style>
