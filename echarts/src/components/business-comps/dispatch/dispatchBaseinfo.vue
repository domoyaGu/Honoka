<template>
  <div>
    <Collapse>
      <template #title><h1>基本信息</h1></template>
      <Detail ref="detail" :data="dataList"/>
    </Collapse>
    <!-- 改派标识 -->
    <Collapse v-if="dispatchDataList.isDispatch.content">
      <template #title><h1>改派/改修标识</h1></template>
      <div>
        <Detail :data="dispatchDataList"/>
        <div style="padding-bottom: 10px;font-size: 15px;">改派任务类型</div>
        <el-row>
          <el-card class="dispatch-type">
            <p class="dispatch-type-title">车物任务</p>
            <p class="dispatch-type-content" style="padding-bottom: 18px;">申请机构：{{ data.taskCarCompany }}</p>
            <p class="dispatch-type-content">申请人用户：{{ data.taskCarApplyUser }}</p>
            <svg-icon icon-class="dispatch_car"/>
          </el-card>
          <el-card class="dispatch-type">
            <p class="dispatch-type-title">人伤任务</p>
            <p class="dispatch-type-content" style="padding-bottom: 18px;">申请机构：{{ data.taskInjuryCompany }}</p>
            <p class="dispatch-type-content">申请人用户：{{ data.taskInjuryApplyUser }}</p>
            <svg-icon icon-class="dispatch_prople"/>
          </el-card>
        </el-row>
      </div>
    </Collapse>
  </div>
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
  baAccidentPlace: {title: '出险地点', content: "", type: 'city'},
  baAccidentInfoPlace: {title: '出险详细地点', content: "", type: 'input', textType: 'textarea', row: 1, span: 12},
  baIsOffsite: {title: '是否异地', content: "", type: 'radio', options: 'isOrNot'},
  baCommitCompanyName: {title: '案件处理机构', content: "", type: 'select', disabled: true}
})

// 改派详情配置
const dispatchDataList = ref({
  isDispatch: {title: '是否改派', content: "", type: 'radio', options: 'isOrNot'},
  isReportEdit: {title: '是否报案修改', content: "", type: 'radio', options: 'isOrNot'},
})

watch(() => props.data, (newValue, oldValue) => {
	setInfo()
});

function setInfo() {
  for (let key in dataList.value) {
    if (props.data[key] || props.data[key] == 0) {
      dataList.value[key].content = props.data[key]
    }
  }
  for (let key in dispatchDataList.value) {
    if (props.data[key] || props.data[key] == 0) {
      dispatchDataList.value[key].content = props.data[key]
    }
  }
}

onMounted(() => {
  if (props.data) {
    setInfo()
  }
})
</script>

<style lang="scss" scoped>
.dispatch-type {
  width: 300px;
  position: relative;
  font-size: 14px;
  margin-right: 50px;
  .dispatch-type-title {
    color: #2A63F6;
    font-weight: bold;
    padding-bottom: 12px;
  }
  .svg-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 80px;
    height: 80px;
  }
}

</style>
