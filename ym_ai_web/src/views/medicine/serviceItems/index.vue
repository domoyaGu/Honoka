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
      :is-operate="false"
      @paginationCurrentPage="paginationCurrentPage"
      @paginationCurrentSize="paginationCurrentSize"
    >
    </ListPage>
  </div>
</template>

<script lang="ts" setup>
import { ENUMS } from '@/utils/enums';
import mock from './mock.json';
import useStore from '@/store';

const filterData = ref([
  { prop: 'name', label: '服务项目名称' },
  { prop: 'code', label: '医疗目录编码' },
  { prop: 'illustrate', label: '诊疗目录说明' },
  { prop: 'connotation', label: '诊疗目录内涵' },
  { prop: 'content', label: '诊疗除外内容' },
]);

// 表格列表查询参数
const listQuery = ref({
  current: 1,
  size: 10
});

// 表头
const tabTheadAll = [
  { prop: 'name', label: '服务项目名称', width: '250' },
  { prop: 'code', label: '医疗目录编码' },
  { prop: 'zlmulb', label: '诊疗目录类别'},
  { prop: 'illustrate', label: '诊疗目录说明', width: '220', isPop: true },
  { prop: 'connotation', label: '诊疗目录内涵', isPop: true },
  { prop: 'content', label: '诊疗除外内容', width: '220' },
  { prop: 'jjdw', label: '计价单位' }
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
  listQuery.value = { current: 1, size: val };
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
      let data = mock.filter(item => {
        let match = true;
        for (let key in res) {
          if (item[key].indexOf(res[key]) == -1) {
            match = false;
          }
        }
        return match;
      });
      state.dataList = data;
      state.total = data.length;
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

// 刷新页面
const { refresh } = useStore()
onActivated(() => {
  if (refresh.refresh) {
    refresh.clear();
    // dom更新完后刷新页面
    nextTick(() => filterwraper.value.reset())
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
