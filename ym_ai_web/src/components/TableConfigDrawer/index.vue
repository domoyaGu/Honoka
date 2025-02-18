<template>
  <el-drawer v-model="show" :size="350" :with-header="false">
    <div>
      <div class="head-config-header">
        <span style="margin-left: 8px; margin-right: 10px">表格设置</span>
        <el-popover
          placement="bottom"
          trigger="hover"
          width="280px"
          popper-style="background: #E3F1FF; border: 1px #9ccfff solid"
        >
          <template #reference>
            <el-icon color="#409eff" style="cursor: pointer"
              ><InfoFilled
            /></el-icon>
          </template>
          <ul style="color: black">
            <li>“勾选"需要显示的表头；</li>
            <li>”锁定”表头不受左右滑动影响；</li>
            <li>”拖拽”调整表头展示顺序；</li>
            <li>”锁定”优先级大于展示顺序</li>
          </ul>
        </el-popover>
      </div>
      <div style="margin-top: 30px">
        <el-scrollbar max-height="700px">
          <div class="head-config-container">
            <div style="padding-left: 8px; height: 42px">
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
                >全部</el-checkbox
              >
            </div>
            <el-checkbox-group
              v-model="checkedValues"
              @change="handleCheckedCitiesChange"
            >
              <draggable
                :list="headData"
                ghost-class="ghost"
                chosen-class="chosenClass"
                animation="300"
                :move="onMove"
              >
                <template #item="{ element }">
                  <div class="item-row">
                    <el-checkbox
                      :label="element.prop"
                      :disabled="element.isDisabled"
                    >
                      {{ element.label }}
                    </el-checkbox>
                    <span>
                      <el-icon
                        :size="16"
                        :color="element.isLocked ? '#f43535' : ''"
                        @click="element.isLocked = !element.isLocked"
                        style="margin-right: 8px;"
                      >
                        <Unlock v-show="!element.isLocked"/>
                        <Lock v-show="element.isLocked" />
                      </el-icon>
                      <el-icon :size="16"><Rank /> </el-icon>
                    </span>
                  </div>
                </template>
              </draggable>
            </el-checkbox-group>
          </div>
        </el-scrollbar>
      </div>
      <div class="head-config-footer">
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { Unlock, Lock, Rank, InfoFilled } from '@element-plus/icons-vue';
import draggable from 'vuedraggable';

const props = defineProps({
  modelValue: {
    type: Object
  }
});

//——————————————————————————————————父子通信相关————————————————————————————————————————————
// 所有表头数据
const headData = ref([] as any[]);
// 更新外部v-model
const emits = defineEmits(['update:modelValue']);

function submit() {
  let res = [] as any[];
  let tempObj = JSON.parse(JSON.stringify(headData.value));
  // console.log(`output->`,checkedValues.value, tempObj)
  for (let i = 0; i < tempObj.length; i++) {
    if (checkedValues.value.find(item => tempObj[i].prop === item)) {
      res.push(tempObj[i]);
    }
  }
  if (res.length === 0) {
    ElMessage.error('表格必须显示一列数据');
    return;
  }
  // console.log(`output->res`,res)
  emits('update:modelValue', res);
  show.value = false;
}

// 展示隐藏
const show = ref(false);

defineExpose({
  show
});
//——————————————————————————————————————end——————————————————————————————————————————————————————

//——————————————————————————————————多选框列表相关——————————————————————————————————————————————
const checkAll = ref(true);
// 是否半选中
const isIndeterminate = ref(false);
// 所有选择key值
const checkValueArr = [] as string[];
// 选中的key值
const checkedValues = ref([] as string[]);

const handleCheckAllChange = (val: boolean) => {
  checkedValues.value = val ? checkValueArr : [];
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === checkValueArr.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < checkValueArr.length;
};

//——————————————————————————————————————end——————————————————————————————————————————————————————

//———————————————————————————————————拖拽相关——————————————————————————————————————————————
// //拖拽开始的事件
const onMove = (e, originalEvent) => {
  if (e.relatedContext.element.prop == 'configId') return false;
  if (e.draggedContext.element.prop == 'configId') return false;
  return true;
};

// //拖拽结束的事件
// const onEnd = () => {
//   console.log("结束拖拽");
// };
//——————————————————————————————————————end——————————————————————————————————————————————————————

//——————————————————————————————————生命周期————————————————————————————————————————————————
onBeforeMount(() => {
  // 拼装headData
  initHeadData();
});

// 初始化数据
function initHeadData() {
  for (let key in props.modelValue) {
    const tempObj = JSON.parse(JSON.stringify(props.modelValue[key]));
    headData.value.push({
      ...tempObj,
      isLocked: false
    });
    checkValueArr.push(tempObj.prop);
    if (!tempObj.isNotInitShow) {
      checkedValues.value.push(tempObj.prop);
    }
  }
}
//——————————————————————————————————————end——————————————————————————————————————————————————————
</script>

<style lang="scss" scoped>
// 头部标题
.head-config-header {
  line-height: 45px;
  border-bottom: 1px #f3f3f3 solid;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

// 列表项容器
.head-config-container {
  overflow: auto;
  .item-row {
    width: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 42px;
    cursor: pointer;
    border-radius: 3px;
    padding: 0 8px;
    border-bottom: 1px #f9f9f9 solid;
    &:first-child {
      border-top: 1px #f9f9f9 solid;
    }
    &:hover {
      background-color: #f9f9f9;
    }
  }
  .chosenClass {
    background-color: #f9f9f9;
  }
  .ghost {
    background-color: #e6f4ff;
  }
}

// 底部按钮
.head-config-footer {
  margin-top: 30px;
}

:deep(.el-drawer__body) {
  overflow: hidden !important;
}
</style>
