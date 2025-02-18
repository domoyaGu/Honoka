<template>
  <el-popover
    placement="bottom"
    title=""
    trigger="click"
    :width="popWidth"
    @before-enter="visible = true"
    @before-leave="closePop"
  >
    <template #reference>
      
    </template>
    <div class="pop_content">
      
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { CaretBottom } from '@element-plus/icons-vue';

const props = defineProps({
  // 默认选中
  modelValue: {
    type: String,
    default: ''
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  //placeholder
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 下拉列表
  options: {
    type: Array,
    default: () => []
  }
});


</script>

<style lang="scss" scoped>

.pop_content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
