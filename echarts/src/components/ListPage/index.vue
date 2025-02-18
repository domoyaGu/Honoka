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
      :row-style="{ height: '50px', fontSize: '14px' }"
      :cell-style="{ padding: '0px' }"
      style="width: 100%"
      border
    >
      <el-table-column
        type="index"
        label="序号"
        width="55"
      />
      <el-table-column
        v-for="(item, key) in tabTheadAll"
        :key="item"
        :label="item.type ? item.title : item"
        :prop="key"
        :width="widthFn(key)"
        :align="key == 'processDetail' ? 'center' : 'left'"
        :type="item.type || ''"
        :style="'color:' + (item.type == 'expand' ? '#409eff' : '')"
      >
        <template #default="scope">
          <!--             关联案件              -->
          <div v-if="key =='reportNums'">
            <div style="padding: 10px" v-show="!scope.row[key] || scope.row[key] <= 0"> 无关联案件 </div>
          </div>
          <!--             报案来源              -->
          <div v-else-if="item.type == 'options'">
            {{ item.options?.find(option => option.dictValue == scope.row[key])?.dictName }}
          </div>
          <!--             流程明细              -->
          <div v-else-if="key == 'processDetail'" style="cursor: pointer;" @click="processDetail(scope.row)">
            <svg-icon icon-class="process_detail_svg"/>
          </div>
          <!--             统筹单号点击展开详情              -->
          <div v-else-if="key =='tcNo'">
            <a @click="openTcDetail(scope.row)">{{ scope.row[key] }}</a>
          </div>
          <!--             报案状态              -->
          <div v-else-if="key =='work'">
            <div  v-if="scope.row[key]" class="tag" :style="{ backgroundColor: baStatusEnum[scope.row['work']].back, color: baStatusEnum[scope.row['work']].spot }">
              <div class="flex-center">
                <div class="spot" :style="{ backgroundColor: baStatusEnum[scope.row['work']].spot }"/>
                {{ baStatusEnum[scope.row['work']].text }}
              </div>
            </div>
            <div v-else>- - -</div>
          </div>
          <!--             派工状态              -->
          <div v-else-if="key =='dispatchStatus'">
            <div  v-if="scope.row[key]" class="tag" :style="{ backgroundColor: dispatchStatusEnum[scope.row['dispatchStatus']].back, color: dispatchStatusEnum[scope.row['dispatchStatus']].spot }">
              <div class="flex-center">
                <div class="spot" :style="{ backgroundColor: dispatchStatusEnum[scope.row['dispatchStatus']].spot }"/>
                {{ dispatchStatusEnum[scope.row['dispatchStatus']].text }}
              </div>
            </div>
            <div v-else>- - -</div>
          </div>
          <!--             查勘状态              -->
          <div v-else-if="key =='surveyStatus'">
           <div  v-if="scope.row[key]" class="tag" :style="{ backgroundColor: surveyStatusEnum[scope.row['surveyStatus']].back, color: surveyStatusEnum[scope.row['surveyStatus']].spot }">
             <div class="flex-center">
               <div class="spot" :style="{ backgroundColor: surveyStatusEnum[scope.row['surveyStatus']].spot }"/>
               {{ scope.row['surveyStatusName'] }}
             </div>
           </div>
           <div v-else>- - -</div>
          </div>
          <!--             核损案件状态              -->
          <div v-else-if="key =='examStatus'">
           <div  v-if="scope.row[key]" class="tag" :style="{ backgroundColor: examStatusEnum[scope.row['examStatus']]?.back, color: examStatusEnum[scope.row['examStatus']]?.spot }">
             <div class="flex-center">
               <div class="spot" :style="{ backgroundColor: examStatusEnum[scope.row['examStatus']]?.spot }"/>
               {{ scope.row['examStatusName'] }}
             </div>
           </div>
           <div v-else>- - -</div>
          </div>
          <!--             理算案件状态              -->
          <div v-else-if="key =='adjustStatus'">
           <div  v-if="scope.row[key]" class="tag" :style="{ backgroundColor: adjustmentStatusEnum[scope.row['adjustStatus']]?.back, color: adjustmentStatusEnum[scope.row['adjustStatus']]?.spot }">
             <div class="flex-center">
               <div class="spot" :style="{ backgroundColor: adjustmentStatusEnum[scope.row['adjustStatus']]?.spot }"/>
               {{ scope.row['adjustStatusName'] }}
             </div>
           </div>
           <div v-else>- - -</div>
          </div>
          <!--             其他              -->
          <div v-else>{{ scope.row[key] || '- - -' }}</div>
          <div v-if="item.type == 'expand'">
            <slot name="expand" :data="scope.row"></slot>
          </div>
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
    <div class="list-pagination" v-show="isShowPage">
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
import useStore from '@/store';
import { next, prop } from 'dom7';
import { TrendCharts } from '@element-plus/icons-vue';
const { system } = useStore();
const deptList: any = system.deptList;
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
  },
  // 是否展示分页
  isShowPage: {
    type: Boolean,
    default: true
  },
  // 是否有展开行内容
  hasExpand: {
    type: Boolean,
    default: false
  }
})

const oWidth = ref(150)

// 暂时注释，操作栏动态宽度有明显延时效果且只会根据第一页
// nextTick(() => {
//   // 这边必须延时获取才能获取到dom，是vue渲染环节获取dom的bug
//   setTimeout(() => {
//     let operationBtns = Array.from(document.getElementsByClassName('operationBtns'))
//     let max = 0;
//     operationBtns.forEach(element => {
//       max = Math.max(max, element.getElementsByTagName('button').length)
//     });
//     oWidth.value = max <= 0 ? 150 : max * 80
//   }, 300)
// })

// 部门
const deptEnum= ( (id) => {
  let name = null
  for (let i = 0; i < deptList.length; i++) {
    if (deptList[i].deptId == id) {
      name = deptList[i].deptName
    }
  }
  return name
})

// 报案
const baStatusEnum = {
  1:{back:'#ECF6FF',spot:'#007AFF',text:'正常'},
  3:{back:'#fff3f3',spot:'#f43535',text:'低'},
  2:{back:'#EAF9F5',spot:'#23BE90',text:'高'},
}
// 报价
const dispatchStatusEnum = {
  0:{back:'#ECF6FF',spot:'#007AFF',text:'待派工'},
  1:{back:'#EFF1FF',spot:'#5C74FE', text:'待改派'},
  2:{back:'#FFF3EA',spot:'#FF8E35',text:'报案修改派工'},
  3:{back:'#fff3f3',spot:'#f43535',text:'派工中'},
  4:{back:'#EAF9F5',spot:'#23BE90',text:'已派工'},
  5:{back:'#EAF9F5',spot:'#23BE90',text:'已改派'},
}

// 勘察
const surveyStatusEnum = {
  0:{back:'#ECF6FF',spot:'#007AFF',text:'待查勘'},
  1:{back:'#EFF1FF',spot:'#5C74FE', text:'查勘中'},
  2:{back:'#ECF6FF',spot:'#007AFF',text:'待改派'},
  3:{back:'#ECF6FF',spot:'#007AFF',text:'查勘暂存'},
  4:{back:'#FFF3EA',spot:'#FF8E35',text:'车物拒赔'},
  5:{back:'#ECF6FF',spot:'#007AFF',text:'查勘拒赔'},
  6:{back:'#FFF3EA',spot:'#FF8E35',text:'车物0结案'},
  7:{back:'#ECF6FF',spot:'#007AFF',text:'人伤跟踪'},
  8:{back:'#FFF3EA',spot:'#FF8E35',text:'人伤拒赔'},
  9:{back:'#FFF3EA',spot:'#FF8E35',text:'人伤0结案'},
  10:{back:'#ECF6FF',spot:'#007AFF',text:'人伤暂存'},
  11:{back:'#ECF6FF',spot:'#007AFF',text:'待视频查勘'},
  12:{back:'#ECF6FF',spot:'#007AFF',text:'已查勘'},
  13:{back:'#ECF6FF',spot:'#007AFF',text:'核损退回查勘'},
  14:{back:'#ECF6FF',spot:'#007AFF',text:'理算退回查勘'},
  15:{back:'#ECF6FF',spot:'#007AFF',text:'核赔退回查勘'},
  16:{back:'#FFF3EA',spot:'#FF8E35',text:'车物查勘提交'},
  17:{back:'#FFF3EA',spot:'#FF8E35',text:'人伤查勘提交'},
  18:{back:'#FFF3EA',spot:'#FF8E35',text:'查勘退回报案'},
  19:{back:'#FFF3EA',spot:'#FF8E35',text:'申请改派'}
}

// 核损案件状态
const examStatusEnum = {
  0:{back:'#ECF6FF',spot:'#007AFF',text:'待核损'},
  1:{back:'#fff3f3',spot:'#f43535', text:'核损中'},
  2:{back:'#FFF3EA',spot:'#FF8E35', text:'核损暂停'},
  3:{back:'#EAF9F5',spot:'#23BE90', text:'车物已核损'},
  4:{back:'#EAF9F5',spot:'#23BE90', text:'人伤已核损'},
  5:{back:'#EAF9F5',spot:'#23BE90', text:'已核损'},
  6:{back:'#ECF6FF',spot:'#007AFF', text:'核损退回查勘'},
  7:{back:'#ECF6FF',spot:'#007AFF', text:'核赔退回核损'},
  8:{back:'#FFF3EA',spot:'#FF8E35', text:'车物0结案'},
  9:{back:'#fff3f3',spot:'#f43535', text:'车物拒赔'},
  10:{back:'#FFF3EA',spot:'#FF8E35', text:'人伤0结案'},
  11:{back:'#fff3f3',spot:'#f43535', text:'人伤拒赔'}
}

// 理算案件状态
const adjustmentStatusEnum = {
  0:{back:'#ECF6FF',spot:'#007AFF', text:'待理算'},
  1:{back:'#fff3f3',spot:'#f43535', text:'理算中'},
  2:{back:'#FFF3EA',spot:'#FF8E35', text:'理算暂存'},
  3:{back:'#EAF9F5',spot:'#23BE90', text:'部分理算'},
  4:{back:'#EAF9F5',spot:'#23BE90', text:'已理算'},
  5:{back:'#EAF9F5',spot:'#23BE90', text:'核赔退回理算'},
  6:{back:'#ECF6FF',spot:'#007AFF', text:'结案支付退回理算'},
  7:{back:'#ECF6FF',spot:'#007AFF', text:'理算退回查勘'}
}

// 更改表格页数
const currentPageNum = ref(1)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const emit = defineEmits(['paginationCurrentPage', 'processDetail', 'openTcDetail'])
const handleCurrentChange = (val: number) => {
  currentPageNum.value = val
  emit('paginationCurrentPage', val)
}
// 单纯切换页码不更新数据
const pageChange = (val: number) => {
  if (currentPageNum.value !== val) {
    currentPageNum.value = val
  }
}

// 返回表格单元宽度
function widthFn(index) {
  if (index=='quotationStatusName'||index=='auditStatusName'
    ||index=='statusName'||index=='applicationStatusName'||index=='payStatusName'||index=='tcStatusName'
    ||index=='tcStatusName'||index=='correctionStatus') {
    return '155'
  }
  else if (index=='quotationNo'||index=='no'||index=='applicationNo'||index=='tcNo'||index=='correctionNo') {
    return '185'
  }
  else if (index == 'carNumber') {
    return '100'
  }
  else if (index == 'processDetail') {
    return '90'
  }
  else if (index == 'insurancePeriod') {
    return '200'
  } else if (index == 'reportNums') {
    return '140'
  }
  else return ''
}

// 打开流程明细
function processDetail(row) {
  if (row.claimNo) {
    emit('processDetail', row.claimNo)
  }
}

// 打开统筹详情
function openTcDetail(row) {
  if (row.tcNo) {
    emit('openTcDetail', row.tcNo)
  }
}

watch(() => props.dataList, (newValue, oldValue) => {
  setExpand()
});

onMounted(() => {
  // 控制表格展开样式
  setExpand()
})

function setExpand() {
  if (props.hasExpand) {
    nextTick(() => {
      let dom = document.getElementsByClassName('el-table__expand-icon')
      if (dom.length == 0) {
        // 延时保证取到dom
        setTimeout(() => {
          expandElements()
        }, 300)
      } else {
        expandElements()
      }
    })
  }
}

let isFirstExpand = true

function expandElements() {
  const dom = document.getElementsByClassName('el-table__expand-icon')
  const expands = document.getElementsByClassName('el-table__expand-span')
  for (let i = 0; i < dom.length; i++) {
    let current = dom.item(i)
    let nums = props.dataList[i]['reportNums'] || 0;
    if (isFirstExpand) {
      let newNode = document.createElement('span');
      newNode.innerHTML = nums
      newNode.className = 'el-table__expand-span'
      current.before(newNode)
    } else {
      if (expands[i]) {
        expands[i].innerHTML = nums
      } else {
        let newNode = document.createElement('span');
        newNode.innerHTML = nums
        newNode.className = 'el-table__expand-span'
        current.before(newNode)
      }
    }
    if (nums == 0 && current['style']) {
      current['style'].display = 'none'
      expands[i]['style'].color = ''
    } else {
      current['style'].display = 'inline-block'
      expands[i]['style'].color = '#409eff'
    }
  }
  isFirstExpand = false
}

defineExpose({
  handleCurrentChange,
  pageChange
})

</script>

<style lang="scss" scoped>
.table-container {
  padding:16px;
  background: #fff;
  border-radius: 8px
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
a {
  color: #409eff
}

:deep(.el-table__expand-icon) {
  display: inline-block;
  color: #409eff;
}
.svg-icon {
  width: 24px;
  height: 24px;
}
</style>
