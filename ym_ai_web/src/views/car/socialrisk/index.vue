<template>
  <div class="list-page">
    <FilterWraper
      ref="filterwraper"
      :data="filterData"
      @search="search"
    ></FilterWraper>
    <ListPage
      ref="listPage"
      :tabTheadAll="tabTheadAll"
      :dataList="dataList"
      :total="total"
      v-loading="loading"
      :currentPage="listQuery.current"
      head-config
      @paginationCurrentPage="paginationCurrentPage"
      @paginationCurrentSize="paginationCurrentSize"
    >
      <template #tab-btnList>
        <OperationBtn icon-class="download" text="下载清单"/>
      </template>
      <template #operation="slot">
        <span class="operation_btn" @click="jumpTo(slot.data.claimId)">查看详情</span>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import mock from './mock.json';
import useStore from '@/store';
import { range } from 'lodash';

const filterData = ref([
  { prop: 'sourceName', label: '案件来源', type: 'select', options: [] },
  { prop: 'claimId', label: '报案号' },
  // { prop: 'personName', label: '姓名' },
  { prop: 'insuredName', label: '姓名' },
  { prop: 'personId', label: '证件号码' },
  { prop: 'phone', label: '电话号码' },
  { prop: 'plateNo', label: '车牌号' },
  { prop: 'atetime', label: '出险时间', type: 'daterange', multiple: true, options: [] },
  { prop: 'accidentPlace', label: '出险地点' },
  { prop: 'bodyshop_name', label: '修理厂' },
  { prop: 'rulesTriggered', label: '网络规则', type: 'select', multiple: true, options: [] },
  { prop: 'componentId', label: '网络编号' },
]);

// 表格列表查询参数
const listQuery = ref({
  current: 1,
  size: 10,
  limit: 1000
});

// 表头
const tabTheadAll = [
{ prop: 'claimId', label: '报案号', width: '210' },
{ prop: 'reporterPhone', label: '报案来电', width: '100' },
{ prop: 'accidentTime', label: '出险时间', width: '200' },
{ prop: 'accidentPlace', label: '出险地点', width: '200', isPop: true },
{ prop: 'reportRemark', label: '报案出险经过', width: '200', isPop: true },
{ prop: 'insuredName', label: '被保险人信息', width: '200', mergeText: '姓名/证件号',
  mergeProp: { prop: 'insuredId', label: '被保险人证件号' } 
},
{ prop: 'insuredCarPlateNo', label: '被保车辆信息', width: '200', mergeText: '车牌号/车架号',
  mergeProp: { prop: 'insuredCarVin', label: '被保车架号' }
},
{ prop: 'driverNameMain', label: '标的驾驶员', width: '200', mergeText: '姓名/证件号',
  mergeProp: { prop: 'driverIdMain', label: '标的驾驶员证件号'}
},
// { prop: 'driverNameThird', label: '三者驾驶员', width: '150' },
{ prop: 'plateNoThird', label: '三者信息', width: '280', mergeText: '车牌号（驾驶员证件号）-车架号' },
{ prop: 'ccId', label: '网络编号', width: '100' },
{ prop: 'ccSize', label: '网络案件量', width: '100' }
];
// 分页
const state = reactive({
  loading: false,
  dataList: [] as any[],
  total: 0
});
const { loading, dataList, total } = toRefs(state);

// 表格ref
const listPage = ref();
// 筛选
const filterwraper = ref();

/**
 * 搜索按钮
 */
function search() {
  listPage.value.handleCurrentChange(1);
}

/**
 * 列表页改变
 * @param val
 */
const paginationCurrentPage = (val: number) => {
  listQuery.value.current = val;
  queryFun();
};

/**
 * 每页展示条数改变
 * @param val
 */
const paginationCurrentSize = (val: number) => {
  listQuery.value = { current: 1, size: val, limit: 1000 };
  queryFun();
};

/**
 * 搜索逻辑
 */
function queryFun() {
  state.loading = true;
  filterwraper.value.getFilterData().then(
    res => {
      // const { records, total } = data
      const {current, size} = listQuery.value 
      let data = mock.filter(item => {
        let match = true;
        for (let key in res) {
          if (item[key].indexOf(res[key]) == -1) {
            match = false;
          }
        }
        return match;
      });
      state.dataList = data.filter((item, index) => {
        return range((current - 1) * size, current * size).includes(index)
      });
      state.total = data.length > 10 ? mock.length : data.length;
      listPage.value.scrollToRow();
      state.loading = false;
    },
    err => {
      console.log(`output->err`, err);
    }
  );
}

onMounted(() => {
  search();
});

/**
 * 跳转详情页
 */
function jumpTo(claimId: string) {
  router.push({
    path: '/socialrisk/detail',
    query: { claimId }
  })
}

// 刷新页面
const { refresh } = useStore()
onActivated(() => {
  console.log(refresh.isRefresh);
  
  if (refresh.isRefresh) {
    refresh.clear();
    // dom更新完后刷新页面
    nextTick(() => {
      if(filterwraper.value) filterwraper.value.reset()
    })
  }
})
</script>

<style lang="scss" scoped>
.operation_btn {
  color: #155bd4;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
}
</style>
