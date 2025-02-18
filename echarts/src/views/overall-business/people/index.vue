<template>
  <div style="padding: 16px">
      <FilterWrap
        ref="filterWrap"
        :queryList="queryList"
        @resetQuery="resetQuery"
        @handleQuery="handleQuery">
        <template #button>
          <el-button :icon="Plus" type="primary" @click="openNewDialog">新建报案</el-button>
        </template>
      </FilterWrap>
      <ListPage
        ref="listPage"
        :tabTheadAll="tabTheadAll"
        :dataList="dataList"
        :total="total"
        v-loading="loading"
        tabelTitle="报案列表"
        :operationWidth="220"
        @paginationCurrentPage="paginationCurrentPage"
        @open-tc-detail="openDetailDialog"
        @process-detail="openProcessDialog"
      >
        <template #operation="slot">
          <div>
              <!-- v-if="slot.data.canwork" -->
            <el-button
              v-if="slot.data.canWork"
              type="primary"
              link
              :icon="DocumentCopy"
              @click="toDetail(slot.data, 1)"
            >
              作业
            </el-button>
            <el-button
              type="primary"
              link
              :icon="Search"
              @click="toDetail(slot.data, 2)"
            >
              查看
            </el-button>
          </div>
        </template>
      </ListPage>
      <reportNewDialog ref="reportNewDialogRef"/>
      <reportDetailDialog v-if="showDetail" ref="reportDetailDialogRef"/>
      <ProcessDialog ref="processDialogRef"/>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { Search, DocumentCopy, CopyDocument, Plus} from '@element-plus/icons-vue';
import { onMounted } from 'vue';
import useParame from '@/store';
import ListPage from '@/components/ListPage/index.vue';
import { getPage } from '@/api/overall-business/report';
import { getSelectOption } from '@/api/common';

const { parame:parameData } = useParame()

// 筛选表单
const queryList = ref({
  baSource: {title: '报案来源', content: "", type: 'select', options: []},
  baStatus: {title: '案件状态', content: "", type: 'select', options: []},
  insuredCertificateNo: {title: '被统筹人身份证号', content: "", type: 'input'},
  insuredName: {title: '被统筹人名称', content: "", type: 'input'},
  insuredPhone: {title: '被统筹人手机号', content: "", type: 'input'},
  carNumber: {title: '统筹车辆车牌号码', content: "", type: 'input'},
  carVinNo: {title: '车架号/VIN码', content: "", type: 'input'},
  tcNo: {title: '统筹单号', content: "", type: 'input'},
  insuranceStartTime: {title: '统筹起期', content: "", type: 'date'},
  insuranceEndTime: {title: '统筹止期', content: "", type: 'date'},
  baCommitCompanyName: {title: '承统机构', content: "", type: 'select'},
  claimNo: {title: '统筹案件号', content: "", type: 'input'},
})

// 获取下拉
function getSelect() {
  getSelectOption(['LP_REPORT_SOURCE', 'LP_REPORT_STATUS']).then(({ data }) => {
    tabTheadAll.value.baSource.options = data['LP_REPORT_SOURCE']
    queryList.value.baSource.options = data['LP_REPORT_SOURCE']
    queryList.value.baStatus.options = data['LP_REPORT_STATUS']
  })
}

// 表头字段
const tabTheadAll = ref({
  baSource: { title: '报案来源', type: 'options', options: []},
  tcNo: '统筹单号',
  claimNo: '统筹案件号',
  insuredName: '被统筹人',
  baCommitCompanyName: '承统机构',
  carNumber: '车牌号码',
  insurancePeriod: '承保期限',
  processDetail: '流程明细',
  baStatus: '案件状态'
});

//————————————————————————————————————分页相关——————————————————————————————————
const loading = ref(true)
const dataList = ref([])
const total = ref(0)
// 筛选ref
const filterWrap = ref()
// 列表页ref
const listPage = ref()

// 当前页面仅记录查询项
let listQuery = { current: 1, size: 10 }
// 列表页改变
const paginationCurrentPage = (val:number)=>{
  listQuery.current = val
  handleQuery(listQuery);
}

// 搜索重置
function resetQuery() {
  filterWrap.value.clear()
  listQuery = { current: 1, size: 10 };
  listPage.value.handleCurrentChange(1);
}

// 查询列表页
function handleQuery(data) {
  loading.value = true;
  for (let key in data) {
    listQuery[key] = data[key]
  }
  listPage.value.pageChange(listQuery.current);
  getPage(listQuery).then(({ data }) => {
    dataList.value = data.records
    total.value = data.total;
    loading.value = false;
  });
}
//————————————————————————————————————分页相关——————————————————————————————————

// 跳转详情页
function toDetail(data, type) {
  router.push({
    path:`/report/detail/${data.tcNo}`,
    query: { type, claimNo: data.claimNo, reportId: data.reportId}
  })
}
//————————————————————————————————————新建报案弹窗——————————————————————————————————
// 打开新建报案弹窗
const reportNewDialogRef = ref()
function openNewDialog() {
  reportNewDialogRef.value.open()
}

//————————————————————————————————————详情弹窗——————————————————————————————————
const reportDetailDialogRef = ref()
const showDetail = ref(false)
function openDetailDialog(tcNo) {
  // 调组件
  showDetail.value = true
  nextTick(() => {
    // 这边要在渲染之后才能展示，加nextTick
    reportDetailDialogRef.value.open(tcNo)
  })
}

//————————————————————————————————————流程明细弹窗——————————————————————————————————
const processDialogRef = ref()
function openProcessDialog(claimNo) {
  nextTick(() => {
    // 这边要在渲染之后才能展示，加nextTick
    processDialogRef.value.open(claimNo)
  })
}



// 初始化
onMounted(() => {
  handleQuery(listQuery);
  // 获取下拉
  getSelect()
});

// 缓存返回/提交刷新
onActivated(() => {
  if (parameData.isRefresh) resetQuery()
  parameData.clear()
});

</script>

<style lang="scss" scoped>
</style>
