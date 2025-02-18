<template>
  <div class="survey-loss-container">
    <div class="survey-loss-title">
      <svg-icon icon-class="surveyloss" color="#2A63F6"/>
      <span style="font-weight: bold; margin-left: 10px;">{{ title }}</span>
      <slot name="titleSuffix"/>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  // 标题
  title: {
    type: String,
    default: ""
  },
  // 
})

</script>

<style lang="scss" scoped>
.survey-loss-container {
  font-size: 15px;
  .survey-loss-title {
    color: #2A63F6;
    display: flex;
    align-items: center;
    background-color: #F0F0F0;
    height: 48px;
    padding: 0 15px;
    margin-bottom: 10px;
  }
}
</style>
