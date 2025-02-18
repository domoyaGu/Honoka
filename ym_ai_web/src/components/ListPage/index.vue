<template>
  <div class="table-container">
    <div class="table-box">
      <div>
        <span class="ts_title"> 查询列表 </span>
      </div>
      <div>
        <!-- 表格右上方按钮插槽 -->
        <slot name="tab-btnList" />
        <OperationBtn icon-class="col_setting" text="列设置"/>
      </div>
    </div>
    <div v-if="total > 0" class="list-container">
      <div class="list_table">
        <el-table
          :data="dataList"
          ref="eltable"
          :header-cell-style="{
            background: '#f7f8fa',
            color: '#323233',
            height: '56px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 1px 0 0 #ebedf0',
            border: '0 solid #979797'
          }"
          :row-style="{
            height: '56px',
            fontSize: '14px',
            padding: '0px',
            color: '#000000e0',
            fontWeight: '400',
          }"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            v-if="!hideIndex"
          />
          <!-- 遍历表头 -->
          <el-table-column
            v-for="item in tableHead"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            :width="item.width || widthFn(item.prop)"
            :fixed="item.isLocked"
          >
            <template #header>
              <div v-if="item.mergeText" class="display-flex-center" style="display: flex;">
                <span>{{ item.label }}</span>
                <el-popover
                  effect="dark"
                  trigger="hover"
                  placement="bottom"
                  width="auto"
                  popper-style="background: #606266;">
                  <template #reference>
                    <el-icon color="#BEBEBE"><QuestionFilled /></el-icon>
                  </template>
                  <template #default>
                    <div class="pop_container" style="padding: 0;">{{ item.mergeText }}</div>
                  </template>
                </el-popover>
              </div>
              <div v-else>{{ item.label }}</div>
            </template>
            <template #default="scope">
              <!-- 状态类的列 -->
              <div v-if="item.isStatus">
                <div
                  class="spot"
                  :style="
                    'background-color: ' +
                    item.enums[scope.row[item.prop]].color +
                    ';'
                  "
                />
                <span
                  :style="
                    'color: ' + item.enums[scope.row[item.prop]].color + ';'
                  "
                >
                  {{ scope.row[item.prop] }}
                </span>
              </div>
              <!-- 风险等级 -->
              <div v-else-if="item.isRisk">
                <div v-if="!scope.row[item.prop]">--</div>
                <div v-else>
                  <svg-icon v-for="num in range(0, scope.row[item.prop])"
                    :key="num"
                    :icon-class="'risk_' + scope.row[item.prop]"
                    style="margin-right: 5px;"/>
                </div>
              </div>
              <!-- 气泡展示 -->
              <div v-else-if="item.isPop">
                <el-popover
                  effect="dark"
                  trigger="hover"
                  placement="bottom"
                  width="auto"
                  popper-style="background: #606266;">
                  <template #reference>
                    <div style="cursor: pointer;">
                      {{ scope.row[item.prop] || '--' }}
                    </div>
                  </template>
                  <template #default>
                    <div class="pop_container">{{ scope.row[item.prop] || '--' }}</div>
                  </template>
                </el-popover>
              </div>
              <!-- 三者信息 -->
              <div v-else-if="item.prop == 'plateNoThird'">
                <div v-if="!scope.row[item.prop] || scope.row[item.prop].length == 1">
                  <div>{{ scope.row[item.prop][0]['plateNoThird'] }}（{{ scope.row[item.prop][0]['driverIdThird'] }}）</div>
                  <div>--{{ scope.row[item.prop][0]['vinThird'] }}</div>
                </div>
                <div v-else>
                  <el-popover
                    effect="dark"
                    trigger="hover"
                    placement="bottom"
                    width="auto"
                    :show-arrow="false"
                    popper-style="background: #606266;">
                    <template #reference>
                      <div style="cursor: pointer;">
                        <div>{{ scope.row[item.prop][0]['plateNoThird'] }}（{{ scope.row[item.prop][0]['driverIdThird'] }}）</div>
                        <div>
                          --{{ scope.row[item.prop][0]['vinThird'] }}
                          <span class="third_num_span">+{{ scope.row[item.prop].length - 1 }}</span>
                        </div>
                      </div>
                    </template>
                    <template #default>
                      <div class="pop_container">
                        <div v-for="(thirdItem, idx) in scope.row[item.prop]" :key="idx">
                          {{ thirdItem.plateNoThird }}（{{ thirdItem.driverIdThird }}）--{{ thirdItem.vinThird }}
                        </div>
                      </div>
                    </template>
                  </el-popover>
                </div>
              </div>
              <!-- 合并信息 -->
              <div v-else-if="item.mergeText">
                <div> {{ scope.row[item.prop] || '--' }} </div>
                <div> {{ scope.row[item.mergeProp.prop] || '' }} </div>
              </div>
              <!-- 正常的列 -->
              <div v-else>{{ scope.row[item.prop] || '--' }}</div>
            </template>
          </el-table-column>
          <!-- 操作栏 -->
          <el-table-column
            fixed="right"
            label=""
            :width="operationWidth || oWidth"
            v-if="isOperate"
          >
            <template #header>
              <div class="operate_style">
                <span>操作</span>
              </div>
            </template>
            <template #default="scope">
              <div class="operationBtns">
                <slot name="operation" :data="scope.row" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="list-pagination">
        <el-pagination
          v-if="total > 0"
          v-model:page-size="pageSize"
          v-model:current-page="currentPageNum"
          background
          :layout="
            'total, ' +
            (isPageSize ? 'slot,' : '') +
            'prev, pager, next, jumper'
          "
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <span class="pagesize_container">
            ，每页<el-input
              class="pagesize_input"
              v-model.number="inputSize"
              @blur="inputSizeChange"
            ></el-input
            >条
          </span>
        </el-pagination>
      </div>
    </div>
    <div v-else class="empty display-flex-column-center">
      <img src="@/assets/empty.png"/>
      <span class="empty_text">暂无数据</span>
    </div>
    <TableConfigDrawer
      v-if="headConfig"
      ref="configDrawerRef"
      v-model="tableHeadConfig"
    />
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcon/index.vue';
import { QuestionFilled } from '@element-plus/icons-vue';
import { range } from 'lodash';

const props = defineProps({
  // 表头数据
  tabTheadAll: {
    type: Object,
    default() {
      return {};
    }
  },
  // 列表数据
  dataList: {
    type: Array,
    default() {
      return [];
    }
  },
  // 分页展示类型
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  // 总条数
  total: {
    type: Number,
    default: 0
  },
  // 表格标题
  tabelTitle: {
    type: String,
    default: ''
  },
  // 操作栏固定宽度需要用到
  operationWidth: {
    type: Number,
    default: 0
  },
  // 操作栏展示与否
  isOperate: {
    type: Boolean,
    default: true
  },
  // 页码自定义
  isPageSize: {
    type: Boolean,
    default: true
  },
  // 是否需要配置表头
  headConfig: {
    type: Boolean,
    default: false
  },
  // 隐藏序号列
  hideIndex: {
    type: Boolean,
    default: false
  }
});

const eltable = ref();

const oWidth = ref(150);
// 表头列
const tableHead = ref([]);
const tableHeadConfig = ref(props.tabTheadAll);

// 表头配置抽屉(显示隐藏、锁定、顺序)
const configDrawerRef = ref();

// 表格页码
const emit = defineEmits(['paginationCurrentPage', 'paginationCurrentSize']);

const currentPageNum = ref(1);

// 更改表格每页显示条数
const pageSize = ref(10);
// 每页条数(为了避免更改就立即触发分页组件的每页条数)
const inputSize = ref(10);

/**
 * 监听列配置
 */
watch(tableHeadConfig, newV => {
  tableHead.value = [];
  newV.forEach(Thead => {
    tableHead.value.push(Thead);
  });
});

/**
 * 每页条数变更
 * @param size
 */
const handleSizeChange = (size: number) => {
  currentPageNum.value = 1;
  inputSize.value = size;
  emit('paginationCurrentSize', size);
};
/**
 * 输入的页码变更
 */
function inputSizeChange() {
  if (pageSize.value != inputSize.value) {
    pageSize.value = inputSize.value;
    handleSizeChange(inputSize.value)
  }
}
/**
 * 当前页码变更
 * @param val
 */
const handleCurrentChange = (val: number) => {
  currentPageNum.value = val;
  emit('paginationCurrentPage', val);
};

/**
 * 滚动到最顶上
 */
function scrollToRow() {
  if(eltable.value) eltable.value.scrollTo(0, 0);
}

// 返回表格单元宽度
function widthFn(key) {
  switch (key) {
    case 'id':
      return '200';
    case 'reportRemark':
      return '200';
    default:
      return '';
  }
}

// 表头配置抽屉
function openConfigDrawer() {
  configDrawerRef.value.show = true;
}

defineExpose({
  handleCurrentChange,
  handleSizeChange,
  scrollToRow,
  pageSize,
  currentPageNum
});

onMounted(() => {});

onBeforeMount(() => {
  props.tabTheadAll.forEach(Thead => {
    if (!Thead.isNotInitShow) {
      tableHead.value.push(Thead);
    }
  });
});

</script>

<style lang="scss" scoped>
.descStyle {
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.copy_btn {
  display: flex;
  p {
    margin-right: 5px;
    margin-top: 3px;
  }
}
.table-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.table-box {
  margin: 24px 0 16px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .ts_title {
    color: #000000;
    font-size: 16px;
    font-weight: 600;
    font-family: 'PingFang SC';
    text-align: left;
    letter-spacing: 0.41px;
  }
}

// 表格和分页组件
.list-container {
  flex-grow: 1;
  border-radius: 8px;
  background-color: #fff;
  padding: 16px;
  height: 100%;
  position: relative;
  .list_table {
    position: absolute;
    width: calc(100% - 32px);
    max-height: calc(100% - 80px);
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    .spot {
      height: 8px;
      width: 8px;
      border-radius: 8px;
      margin-right: 8px;
      display: inline-block;
    }
  }
  .list-pagination {
    position: absolute;
    bottom: 16px;
    right: 16px;
    color: #323233;
    font-size: 14px;
    .pagesize_container {
      display: flex;
      align-items: baseline;
      .pagesize_input {
        width: 56px;
        height: 32px;
        margin: 0 2px;
      }
    }
  }
}


// 气泡内文字
.pop_container {
  color: #ffffffe0;
  font-size: 14px;
  font-weight: 400;
  font-family: "PingFang SC";
  line-height: 22px;
  max-width: 442px;
  letter-spacing: 0.4px;
  padding: 4px;
}

// 三者信息数组项
.third_num_span {
  width: 30px;
  height: 18px;
  border-radius: 2px;
  border: 0 solid #dcdee0;
  background: #e5efff;
  color: #3378E3;
  padding: 2px 7px ;
}

// 操作栏
.operate_style {
  display: flex;
  align-items: center;
}
// 空数据
.empty {
  flex-grow: 1;
  border-radius: 8px;
  background-color: #fff;
  height: 100%;
  width: 100%;
  .empty_text {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
    font-family: "Inter";
    margin-top: -15px;
  }
}

// ——————————————————————————————————————element样式穿透————————————————————————————————————————————————
:deep(.cell) {
  display: flex;
  align-items: center;
}

:deep(.cell span) {
  margin-right: 5px;
}

// 表格内内容最多展示两行
:deep(.cell div) {
  display: -webkit-box; /* 将元素转换为弹性盒子 */
  -webkit-line-clamp: 2; /* 设置显示的行数为两行 */
  -webkit-box-orient: vertical; /* 设置盒子内的元素从垂直方向排列 */
  overflow: hidden; /* 超出部分将隐藏 */
}

:deep(.cell i:hover) {
  cursor: pointer;
}
// table高度自适应
:deep(.el-table) {
  height: 100%;
}
// table去除底部线
:deep(.el-table__inner-wrapper::before) {
  background-color: white;
}

// 固定列右移1个像素(避免看得到表格底层滚动)
:deep(.el-table-fixed-column--right) {
  right: -1px !important; // 这个样式element写了行内样式，所以用important
}

// 分页背景色
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background: #2560d2 !important; //修改默认的背景色
}

</style>
