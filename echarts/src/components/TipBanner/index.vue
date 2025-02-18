<template>
  <div class="tip-banner" :style="{backgroundColor: bgColor, color: fontColor}">
    <div class="tip_message">
      <slot name="tipPicture"></slot>
      <div class="tip_content" :style="{fontSize: fontSize + 'px'}">
        <slot name="tipContent"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  bgColor: {
    type: String,
    default: '#E3F1FF'
  },
  fontColor: {
    type: String,
    default: '#2A63F6'
  },
  fontSize: {
    type: String,
    default: '13'
  }
})
</script>

<style lang="scss" scoped>
.tip-banner {
  display: flex;
  align-items: center;
  border-radius: 4px;
  height: 32px;
  padding: 0 10px;
  margin-bottom: 12px;
}
.tip_message {
  display: flex;
  align-items: center;
}
.tip_content {
  margin-left: 6px;
}
</style>
