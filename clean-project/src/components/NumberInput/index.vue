<template>
  <el-input
    :disabled="isDisabled"
    v-model="text"
    :formatter="(value) => formatter(value)"
    :parser="(value) => value"
    :max="max"
    :min="min"
    @blur="inputBlur"
  >
  <template #append v-if="item.appendIcon">
    <el-button :icon="item.icon" v-if="item.icon"/>
    <span v-else>{{ item.appendIcon }}</span>
  </template>
  </el-input>
</template>

<script lang="ts" setup>
import { currencyFormat } from '@/utils/filter'
const props = defineProps({
  modelValue: {
    type: [Number, String]
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
  },
  item: {
    type: Object,
    default: () =>({})
  }
})

let text = ref(props.modelValue)

const emits = defineEmits(['update:modelValue'])

// 监听v-model值
watch(() => props.modelValue, (newValue, oldValue) => {
  text.value = newValue
});

// 退保成本占比控制不能为负数不能大于100
function formatter(val) {
  let res = val
  // 输入两位数字的情况
  if ((props.min > 9 && val > 9) || (props.min < 10)) {
    if (val < props.min) {
      res = props.min.toString()
    } else if (val > props.max) {
      res = props.max.toString()
    }
  }
  res = currencyFormat(res, props.item.setInfo)
  text.value = res
  // 返回给父组件
  return res
}

function inputBlur() {
  let res = currencyFormat(text.value, props.item.setInfo)
  text.value = res
  emits('update:modelValue', res)
}

</script>

<style lang="scss" scoped>
  :deep(input::-webkit-outer-spin-button) {
    -webkit-appearance: none !important;
  }
  :deep(input::-webkit-inner-spin-button) {
    -webkit-appearance: none !important;
  }
  :deep(input[type='number']) {
    -moz-appearance: textfield;
  }
</style>
