<template>
  <el-popover
    placement="bottom"
    title=""
    trigger="click"
    :width="popWidth"
    @before-enter="visible = true"
    @before-leave="closePop"
  >
    <template #reference>
      <div
        id="selectContainer"
        class="select-container"
        :style="'border-color: ' + (visible ? '#409eff' : '#dcdfe6')"
        @click="visible = !visible"
      >
        <span
          style="margin: 6px; color: #dcdfe6"
          v-show="checkedValues.length == 0"
          >{{ placeholder }}</span
        >
        <div
          v-for="(item, index) in tags"
          class="tag-container"
          v-show="index < 4"
          :key="index"
        >
          <span style="margin-right: 6px">{{ item?.codeName }}</span>
          <span
            class="tag-icon"
            v-show="!isDisabled"
            @click.stop="delVal(item, index)"
            ><el-icon><Close /></el-icon
          ></span>
        </div>
        <div class="tag-container" v-show="tags.length > 4">
          <span> +{{ tags.length - 4 }} </span>
        </div>
        <span
          class="arrow-icon"
          :style="'transform: rotate(' + (visible ? 180 : 0) + 'deg);'"
          ><el-icon><ArrowDown /></el-icon
        ></span>
      </div>
    </template>
    <div class="pop-content">
      <el-checkbox
        v-model="checkAll"
        :disabled="isDisabled"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
        >全部</el-checkbox
      >
      <el-checkbox-group
        v-model="checkedValues"
        :disabled="isDisabled"
        @change="handlecheckedValuesChange"
        style="display: flex; flex-direction: column"
      >
        <el-checkbox
          v-for="item in options"
          :key="item.codeValue"
          :label="item.codeValue"
        >
          {{ item.codeName }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { ArrowDown, Close } from '@element-plus/icons-vue';
import { nextTick, ref } from 'vue';

const props = defineProps({
  // 默认选中
  modelValue: {
    type: String,
    default: 'ALL'
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  //placeholder
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 下拉列表
  options: {
    type: Array,
    default: () => []
  }
});
// map存储方便取
const optionsMap = {};

// 打开下拉
const visible = ref(false);
// 宽度自适应
const popWidth = ref('');
// 当前下拉所在位置

onMounted(() => {
  nextTick(() => {
    const dom = document.getElementById('selectContainer');
    popWidth.value = (dom?.offsetWidth || 200) + 'px';
    // 默认全选
    checkAll.value = true;
    handleCheckAllChange(true);
    closePop();
  });
});

const checkAll = ref(false);
const isIndeterminate = ref(false);
const checkedValues = ref([]);
const allValues = ref([]);
// 展示在框中的标签
const tags = ref([]);

watch(
  () => props.options,
  val => {
    if (val?.length > 0) {
      val.forEach(item => {
        allValues.value.push(item.codeValue);
        optionsMap[item.codeValue] = item;
      });
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.modelValue,
  val => {
    if (val) {
      if (val == 'ALL') {
        // 全选
        checkAll.value = true;
        handleCheckAllChange(true);
      } else {
        checkedValues.value = val.split(',');
        handlecheckedValuesChange(checkedValues.value);
      }
    }
  }
);

// 全选变更
const handleCheckAllChange = (val: boolean) => {
  checkedValues.value = val ? allValues.value : [];
  isIndeterminate.value = false;
  // 展示再框中的标签
  let tempTags = [];
  if (val) {
    tempTags.push({ codeName: '全部', codeValue: 'ALL' });
  }
  tags.value = tempTags;
};
// 勾选项变更
const handlecheckedValuesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === allValues.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allValues.value.length;
  // 展示再框中的标签
  let tempTags = [];
  if (checkAll.value) {
    tempTags.push({ codeName: '全部', codeValue: 'ALL' });
  } else {
    value.forEach(val => {
      tempTags.push(optionsMap[val]);
    });
  }
  tags.value = tempTags;
};

// 删除某个标签
function delVal(item, index) {
  // 全部的情况
  if (item.codeValue == 'ALL') {
    handleCheckAllChange(false);
    checkAll.value = false;
  } else {
    // 勾选数组变更
    checkedValues.value.splice(
      checkedValues.value.findIndex(val => val == item.codeValue),
      1
    );
    // 处理全选按钮
    const checkedCount = checkedValues.value.length;
    checkAll.value = checkedCount === allValues.value.length;
    isIndeterminate.value =
      checkedCount > 0 && checkedCount < allValues.value.length;
    // 标签删除
    tags.value.splice(index, 1);
  }
}

const emits = defineEmits(['update:modelValue']);

/**
 * 更改父组件变量
 */
function closePop() {
  if (!props.isDisabled) {
    let res = '';
    if (!checkAll.value) {
      checkedValues.value?.forEach((item, index) => {
        res += item;
        if (index < checkedValues.value.length - 1) res += ',';
      });
    }
    visible.value = false;
    emits('update:modelValue', checkAll.value ? 'ALL' : res);
  }
}
</script>

<style lang="scss" scoped>
.select-container {
  position: relative;
  width: 100%;
  height: 32px;
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1px #dcdfe6 solid;
  border-radius: 4px;
  overflow: hidden;
  .tag-container {
    min-width: fit-content;
    color: #909399;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    margin: 8px;
    background-color: #e9e9eb;
    height: 80%;
    padding: 3px;
    border-radius: 3px;
    .tag-icon {
      background-color: initial;
      color: #909399;
      height: 14px;
      width: 14px;
      display: flex;
      border-radius: 14px;
      justify-content: center;
      align-items: center;
      &:hover {
        background-color: #909399;
        color: white;
      }
    }
  }
  .arrow-icon {
    position: absolute;
    right: 10px;
    color: #909399;
    transition: 0.5s;
    height: 14px;
    width: 14px;
    display: flex;
  }
}
.pop-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
