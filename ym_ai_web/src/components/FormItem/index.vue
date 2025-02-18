<template>
  <div class="form_item_container display-flex-center" :style="{width: width, border: border ? '1px solid #dcdee0' : 'none'}">
    <div class="item_prop">{{ data.label }}{{ isColon ? '：' : '' }}</div>
    <div class="item_container">
      <el-select
        v-if="data.type == 'select'"
        :suffix-icon="CaretBottom"
        clearable
      >
        <el-option
          v-for="item in data.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-else
        v-model="value"
        placeholder="请输入"
        clearable
      ></el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CaretBottom } from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: {},
  data: {
    type: Object,
    default: () => {}
  },
  width: {
    default: '100%'
  },
  // 是否要边框
  border: {
    type: Boolean,
    default: true
  },
  // 是否要冒号
  isColon: {
    type: Boolean,
    default: true
  }
});

// 更新绑定的modelvalue
const emits = defineEmits(['update:modelValue']);

// 值
const value = ref(props.modelValue as string);

// value更改更新外部modelvalue
watch(
  () => value.value,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      emits('update:modelValue', newVal);
    }
  }
);

// modelvalue监听
watch(
  () => props.modelValue,
  newVal => {
    value.value = newVal as string;
  }
);
</script>

<style lang="scss" scoped>
.form_item_container {
  width: 292px;
  border: 1px solid #dcdee0;
  border-radius: 3px;
  height: 38px;
  padding-left: 10px;
  padding-right: 5px;
  .item_prop {
    line-height: 38px;
    min-width: fit-content;
  }
  .item_container {
    flex-grow: 1;
  }
}
// 去边框
:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: none !important;
  padding-right: 0;
}

:deep(.el-select:hover:not(.el-select--disabled) .el-input__wrapper) {
  box-shadow: none !important;
  border: none !important;
}
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: none !important;
  border: none !important;
}

:depp(.el-input el-input--suffix .is-focus) {
  box-shadow: none !important;
  border: none !important;
}

:deep(.el-input__inner) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.el-select) {
  width: 100%;
}
</style>
