<template>
  <el-Dialog v-bind="$attrs" v-model="show" width="60%" @close="close">
    <template #header="{ close, titleId, titleClass }">
      <div>
        <span :id="titleId" :class="titleClass" style="font-weight: bold;">统筹单信息</span>
        <span :class="'title-tab ' + (tabIndex == 0 ? 'active' : '')" style="margin-left: 30px;" @click="() => { tabIndex = 0 }">统筹单</span>
        <span :class="'title-tab ' + (tabIndex == 1 ? 'active' : '')" @click="() => { tabIndex = 1 }">批改记录</span>
      </div>
    </template>
    <div>
      <div v-show="tabIndex == 0">
        <TcDetail :data="information"/>
      </div>
      <div v-show="tabIndex == 1">
        <TcDetailCorrect :data="information"/>
      </div>
    </div>
  </el-Dialog>
</template>

<script lang="ts" setup>
import { getTcInfo } from '@/api/common'

const information = ref()

const tabIndex = ref(0)

//————————————————————————————————弹窗相关——————————————————————————————————————
// 打开关闭状态
const show = ref(false)
const loading = ref(false)
function open(tcNo) {
  loading.value = true
  information.value = {}
  tabIndex.value = 0
  // 获取统筹单信息
  getTcInfo(tcNo).then(({ data }) => {
    // console.log(tcDetail)
    // tcDetail.value.setValue(data)
    information.value = data
    loading.value = false
    show.value = true
  })
}

function close() {
  show.value = false
}
//————————————————————————————————弹窗相关——————————————————————————————————————

defineExpose({
  open
})

</script>

<style lang="scss" scoped>
.title-tab {
  padding: 10px 16px;
  border: 0.5px #DCDFE6 solid;
  cursor: pointer;
}
.active {
  // font-weight: bold;
  border: 1px #409eff solid;
  color: #409eff
}
</style>
