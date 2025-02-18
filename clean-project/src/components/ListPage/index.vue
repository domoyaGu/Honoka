<template>
  <div class="table-container">
    <div class="table-box">
      <span class="ts-title fl">
        <img style="margin-right: 5px" src="@/assets/icons/listImg.svg" alt="" />
        {{ tabelTitle }}
      </span>
      <div class="btn-list">
        <slot name="tab-btnList" />
      </div>
    </div>
    <el-table
      :data="dataList"
      :header-cell-style="{ background: '#F2F6FC', color: '#242525', height: '50px' }"
      :row-style="{ height: '50px', fontSize: '14px', padding: '0px' }"
      style="width: 100%;"
      border
    >
      <el-table-column
        type="index"
        label="序号"
        width="55"
      />
      <el-table-column
        v-for="(item, index) in tabTheadAll"
        :key="item"
        :label="item"
        :prop="index"
        :width="widthFn(index)"
      >
        <template #default="scope">
          <!--             调用结果              -->
          <!-- <div v-if="index =='result'">
            <div  v-if="scope.row[index]" class="tag" :style="{ backgroundColor: quotationStatusEnum[scope.row['quotationStatus']].back, color: quotationStatusEnum[scope.row['quotationStatus']].spot }">
              <div class="flex-center">
                <div class="spot" :style="{ backgroundColor: quotationStatusEnum[scope.row['quotationStatus']].spot }"/>
                {{scope.row[index]}}
              </div>
            </div>
            <div v-else>- - -</div>
          </div> -->
          <!--             车辆状态              -->
          <div v-if="index === 'isAudit'">
            <span :style="{color: status.carStatusEnum[scope.row[index]].spot}">
              {{status.carStatusEnum[scope.row[index]].text}}
            </span>
          </div>
          <!--             用户状态              -->
          <div v-else-if="index === 'userStatus'">
            <span :style="{color: status.userStatusEnum[scope.row[index]].spot}">
              {{status.userStatusEnum[scope.row[index]].text}}
            </span>
          </div>
          <!--             积分              -->
          <div v-else-if="index === 'pointSum'">
            <el-button
              type="primary"
              link
              @click="openPointEditDialog(scope.row)"
              v-if="scope.row[index] || scope.row[index] === 0"
            >{{ scope.row[index] }}</el-button>
            <span v-else>无积分信息</span>
          </div>
          <!--             其他              -->
          <div v-else>{{ scope.row[index] || '- - -' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" :width="operationWidth || oWidth">
        <template #default="scope">
          <div class="operationBtns">
            <slot name="operation" :data="scope.row" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="list-pagination">
      <el-pagination
        v-if="total>0"
        v-model:currentPage="currentPageNum"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="total"
        background
        @size-change="handleSizeChange"
        @current-change ="handleCurrentChange"
    />
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { emit } from 'process';
import { ref } from 'vue'
import { status } from '@/utils/status'
import { Edit, CirclePlus } from '@element-plus/icons-vue';

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
  pageSizes: {
    type: Array,
    default() {
      const type:number[] = [10, 15, 20, 25, 30]
      return type;
    }
  },
  // 总条数
  total: {
    type: Number,
    default: 0
  },
  // 当前页
  currentPage: {
    type: Number,
    default: 1
  },
  // 表格标题
  tabelTitle: {
    type: String,
    default: ''
  },
  // 是否选择
  selection: {
    type: Boolean,
    default: false
  },
  operationWidth: {
    type: Number,
    default: 0
  }
})

const oWidth = ref(150)

// 更改表格页数
const currentPageNum = ref(1)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const emit = defineEmits(['paginationCurrentPage', 'pointDialog'])
const handleCurrentChange = (val: number) => {
  currentPageNum.value = val
  emit('paginationCurrentPage', val)
}

// 返回表格单元宽度
function widthFn(key) {
  switch(key) {
    case 'id': return '200';
    case 'createTime': return '180'
    default: return ''
  }
}

defineExpose({
  handleCurrentChange
})

// 用户积分弹窗
function openPointEditDialog(data) {
  emit('pointDialog', data)
}

</script>

<style lang="scss" scoped>
.table-container {
  padding:16px;
  background: #fff;
  border-radius: 5px;
}
.table-box {
  background: #fff;
  margin-bottom: 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .ts-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    width: 200px;
    color: #909399;
  }
}
.tag {
  display: inline-block;
  padding: 0 6px;
  width: auto;
  border-radius: 8px;
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .spot {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    margin-right: 8px;
  }
}

.list-pagination {
  background: #fff;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
