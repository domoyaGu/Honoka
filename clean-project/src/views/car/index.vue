<template>
  <div style="width: 100%;">
    <div class="screen">
      <div class="title">
        <div>筛选</div>
      </div>
      <el-form
        ref="listQueryFrom"
        label-position="top"
        :model="listQuery"
        clearable
      >
        <el-row :gutter="10">
          <el-col :lg="6" :md="12" :sm="24">
            <el-form-item label="车牌号:" prop="carNo">
              <el-input
                v-model="listQuery.carNo"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12" :sm="24">
            <el-form-item label="初次登记日期:" prop="time">
              <el-date-picker
                v-model="listQuery.time"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled-date="value => value > new Date()"
                unlink-panels
              />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12" :sm="24">
            <el-form-item label="车辆状态:" prop="isAudit">
              <el-select
                v-model="listQuery.isAudit"
                placeholder="请输入"
                clearable
              >
                <el-option
                  v-for="(value,key) in ['未验真', '已验真']"
                  :key="key"
                  :value="key"
                  :label="value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: right;margin-right: 30px;">
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button
        ><el-button :icon="Search" type="primary" @click="handleQuery">搜索</el-button>
      </div>
    </div>
    <ListPage
      ref="listPage"
      :tabTheadAll="tabTheadAll"
      :dataList="dataList"
      :total="total"
      v-loading="loading"
      tabelTitle="调用记录"
      @paginationCurrentPage="paginationCurrentPage"
    >
      <template #operation="slot">
        <div>
          <el-button
            type="primary"
            link
            :icon="Search"
            @click="toDetail(slot.data)"
          >
            查看详情
          </el-button>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ElForm, ElMessage } from 'element-plus';
import { Refresh, Search } from '@element-plus/icons-vue';
import { getList } from '@/api/car';

const listQueryFrom = ref(ElForm);
const router = useRouter()
// 表头字段
const tabTheadAll = {
  carVinNo: '车架号',
  carNo: '车牌号',
  carType: '车辆类型',
  carProductModel: '厂牌型号',
  carDelivery: '排量',
  carRegistrationDate: '初次登记日期',
  isAudit: '状态',
  carInfoSource: '来源'
};

// 分页
const state = reactive({
  loading: true,
  listQuery: { current: 1, size: 10 } as any,
  dataList: [] as any[],
  total: 0,
});
const {
  loading,
  listQuery,
  dataList,
  total,
} = toRefs(state);

// 列表页ref
const listPage = ref()
// 列表页改变
const paginationCurrentPage = (val:number)=>{
  state.loading = true;
  state.listQuery.current = val
  handleQuery();
}

// 查询列表页
function handleQuery() {
  state.loading = true;
  let params = { ...state.listQuery }
  delete params.time
  if (state.listQuery.time && state.listQuery.time.length > 0) {
    params.beginTime = state.listQuery.time[0]
    params.endTime = state.listQuery.time[1]
  }
  getList(params).then(({ data }) => {
    state.dataList = data.records
    state.total = data.total;
    state.loading = false;
  });
}

// 搜索重置
function resetQuery() {
  state.loading = true;
  state.listQuery = { current: 1, size: 10 };
  listPage.value.handleCurrentChange(1);
}

// 跳转详情页
function toDetail(data) {
  router.push({path:'/car/detail', query: {id: data.carInfoId, no: data.carVinNo}})
}

// 初始化
onMounted(() => {
  handleQuery();
});


</script>

<style lang="scss" scoped>
// 样式穿透
.el-input,.el-select {
  width: 286px;
}
:deep(.el-input__wrapper) {
  width: 286px;
}
.el-col {
  display: flex;
  justify-content: center;
}
</style>
