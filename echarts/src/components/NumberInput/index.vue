<template>
  <el-input
    :disabled="isDisabled"
    v-model="value"
    type="number"
    :formatter="(value) => formatter(value)"
    :parser="(value) => value"
    :max="max"
    :min="min"
    @blur="inputBlur"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Number
  },
  // 禁用
  isDisabled: {
    type: Boolean,
    default: false
  },
  // 最大值
  max: {
    type: Number
  },
  // 最小值
  min: {
    type: Number
  }
})

const value = ref(props.modelValue)

const emits = defineEmits(['update:modelValue', 'inputtext'])

// 监听v-model值
watch(() => props.modelValue, (newValue, oldValue) => {
  value.value = newValue
});

// 退保成本占比控制不能为负数不能大于100
function formatter(value) {
  let res = value
  // 输入两位数字的情况
  if ((props.min > 9 && value > 9) || (props.min < 10)) {
    if (value < props.min) {
      res = props.min
    } else if (value > props.max) {
      res = props.max
    }
    // 返回给父组件
    emits('update:modelValue', res)
  }
  return res
}

function inputBlur() {
  if (value.value < props.min) {
    value.value = props.min
    // 返回给父组件
    emits('update:modelValue', value.value)
  } else if (value.value > props.max) {
    value.value = props.max
    // 返回给父组件
    emits('update:modelValue', value.value)
  }
  emits('inputtext')
}

</script>

<style lang="scss" scoped>
:deep(input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
}
:deep(input[type="number"]){
  -moz-appearance: textfield;
}
</style>
