<template>
  <el-input
    v-bind="$attrs"
    v-model="text"
    :formatter="(value) => currencyFormat(value, isNegative)"
    :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
    @input="(val) => {emit('inputtext', val.replace(/\$\s?|(,*)/g, ''))}"
    @change="changeInput">
  </el-input>
</template>

<script lang="ts" setup>
  import { currencyFormat } from '@/utils/filter'

  const props = defineProps({
    defaultValue: {
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
  })
  
  const state = reactive({
    text: ""
  })

  const { text } = toRefs(state)

  const emit = defineEmits(['inputtext', 'changetext'])

  function changeInput (val) {
    emit('changetext', val.replace(/\$\s?|(,*)/g, ''))
  }

  // 监听
  const unwatch = watch(() => props.defaultValue, (newValue) => {
    // 处理业务逻辑
    state.text = currencyFormat(newValue, props.isNegative)
    // 是否实时监听
    if (!props.isWatch) {
      // 只监听一次, 取消监听
      unwatch();
    }
  });

</script>

<style lang="scss" scoped>

</style>
