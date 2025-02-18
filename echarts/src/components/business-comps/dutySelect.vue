<template>
  <div>
    <el-radio-group v-model="radioValue">
      <el-radio v-for="(item, index) in selectList" :key="index" :label="index" @change="changeRadio">
        {{ item.radioName }}
        <NumberInput
          v-model="item.value"
          :isDisabled="item.fixed"
          :min="item.min"
          :max="item.max"
          @inputtext="changeRadio"
          />
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Object
  },
  options: {
    type: Array,
    default: []
  }
})

onMounted(() => {
})

// 监听v-model值
watch(() => props.modelValue, (newValue, oldValue) => {
	if (newValue) {
    getDefaultValue()
	}
},
{immediate: true});

const emits = defineEmits(['update:modelValue'])

// 选项列表
const selectList = ref([
  { radioName: '全责', propName: 'LP_ACCIDENT_LIABILITY_5', fixed: true, value: 100, max: 100, min: 0 }, 
  { radioName: '主责', propName: 'LP_ACCIDENT_LIABILITY_4', fixed: false, value: 70, max: 99, min: 51}, 
  { radioName: '同责', propName: 'LP_ACCIDENT_LIABILITY_3', fixed: true, value: 50, max: 100, min: 0}, 
  { radioName: '次责', propName: 'LP_ACCIDENT_LIABILITY_2', fixed: false, value: 30, max: 49, min: 1}, 
  { radioName: '无责', propName: 'LP_ACCIDENT_LIABILITY_1', fixed: true, value: 0, max: 100, min: 0}, 
])

// 选中项
const radioValue = ref()

// 默认选中赋值
function getDefaultValue() {
  let res = 0
  const newValue = Number(props.modelValue?.radioValue)
  if (newValue) {
    if (newValue < 100 && newValue > 50) {
      res = 1
    } else if (newValue == 50) {
      res = 2
    } else if (newValue < 50 && newValue > 0) {
      res = 3
    } else if (newValue == 0) {
      res = 4
    }
    selectList.value[res].value = newValue
    radioValue.value = res
  }
  return res
}

// 切换选中后

function changeRadio() {
  emits('update:modelValue', {
    radioValue: selectList.value[radioValue.value].value,
    radioName: selectList.value[radioValue.value].propName
  })
}

</script>

<style lang="scss" scoped>
:deep(.el-input, .el-input__wrapper) {
  width: 80px !important;
}
</style>
