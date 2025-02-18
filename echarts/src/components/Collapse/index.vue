<template>
  <div>
    <div class="detail-card">
      <div class="title-one">
        <div class="border" />
        <slot name="title"></slot>
      </div>
      <!--   -->
      <div class="form-container" :style="'height: ' + (isOpen ? 'auto' : 0)">
        <div ref="content">
          <slot></slot>
        </div>
      </div>
      <div class="open-put">
        <div @click="changeOpen"> 
          <div :class="['symbol', isOpen ? '' : 'trans']">
            <el-icon><ArrowUp /></el-icon>
          </div>
          <span>{{ isOpen ? '收起' : '展开' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowUp } from '@element-plus/icons-vue';


// 展开收起
let isOpen = ref(true);
function changeOpen() {
  isOpen.value = !isOpen.value;
}

const content = ref()
// const contentHeight = ref(0)
onMounted(() => {
  nextTick(() => {
    
    // console.log(slots.default(0))
    // contentHeight.value = content.value?.offsetHeight + 50
    // if (contentHeight.value == 50) {
    //   // 避免 未渲染的情况自适应高度为0
    //   setTimeout(() => {
    //     contentHeight.value = content.value?.offsetHeight + 50
    //   }, 1000)
    // }
  })
})
</script>

<style lang="scss" scoped>

</style>
