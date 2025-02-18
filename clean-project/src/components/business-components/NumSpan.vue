<template>
  <div :class="'num-span-container ' +  (noBorder ? '' : 'num-span-border ') +  (noPaddingLeft ? '' : 'num-span-padding')">
    <div class="title">{{ title }}</div>
    <div class="number">{{ number || number === 0 ? number + unit : '--' }}</div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  // 右边框
  noBorder: {
    type: Boolean,
    default: false
  },
  // 左padding样式
  noPaddingLeft: {
    type: Boolean,
    default: false
  },
  // 标题名称
  title: {
    type: String
  },
  // 数字
  number: {
    type: Number || String,
    default: ''
  },
  // 后置单位/符号
  unit: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.num-span-container {
  padding-right: 50px;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  align-items: center;
  .title {
    margin-bottom: 20px;
  }
  .number {
    font-weight: bold;
    font-size: 25px;
  }
}
.num-span-border {
  border-right: 1px solid #f2f2f2;
}
.num-span-padding {
  padding-left: 50px;
}
</style>
