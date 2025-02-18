<template>
  <div>
    <div class="screen">
      <div class="title">
        <div class="filter-text">筛选</div>
      </div>
      <slot name="tips"></slot>
      <div :style="nopadding ? '' : 'padding: 0 56px 0 56px;'">
        <Form ref="form" :data="queryList" :span="formSpan" :width="formWidth"/>
        <div style="text-align: right;">
          <slot name="button"></slot>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button :icon="Search" type="primary" @click="handleQuery">搜索</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Refresh, Search} from '@element-plus/icons-vue';
const props = defineProps({
  queryList: {
    type: Object,
    default: {}
  },
  // 左右不需要间隔
  nopadding: {
    type: Boolean,
    default: false
  },
  // 表单间隔
  formSpan: {
    type: Number,
    default: 6
  },
  // 表单宽度
  formWidth: {
    type: String,
    default: '286px'
  }
})

watch(() => props.queryList, (newValue, oldValue) => {
  
}, { deep: true });

// 父组件函数
const emits = defineEmits(['resetQuery', 'handleQuery'])

// 表单ref
const form = ref()

// 搜索重置
function resetQuery() {
  form.value.resetForm()
  emits('resetQuery')
}

// 查询列表页
function handleQuery() {
  form.value.validForm().then((formData) => {
    formData.current = 1
    emits('handleQuery', formData)
  })
}

// 清空查询条件
function clear() {
  form.value.resetForm()
}

defineExpose({
  clear
})

</script>

<style lang="scss" scoped>

</style>
