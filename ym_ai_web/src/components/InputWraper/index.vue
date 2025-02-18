<template>
  <el-input
    v-if="data.type === 'input'"
    :disabled="isDisabled"
    :placeholder="data.placeholder ? data.placeholder : '请输入'"
    v-model="value"
    :validate-event="validateEvent"
    clearable
  >
    <template #suffix v-if="data.isPercent">%</template>
  </el-input>
  <el-select
    v-else-if="data.type === 'selectInput'"
    ref="selectInput"
    filterable
    :disabled="isDisabled"
    allow-create
    default-first-option
    :validate-event="validateEvent"
    v-model="value"
    :placeholder="data.placeholder ? data.placeholder : '请选择/输入'"
    clearable
    @visible-change="selectInputVisibleChange"
    @blur="selectInputBlur"
  >
    <el-option
      v-for="option in data.options"
      :key="option.codeValue"
      :label="option.codeName"
      :value="option.codeValue"
    >
    </el-option>
  </el-select>
  <el-select
    v-else-if="data.type === 'select'"
    :validate-event="validateEvent"
    :disabled="isDisabled"
    v-model="value"
    :teleported="data.teleported == undefined ? true : false"
    :filterable="data.filterable"
    :placeholder="data.placeholder ? data.placeholder : '请选择'"
    :clearable="!data.noClearable"
  >
    <el-option
      v-for="option in data.options"
      :key="option.codeValue"
      :label="option.codeName"
      :value="option.codeValue"
    >
    </el-option>
  </el-select>
  <!-- 多选 -->
  <el-select
    v-else-if="data.type === 'multipleSelect'"
    v-model="value"
    multiple
    :collapse-tags="data.collapseTags"
    :collapse-tags-tooltip="data.collapseTagsTooltip"
    :disabled="isDisabled"
    :placeholder="data.placeholder ? data.placeholder : '请选择'"
    :clearable="!data.noClearable"
  >
    <el-option
      v-for="option in data.options"
      :key="option.codeValue"
      :label="option.codeName"
      :value="option.codeValue"
    >
    </el-option>
  </el-select>
  <check-select
    v-else-if="data.type === 'checkSelect'"
    v-model="value"
    :options="data.options"
    :is-disabled="isDisabled"
  >
  </check-select>
  <!-- 
    format="YYYY-MM-DD HH:mm:ss" 显示格式
    value-format="YYYY-MM-DD HH:mm:ss" 值格式
  -->
  <el-date-picker
    v-if="data.type === 'datetimerange'"
    v-model="value"
    :disabled="isDisabled"
    format="YYYY-MM-DD HH:mm:ss"
    value-format="YYYY-MM-DD HH:mm:ss"
    type="datetimerange"
    range-separator="-"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    unlink-panels
  />
  <el-cascader
    v-model="value"
    v-if="data.type === 'cascaderMultiple'"
    :placeholder="data.placeholder ? data.placeholder : '请选择'"
    :options="data.options"
    :props="data.props"
    :disabled="isDisabled"
    collapse-tags
    collapse-tags-tooltip
    filterable
  />
  <el-switch
    v-if="data.type === 'switch'"
    v-model="value"
    :active-value="1"
    :disabled="isDisabled"
    :inactive-value="0"
  />
</template>
<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  form: {
    // 值对象
    type: Object,
    default: () => ({})
  },
  propName: {
    type: String,
    default: ''
  },
  validateEvent: {
    // 是否自动出发校验
    type: Boolean,
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['updateForm']);

let value = computed({
  // 组件双向绑定
  get: () => {
    return props.form[props.propName];
  },
  set: val => {
    const paramObj = {
      propName: props.propName, // 字段名
      value: val // 字段值
    };
    emits('updateForm', paramObj);
  }
});

//--------------------------------------选择输入框可持续编辑------------------------------------------
let selectInputTempValue = null;
const selectInput = ref();
function selectInputVisibleChange(val) {
  let isOwn = props.data.options.some(item => {
    return item.codeValue === value.value;
  });
  if (val && !isOwn) {
    selectInputTempValue = value.value;
    value.value = '';
    nextTick(() => {
      value.value = selectInputTempValue;
    });
  } else if (!val) {
    selectInputTempValue = null;
  }
}
function selectInputBlur() {
  value.value = selectInput.value.selectedLabel;
}
//--------------------------------------end------------------------------------------

// /**
//  * 更改级联下拉（当有全部选项时选中全部一级菜单）
//  */
// function changeCascader(val) {
//   if (val && value[val.length - 1] == 'ALL') {
//     let newVal = []
//     props.data.options.forEach(item => {
//       newVal.push(item.value)
//     })
//     value.value = newVal
//   }
// }
</script>
<style lang="scss" scoped>
// 样式穿透
.el-input,
.el-select {
  width: 100%;
}
:deep(.el-input__wrapper) {
  width: 100%;
}
</style>
