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
  { prop: 'drugtype', label:  '药品种类', type: 'select', options: [] },
  { prop: 'drugcode', label:  '药品代码' },
  { prop: 'registeredname', label:  '注册名称' },
  { prop: 'productname', label:  '商品名称'},
  { prop: 'enterprise', label:  '药品企业' },
  { prop: 'number', label:  '批准文号' },
  { prop: 'drugstandardcode', label:  '药品本位码' }
]);

// 表格列表查询参数
const listQuery = ref({
  current: 1,
  size: 10
});

// 表头
const tabTheadAll = [
{ prop: 'drugtype', label:  '药品种类' },
{ prop: 'drugcode', label:  '药品代码', width: '125' },
{ prop: 'registeredname', label:  '注册名称', width: '100' },
{ prop: 'productname', label:  '商品名称' },
{ prop: 'zcjx', label:  '注册剂型', width: '120' },
{ prop: 'zcgg', label:  '注册规格', width: '200' },
{ prop: 'bzcz', label:  '包装材质', width: '220' },
{ prop: 'zxbzsl', label:  '最小包装数量', width: '110' },
{ prop: 'zxzjdw', label:  '最小制剂单位', width: '110' },
{ prop: 'zxbzdw', label:  '最小包装单位', width: '110' },
{ prop: 'enterprise', label:  '药品企业', width: '200' },
{ prop: 'number', label:  '批准文号', width: '200' },
{ prop: 'drugstandardcode', label:  '药品本位码', width: '200' },
{ prop: 'jyl', label:  '甲乙类', mergeText: '国家医保药品目录', mergeProp: {}, width: '120' },
{ prop: 'bm', label:  '编码', mergeText: '国家医保药品目录', mergeProp: {}, width: '120' },
{ prop: 'drugname', label:  '药品名称', mergeText: '国家医保药品目录', mergeProp: {}, width: '200' },
{ prop: 'jx', label:  '剂型', mergeText: '国家医保药品目录', mergeProp: {}, width: '200' },
{ prop: 'bz', label:  '备注', mergeText: '为国家医保药品目录下的名称', mergeProp: {}, width: '200' },
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
