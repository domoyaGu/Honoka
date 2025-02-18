<template>
  <el-select
    v-model="text"
    v-bind="$attrs"
    @change="
      val => {
        emit('changeoption', val.replace(/\$\s?|(,*)/g, ''));
      }
    "
  >
    <el-option
      v-for="item in optionList"
      :key="item[optionKey]"
      :label="currencyFormat(item[optionLabel], isNegative)"
      :value="currencyFormat(item[optionValue], isNegative)"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { currencyFormat } from '@/utils/filter';

const props = defineProps({
  // 默认选中
  defaultValue: {
    type: String,
    value: ''
  },
  // 下拉列表
  optionList: {
    type: Array,
    value: []
  },
  // 下拉列表key
  optionKey: {
    type: String,
    value: ''
  },
  // 下拉列表label
  optionLabel: {
    type: String,
    value: ''
  },
  // 下拉列表value
  optionValue: {
    type: String,
    value: ''
  },
  // 是否持续监听值变化
  isWatch: {
    type: Boolean,
    value: false
  },
  // 是否支持负数
  isNegative: {
    type: Boolean,
    value: false
  }
});

// const text = ref(props.defaultValue)
const state = reactive({
  text: ''
});

const { text } = toRefs(state);

const emit = defineEmits(['changeoption']);

// 监听
const unwatch = watch(
  () => props.defaultValue,
  newValue => {
    // 处理业务逻辑
    state.text = currencyFormat(newValue, props.isNegative);
    // 是否实时监听
    if (!props.isWatch) {
      // 只监听一次, 取消监听
      unwatch();
    }
  }
);
</script>

<style lang="scss" scoped></style>
