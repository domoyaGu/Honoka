<template>
  <el-form-item v-bind="$attrs">
    <template #label>
      {{ labelName }}
      <el-icon v-if="isShowIcon" @click="changeIcon">
        <Edit style="color:cornflowerblue" v-show='isEdit'/>
        <Remove v-show='!isEdit'/>
      </el-icon>
    </template>
    <div style="display: inline-block; width: 85%;"><slot/></div>
    <el-icon v-if="isShowIcon" @click="resetValue">
      <RefreshLeft style="color:cornflowerblue" v-show='!isEdit'/>
    </el-icon>
  </el-form-item>
</template>

<script lang="ts" setup>
import { Edit, RefreshLeft, Remove } from '@element-plus/icons-vue'
const props = defineProps({
  defaultValue: {
    type: String,
    default: ""
  },
  labelName: {
    type: String,
    default: ""
  },
  isDiabled: {
    type: Boolean,
    default: false
  },
  isShowIcon: {
    type: Boolean,
    default: false
  }
})

let org_value = ""

// 监听
const unwatch = watch(() => props.defaultValue, (oldValue) => {
  // 处理业务逻辑
  org_value = oldValue
  // 是否实时监听]
  // 只监听一次, 取消监听
  unwatch();
});

const state = reactive({
  isEdit: props.isDiabled
})

const { isEdit } = toRefs(state)

const emit = defineEmits(['changeedit', 'reset'])

function changeIcon() {
  state.isEdit = !state.isEdit
  emit('changeedit', state.isEdit)
}

function resetValue() {
  emit('reset', org_value)
}
</script>

<style lang="scss" scoped>
.el-icon {
  cursor: pointer;
}
</style>
