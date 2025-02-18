<template>
  <div style="display: flex; flex-direction: column;height: calc(100% - 30px);">
    <div class="title-container" style="padding-top: 10px;">
      <div class="title" style="justify-content: space-between;">
        基 本 信 息
        <span v-if="info.carInfoVo?.isAudit === 0">
          <el-button type="primary" style="width: 100px;" @click="auditCar">验真</el-button>
        </span>
        <span v-else>
          <el-button style="width: 100px;" disabled>
            <span style="color: #23BE90;">{{ info.carInfoVo?.auditName }}</span>
          </el-button>
        </span>
      </div>
      <el-row>
        <el-col :span="8"><DetailItem position="left" :item="{title: '车架号', content: info.carInfoVo?.carVinNo, type: 'input'}"/></el-col>
        <el-col :span="8"><DetailItem position="left" :item="{title: '车牌号', content: info.carInfoVo?.carNo, type: 'input'}"/></el-col>
        <el-col :span="8"><DetailItem position="left" :item="{title: '车辆类型', content: info.carInfoVo?.carType, type: 'input'}"/></el-col>
        <el-col :span="8"><DetailItem position="left" :item="{title: '厂牌型号', content: info.carInfoVo?.carProductModel, type: 'input'}"/></el-col>
        <el-col :span="8"><DetailItem position="left" :item="{title: '排量', content: info.carInfoVo?.carDelivery, type: 'input'}"/></el-col>
      </el-row>
    </div>
    <div class="title-container" style="flex-grow: 1;">
      <div class="title">
        事 故 记 录
      </div>
      <div>
        <el-steps
          v-if="info?.malfunctionInfoVo?.length > 0"
          direction="vertical"
          :active="info?.malfunctionInfoVo?.length">
          <el-step v-for="(item, index) in info?.malfunctionInfoVo" status="wait">
            <template #title>
              <span style="font-size: 14px;">{{ item.malfuntionTime }}</span>
            </template>
            <template #icon><svg-icon icon-class="stepdot"/></template>
            <template #description>
              <el-card style="margin-bottom: 20px;">
                <ul>
                  <li v-for="colKey in showColumns">
                    <p style="font-size: 14px;">{{ keyTitle[colKey] + '：' + item[colKey] }}</p>
                  </li>
                </ul>
              </el-card>
            </template>
          </el-step>
          <el-step status="wait"><template #icon><svg-icon icon-class=""/></template></el-step>
        </el-steps>
        <div v-else>
          未查询到事故记录
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getDetail, carAudit } from '@/api/car'
import { QueryCarinfo } from '@/types/car'
import { hideLoading, showLoading } from '@/utils/loading'
import { ElMessage } from 'element-plus'

const route = useRoute()
const keyTitle = {
  carVinNo: "车架号",
  malfunctionTimes: "事故总次数",
  materialMoneySum: '维修总金额',
  repairMoneySum: "材料总金额",
  materialMoney: "材料金额",
  materialText: "材料详情",
  repairMoney: "维修金额",
  repairText: "维修详情"
}
// 事故详情展示字段
const showColumns = ['materialMoney', 'materialText', 'repairMoney', 'repairText']

// 页面所有数据
const info = ref({} as QueryCarinfo)

onMounted(() => {
  getCarDetail()
})

function getCarDetail() {
  showLoading()
  getDetail({ carVinNo: route.query.no }).then(({ data }) => {
    info.value = data
  }).finally(() => {hideLoading()})
}

function auditCar() {
  ElMessageBox.confirm(
    '确认验真该车辆？',
    '提示',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
    }
  ).then(() => {
    showLoading()
    let params = {
      carInfoIds: [],
      auditStatus: 1
    }
    if (info.value.malfunctionInfoVo && info.value.malfunctionInfoVo.length > 0) {
      info.value.malfunctionInfoVo.forEach((item) => {
        params.carInfoIds.push(item.carInfoId)
      })
    }
    carAudit(params).then(() => {
      ElMessage.success('操作成功')
      getCarDetail()
    }).finally(() => {hideLoading()})
  })
}

</script>

<style lang="scss" scoped>

</style>
