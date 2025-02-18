<template>
  <div class="detail">
    <tabs :list="tabList" @change-tab="changeTab"/>
    <div v-show="tabIndex == 0">
      <baseinfo :data="tcData"/>
      <report ref="reportForm" :data="reportData" :is-detail="type == '2'" :is-new="!route.query.claimNo"/>
      <lossproject ref="lossprojectForm" :data="reportData" :is-detail="type == '2'" :is-new="!route.query.claimNo"/>
      <Collapse>
        <template #title><h1>报案意见</h1></template>
        <el-form-item label="报案意见">
          <el-select v-model="body.baStatus" :disabled="type == '2'">
            <el-option
              v-for="(option, index) in baActionOptions"
              :value="option.dictValue"
              :label="option.dictName"
              :key="index"
            />
          </el-select>
        </el-form-item>
      </Collapse>
    </div>
    <div v-show="tabIndex == 1">
      <ReportDetail :data="tcData"/>
    </div>
    <div class="button-list">
      <el-button type="primary" @click="submit" v-if="type != '2'">报案完成</el-button>
      <el-button @click="() => { $router.push({ path: '/report' }) }">
        {{ type == '2' ? '返回' : '取消' }}
      </el-button>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { getTcInfo } from '@/api/common';
import router from '@/router';
import { ElMessage } from 'element-plus';
import { getSelectOption } from '@/api/common';
import { saveOrUpdate, getDetail } from '@/api/overall-business/report'
import useParame from '@/store';
const { parame:parameData } = useParame()

// ——————————————————————————Tab切换相关——————————————————————————
const tabList = ref([
  {name: '报案信息'},
  {name: '统筹单信息'}
])

const tabIndex = ref(0)

function changeTab(index) {
  tabIndex.value = index
}
// ——————————————————————————Tab切换相关——————————————————————————


const route = useRoute();
// 详情类型
const type = route.query.type;
onMounted(() => {
  if (route.query.claimNo) {
    getReport()
  }
  // 获取统筹单详情
  getTc()
  // 获取报案意见下拉
  getSelect()
})


// 获取下拉
const baActionOptions = ref([])
function getSelect() {
  getSelectOption(['LP_REPORT_STATUS']).then(({ data }) => {
    // 去除待修改和待完善
    baActionOptions.value = type == '2' ? data['LP_REPORT_STATUS'] : data['LP_REPORT_STATUS'].slice(2)
  })
}

// 统筹单信息
const tcData = ref()
// 报案信息
const reportData = ref({})

/**
 * 获取统筹单详情
 */
function getTc() {
  getTcInfo(route.params.id).then(({ data }) => {
    tcData.value = data
    tcData.value.tcNo = route.params.id
    // 获取报案详情
  }).catch((err) => {
    ElMessage.error('获取统筹单有误');
    // 报错的情况直接返回
    router.push('/report')
  })
}

/**
 * 获取报案详情
 */
 function getReport() {
  getDetail({
    claimNo: route.query.claimNo,
    // 获取详情类型；1：报案，2：查勘，3：核损，4：理算，5：核赔，6：结案支付
    type: 1,
    id: route.query.reportId || ''
  }).then(({ data }) => {
    // 获取报案详情
    reportData.value = data
    if (type == '2') body.value.baStatus = data.baStatus
  })
}



//—————————————————————————— 表单校验与提交————————————————————————————————
const reportForm = ref();
const lossprojectForm = ref();
// 接口参数
const body = ref({
  // 报案意见
  baStatus: '3'
})
// 表单校验
function validateForm() {
  return Promise.all([
    reportForm.value.getFormData().then((data) => {
      fetchParams(data)
    }),
    lossprojectForm.value.getFormData().then((data) => {
      fetchParams(data)
    })
  ])
}

// 拼装数据
function fetchParams(data) {
  for (let key in data) {
    // 事故责任单独处理
    if (key == 'duty') {
      body.value['baAccidentLiabilityType'] = data[key].radioName
      body.value['baAccidentLiability'] = data[key].radioValue
    } else {
      body.value[key] = data[key]
    }
  }
}

// 提交报案
function submit() {
  validateForm().then(() => {
    // 案件处理机构暂时写死
    let params = { ...body.value }
    // 状态的中文
    params['baStatusName'] = baActionOptions.value.find(item => item.dictValue == body.value.baStatus)?.dictName
    params['baCommitCompanyName'] = '测试案件处理机构'
    params['tcNo'] = route.params.id
    params['baSource'] = 1
    // 赔案号和id
    if (reportData.value['reportId'] && reportData.value['claimNo']) {
      params['reportId'] = reportData.value['reportId']
      params['claimNo'] = reportData.value['claimNo']
    }
    saveOrUpdate(params).then(() => {
      ElMessage.success('提交成功');
      // 列表页刷新回第一页
      parameData.refresh();
      router.push('/report');
    })
  })
}

//—————————————————————————— 表单校验与提交————————————————————————————————
</script>

<style lang="scss" scoped>
.button-list {
  display: flex;
  justify-content: center;
  padding: 16px;
  margin-top: 16px;
}
</style>
