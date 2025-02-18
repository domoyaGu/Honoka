<template>
  <el-dialog title="流程明细" v-bind="$attrs" v-model="show" @close="close" width="800">
    <div style="margin-bottom: 30px; color: black">赔案号： {{ claimNo }}</div>
    <div class="step-container">
      <el-steps v-loading="loading" v-if="steps.length > 0" direction="vertical" :active="steps.length - 1">
        <el-step v-for="(item, index) in steps">
          <template #title>
            {{ item.processNode }}
            <span class="status">{{ item.processStatus }}</span>
          </template>
          <template #icon>
            <svg-icon icon-class="stepdot"/>
          </template>
          <template #description>
            <div class="description-container">
              <p>{{ item.processUserName }}</p>
              <p>{{ item.commitData }}</p>
            </div>
          </template>
        </el-step>
      </el-steps>
      <div v-else>
        <div style="font-size: 16px; color: black;">当前单未开始流转，暂无流程明细</div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getProcessDetail } from '@/api/common'

const show = ref(false)
const loading = ref(false)
// 赔案号
let claimNo = ref("")
// 步骤条
const steps = ref([])

function open(no) {
  show.value = true
  if (claimNo.value != no) {
    loading.value = true
    claimNo.value = no;
    getProcessDetail(no).then(({ data }) => {
      steps.value =data
      loading.value = false
    })
  }
}

function close() {
  show.value = false
}

defineExpose({
  open
})

</script>

<style lang="scss" scoped>
.step-container {
  margin-left: 56px;
  .status {
    font-size: 14px;
  }
  .description-container {
    min-height: 60px;
    color: #606266;
  }
}
</style>
