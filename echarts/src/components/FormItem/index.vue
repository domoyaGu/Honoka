<!-- 单独的表单项组件，方便多个小表单使用 -->
<template>
  <el-col v-show="!item.isHide" :lg="{ span: item.span || span }" :md="{ span: item.span || 12 }" :sm="{ span: item.span || 24 }" :style="'--colWidth:' + width">
    <el-form-item
      :label="item.title"
      :prop="key"
      :disabled="item.disabled || isDisabled"
    >
      <el-input
        v-if="item.type == 'input'"
        v-model="m_value"
        @input="changeValue"
        :placeholder="item.disabled ? '' : '请输入'"
        :rows="item.row"
        :type="item.textType || 'text'"
        :disabled="item.disabled || isDisabled"
        clearable
      />
      <CurrencyInput
        v-else-if="item.type == 'currency'"
        :default-value="m_value"
        @inputtext="changeValue"
        :disabled="item.disabled || isDisabled"
        type="text"
        :placeholder="item.disabled ? '' : '请输入'"
        clearable
        is-negative
        :is-watch="isWatch"
      />
      <el-date-picker
        v-else-if="item.type == 'date'"
        v-model="m_value"
        :disabled="item.disabled || isDisabled"
        :value-format="item.format || 'YYYY-MM-DD HH:mm:ss'"
        :type="item.dateType || 'date'"
        :disabledDate="item.disabledDate"
        :unlink-panels="true"
        :placeholder="item.disabled ? ' ' : '请选择'"
        @change="changeValue"
      />
      <el-cascader
        v-else-if="item.type == 'cascader'"
        v-model="cascader_value"
        :options="item.options"
        :disabled="item.disabled || isDisabled"
        :props="{
          value: 'dictValue',
          children: 'dictList',
          label: 'dictName'
        }"
        @change="changeValue"
      />
      <el-select
        v-else-if="item.type == 'select'"
        :disabled="item.disabled || isDisabled"
        clearable
        v-model="m_value"
        @change="changeValue"
        :placeholder="item.disabled ? ' ' : '请选择'">
        <el-option
          v-for="(option, index) in item.options"
          :value="option.dictValue"
          :label="option.dictName"
          :key="index"
        />
      </el-select>
      <!-- 自定义组件 -->
      <div v-else>
        <slot name="other"></slot>
      </div>
    </el-form-item>
  </el-col>
</template>

<script lang="ts" setup>
const props = defineProps({
  // 配置项
  item: {
    type: Object,
    default: {}
  },
  // key值
  key: {
    type: String,
    default: ''
  },
  // 间隔
  span: {
    type: Number,
    default: 8
  },
  // 输入框、选择框宽度固定
  width: {
    type: String,
    default: '286px'
  },
  // 绑定的父组件对象
  modelValue: {
    type: [String, Number],
    default: ''
  },
  // 是否监听数据(仅currency可用)
  isWatch: {
    type: Boolean,
    default: true
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
})

const m_value = ref(props.modelValue)
const cascader_value = ref()

// 监听v-model值
watch(() => props.modelValue, (newValue, oldValue) => {
  if (props.item.type == 'cascader') {
    if (newValue && typeof(newValue) == 'string') {
      let options = props.item.options
      for (let i = 0; options && i < options.length; i++) {
        if (options[i].dictList && options[i].dictList.length > 0) {
          let optionValue = options[i].dictList.find(dict => dict.dictValue == newValue)
          if (optionValue) {
            cascader_value.value = [options[i].dictValue, optionValue?.dictValue]
            break;
          }
        }
      }
    } else {
      cascader_value.value = props.modelValue
    }
  } else {
    m_value.value = props.modelValue
  }
},{ immediate: true });

// 更新父组件数据
const emits = defineEmits(['update:modelValue'])

function changeValue(value) {
  if (props.item.type == 'cascader') {
    emits('update:modelValue', value)
  } else {
    emits('update:modelValue', value)
  }
}

</script>

<style lang="scss" scoped>

.el-input,
.el-select {
  width: var(--colWidth);
}
:deep(.el-input__wrapper) {
  width: var(--colWidth);
}
:deep(.el-input__wrapper) {
  width: var(--colWidth);
}
</style>
