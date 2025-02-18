<template>
  <el-Dialog title="新建报案" v-bind="$attrs" v-model="show" @close="close" width="80%">
    <div style="padding: 16px">
      <FilterWrap
        ref="filterWrap"
        :queryList="queryList"
        nopadding
        :form-span="8"
        @resetQuery="resetQuery"
        @handleQuery="handleQuery">
      </FilterWrap>
      <ListPage
        ref="listPage"
        key="listPage"
        :tabTheadAll="tabTheadAll"
        :dataList="dataList"
        :total="total"
        v-loading="loading"
        tabelTitle="统筹列表"
        :operationWidth="220"
        @paginationCurrentPage="paginationCurrentPage"
        @open-tc-detail="openDetailDialog"
        has-expand
      >
        <template #operation="slot">
          <div>
            <el-button
              type="primary"
              link
              :icon="Plus"
              @click="toDetail(slot.data, 1)"
            >
              新建报案
            </el-button>
          </div>
        </template>
        <template #expand="scope">
          <div class="report-bean-container">
            <div class="report-bean" v-for="(item, index) in scope.data.reportBeanList">
              <el-row>
                <el-col :lg="{ span: 6 }" :md="{ span: 12 }" :sm="{ span: 24 }">
                  报案来源：{{ getBaSource(item.baSource) }}
                </el-col>
                <el-col :lg="{ span: 6 }" :md="{ span: 12 }" :sm="{ span: 24 }">
                  统筹单号：{{ item.tcNo }}
                </el-col>
                <el-col :lg="{ span: 6 }" :md="{ span: 12 }" :sm="{ span: 24 }">
                  被统筹人：{{ item.insuredName }}
                </el-col>
                <el-col :lg="{ span: 6 }" :md="{ span: 12 }" :sm="{ span: 24 }">
                  承统机构：{{ item.baCommitCompanyName }}
                </el-col>
                <el-col :lg="{ span: 6 }" :md="{ span: 12 }" :sm="{ span: 24 }">
                  车牌号码：{{ item.carNumber }}
                </el-col>
                <el-col :lg="{ span: 6 }" :md="{ span: 12 }" :sm="{ span: 24 }">
                  承保期限：{{ item.insurancePeriod }}
                </el-col>
                <el-col :lg="{ span: 6 }" :md="{ span: 12 }" :sm="{ span: 24 }">
                  流程明细：<span class="process-detail" @click="openprocessDialog(item.claimNo)">查看详情</span>
                </el-col>
                <el-col :lg="{ span: 6 }" :md="{ span: 12 }" :sm="{ span: 24 }">
                  案件状态：
                  <div class="tag" :style="{ backgroundColor: baStatusEnum[item.baStatus].back, color: baStatusEnum[item.baStatus].spot }">
                    <div class="flex-center">
                      <div class="spot" :style="{ backgroundColor: baStatusEnum[item.baStatus].spot }"/>
                      {{ baStatusEnum[item.baStatus].text }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </template>
      </ListPage>
    </div>
    <reportDetailDialog v-if="showDetail" ref="reportDetailDialogRef"/>
    <ProcessDialog ref="processDialogRef"/>
  </el-Dialog>
</template>

<script lang="ts" setup>
import router from '@/router';
import { Search, DocumentCopy, CopyDocument, Plus} from '@element-plus/icons-vue';
import { onMounted } from 'vue';
import ListPage from '@/components/ListPage/index.vue';
import { getTcPage } from '@/api/overall-business/report';
import { getSelectOption } from '@/api/common';

// 报价
const baStatusEnum = {
  1:{back:'#ECF6FF',spot:'#007AFF',text:'待完善报案'},
  2:{back:'#EFF1FF',spot:'#5C74FE', text:'待修改报案'},
  5:{back:'#FFF3EA',spot:'#FF8E35',text:'注销案件'},
  4:{back:'#fff3f3',spot:'#f43535',text:'报案已拒赔'},
  3:{back:'#EAF9F5',spot:'#23BE90',text:'报案完成'},
}

// 打开关闭状态
const show = ref(false)

// 筛选表单
const queryList = ref({
  insuredCertificateNo: {title: '被统筹人身份证号', content: "", type: 'input'},
  insuredName: {title: '被统筹人名称', content: "", type: 'input'},
  insuredPhone: {title: '被统筹人手机号', content: "", type: 'input'},
  carNumber: {title: '统筹车辆车牌号码', content: "", type: 'input'},
  carVinNo: {title: '车架号/VIN码', content: "", type: 'input'},
  tcNo: {title: '统筹单号', content: "", type: 'input'}
})

// 报案表头字段
const tabTheadAll = {
  // baSource: '报案来源',
  tcNo: '统筹单号',
  applicantName: '投统人',
  insuredName: '被统筹人',
  baCommitCompanyName: '承统机构',
  carNumber: '车牌号码',
  insurancePeriod: '承保期限',
  reportNums: { title: '关联案件', type: 'expand'}
};

// 分页相关
const loading = ref(false)
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
  getTcPage(listQuery).then(({ data }) => {
    dataList.value = data.records
    total.value = data.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
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
//————————————————————————————————————详情弹窗——————————————————————————————————



//————————————————————————————————————详情弹窗——————————————————————————————————
const processDialogRef = ref()
function openprocessDialog(claimNo) {
  nextTick(() => {
    // 这边要在渲染之后才能展示，加nextTick
    processDialogRef.value.open(claimNo)
  })
}
//————————————————————————————————————详情弹窗——————————————————————————————————

// 跳转详情页
function toDetail(data, type) {
  close()
  router.push({path:`/report/detail/${data.tcNo}`})
}

function open() {
  show.value = true
  // 获取下拉
  getSelect()
  // handleQuery(listQuery);
}

function close() {
  filterWrap.value.clear()
  listQuery = { current: 1, size: 10 };
  dataList.value = []
  show.value = false
}

// 初始化
onMounted(() => {
});

const baSourceList = ref([])

// 获取下拉
function getSelect() {
  getSelectOption(['LP_REPORT_SOURCE']).then(({ data }) => {
    baSourceList.value = data['LP_REPORT_SOURCE']
  })
}

// 报案来源匹配
function getBaSource(baSource) {
  return baSourceList.value.find(item => item.dictValue == baSource).dictName
}

defineExpose({
  open
})

</script>

<style lang="scss" scoped>
.report-bean-container {
  padding: 16px 32px;
  .report-bean {
    background-color: #F0F0F0;
    margin-bottom: 12px;
    border-radius: 4px;
    padding: 6px 12px;
    .el-col {
      padding: 6px 0;
      color: #303133;
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
  .process-detail {
    color: #67C23A;
    text-decoration: underline;
    cursor: pointer;
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
}

</style>
