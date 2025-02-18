<template>
  <div style="width: 100%;">
    <el-tabs v-model="sysType" class="demo-tabs" @tab-change="handleQuery">
      <el-tab-pane v-for="(item, index) in ['业务系统', '管理系统']" :label="item" :name="index">
        <div class="screen">
          <div class="title">
            <div>筛选</div>
          </div>
          <el-form
            label-position="top"
            :model="listQuery[index]"
            clearable
          >
            <el-row :gutter="10">
              <el-col :lg="6" :md="12" :sm="24">
                <el-form-item label="手机号:" prop="userPhone">
                  <el-input
                    v-model="listQuery[index].userPhone"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :lg="6" :md="12" :sm="24">
                <el-form-item label="注册时间:" prop="time">
                  <el-date-picker
                    v-model="listQuery[index].time"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :disabled-date="value => value > new Date()"
                  />
                </el-form-item>
              </el-col>
              <el-col :lg="6" :md="12" :sm="24">
                <el-form-item label="状态:" prop="userStatus">
                  <el-select
                    v-model="listQuery[index].userStatus"
                    placeholder="请输入"
                    clearable
                  >
                    <el-option
                      v-for="(value,key) in ['正常', '锁定']"
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
          :tabTheadAll="getTableHeader(index)"
          :dataList="dataList"
          :total="total"
          v-loading="loading"
          tabelTitle="调用记录"
          @paginationCurrentPage="paginationCurrentPage"
          :operation-width="180"
          @point-dialog="openPointEditDialog"
        >
          <template #tab-btnList>
            <div>
              <el-button
                type="primary"
                :icon="Plus"
                @click="openEditDialog({isAdmin: index})"
              >
                新增
              </el-button>
            </div>
          </template>
          <template #operation="slot">
            <div>
              <el-button
                type="primary"
                link
                :icon="Edit"
                @click="openEditDialog(slot.data)"
              >
                编辑
              </el-button>
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
      </el-tab-pane>
    </el-tabs>
    <UserEdit ref="editDialogRef" @refresh="resetQuery"/>
    <PointEdit ref="pointDialogRef" @refresh="resetQuery"/>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ElForm, ElMessage } from 'element-plus';
import { Edit, Plus, Refresh, Search } from '@element-plus/icons-vue';
import { getUserList } from '@/api/user';

const router = useRouter()
// 表头字段
const tabTheadAll = {
  userId: 'ID',
  userName: '昵称',
  userPhone: '手机号',
  userEmail: '邮箱',
  pointSum: '积分',
  userStatus: '状态',
  createTime: '注册时间'
};

function getTableHeader(index) {
  let header = JSON.parse(JSON.stringify(tabTheadAll))
  if (index) delete header.pointSum
  return header
}

// 分页
const state = reactive({
  loading: true,
  listQuery: [{ current: 1, size: 10, isAdmin: 0 }, { current: 1, size: 10, isAdmin: 1 }] as any,
  dataList: [] as any[],
  total: 0,
  sysType: 0
});
const {
  loading,
  listQuery,
  dataList,
  total,
  sysType
} = toRefs(state);

// 列表页ref
const listPage = ref()
// 列表页改变
const paginationCurrentPage = (val:number)=>{
  state.loading = true;
  state.listQuery[sysType.value].current = val
  handleQuery();
}

// 查询列表页
function handleQuery() {
  state.loading = true;
  let params = { ...state.listQuery[sysType.value] }
  delete params.time
  if (state.listQuery[sysType.value].time && state.listQuery[sysType.value].time.length > 0) {
    params.beginTime = state.listQuery[sysType.value].time[0]
    params.endTime = state.listQuery[sysType.value].time[1]
  }
  params.isAdmin = sysType.value
  getUserList(params).then(({ data }) => {
    state.dataList = data.records
    state.total = data.total;
    state.loading = false;
  });
}

// 搜索重置
function resetQuery() {
  state.loading = true;
  state.listQuery[sysType.value] = { current: 1, size: 10, isAdmin: sysType.value };
  listPage.value[sysType.value].handleCurrentChange(1);
}

// 跳转详情页
function toDetail(data) {
  router.push({path:'/user/detail', query: {id: data.userId}})
}

// 编辑弹窗
const editDialogRef = ref()
function openEditDialog(data) {
  editDialogRef.value.open(data)
}

// 积分编辑弹窗
const pointDialogRef = ref()
function openPointEditDialog(row) {
  pointDialogRef.value.open(row)
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
:deep(.el-tabs__header) {
  background-color: white;
  padding:0 10px;
}
</style>
