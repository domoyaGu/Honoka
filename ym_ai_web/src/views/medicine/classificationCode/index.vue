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
      :isOperate="false"
      :currentPage="listQuery.current"
      @paginationCurrentPage="paginationCurrentPage"
      @paginationCurrentSize="paginationCurrentSize"
    >
      <template #tab-btnList>
        <!-- <div>
          <el-button type="primary">
            新增保单
          </el-button>
        </div> -->
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts" setup>
import { range } from 'lodash';
import mock from './mock.json';
import useStore from '@/store';

const filterData = ref([
{ prop: 'name', label:  '疾病分类名称' },
{ prop: 'code', label:  '疾病分类代码' },
{ prop: 'sujectcategory', label:  '科目类别' },
{ prop: 'systemcategory', label:  '专科系统分类目' },
]);

// 表格列表查询参数
const listQuery = ref({
  current: 1,
  size: 10
});

// 表头
const tabTheadAll = [
{ prop: 'name', label:  '疾病分类名称' },
{ prop: 'code', label:  '疾病分类代码' },
{ prop: 'sujectcategory', label:  '科目类别' },
{ prop: 'systemcategory', label:  '专科系统分类目' },
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
      const {current, size} = listQuery.value 
      let data = mock.disease.filter(item => {
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
      state.total = data.length > 10 ? mock.disease.length : data.length;
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
