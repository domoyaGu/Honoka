<template>
  <div class="list-page">
    <div class="filter_container">
      <div class="display-flex-column-center" v-for="(set, index) in setting" :key="index">
        <div class="company_filter_row" v-if="set.isOther">
          <CheckBar v-model="params[set.prop]" :label="set.label" :data="set.data" :is-multi="set.isMulti"/>
        </div>
        <div class="company_filter_row" v-else>
          <CheckBar v-model="params[set.prop]" :label="set.label" :data="set.data" :is-multi="set.isMulti"/>
        </div>
        <span class="after_border_line" v-if="index < setting.length - 1"/>
      </div>
    </div>
    <div class="result_container">
      <div class="company_result_title">
        <span>近三个月内新注册7849218家企业</span>
        <div>
          <OperationBtn icon-class="col_setting" text="批量领取"/>
          <OperationBtn icon-class="col_setting" text="智能排序"/>
        </div>
      </div>
      <div class="company_result_rows">
        <div class="rows_container">
          <div class="company_result_row" v-for="(company, index) in companies" :key="index">
            <div class="result_img display-flex-center" :style="{ backgroundColor: companyBgColors[index % companyBgColors.length] }">
              <span>{{ company.abbreviationName }}</span>
            </div>
            <div class="result_content">
              <div class="content_title">{{ company.name }}</div>
              <div class="content_tag">
                <span>联系方式{{ company.telephone }}</span>
                <span>{{ company.type }}</span>
                <span>{{ company.businessStatus }}</span>
              </div>
              <div class="content_row" v-for="(item, index) in contentSetting" :key="index">
                <div v-for="set in item" :key="set.prop" style="display: flex;">
                  <div class="row_item" :style="{ width: set.width || '200px' }">{{ set.label + (company[set.prop] || '—')}}</div>
                </div>
              </div>
              <div class="result_other_info">
                <span>基本信息({{ company.baseinfo }})</span>
                <span>工商详情({{ company.businessDetail }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import checkBarMock from '@/mock/checkBar.json'
import mock from './mock.json'

const params = ref({
  area: '', // 地区
  industry: '', // 行业
  type: '', // 企业类型
  registeredCapital: '', // 注册资本
  businessStatus: '', // 营业状态
  startYears: '', // 成立年限
  financStage: '', // 融资阶段
  staffs: '', // 人员规模
  recruitmentInfo: '', // 招聘信息
  phone: '', // 手机号码
  telephone: '', // 联系电话
  email: '', // 邮箱信息
  recommendNumber: '', // 推荐号码
  webInfo: '', // 网址信息
  app: '', // APP
  webPromotion: '', // 网络推广
})

const setting = [
  { prop: 'area', label: '地区', data: checkBarMock.area},
  { prop: 'industry', label: '行业', data: checkBarMock.industry, isMulti: true},
  { prop: 'type', label: '企业类型', data: checkBarMock.type},
  { prop: 'registeredCapital', label: '注册资本', data: checkBarMock.registeredCapital},
  { prop: 'businessStatus', label: '营业状态', data: checkBarMock.businessStatus},
  { prop: 'startYears', label: '成立年限', data: checkBarMock.startYears},
  { prop: 'financStage', label: '融资阶段', data: checkBarMock.financStage, isMulti: true},
  { prop: 'more', label: '更多筛选', data: checkBarMock.startYears, isOther: true},
  { prop: 'highMore', label: '高级筛选', data: checkBarMock.financStage, isOther: true},
  // { prop: 'staffs', label: '人员规模', data: checkBarMock.staffs},
  // staffs: '', // 人员规模
  // recruitmentInfo: '', // 招聘信息
  // phone: '', // 手机号码
  // telephone: '', // 联系电话
  // email: '', // 邮箱信息
  // recommendNumber: '', // 推荐号码
  // webInfo: '', // 网址信息
  // app: '', // APP
  // webPromotion: '', // 网络推广
]

const companies = mock

const companyBgColors = ['#88AFDA', '#DDB37A']

// 企业详情中的行设置
const contentSetting = [
  [
    {prop: 'owner', label: '企业法人：'},
    {prop: 'startYears', label: '成立日期：'},
    {prop: 'registeredCapital', label: '注册资本：'}
  ],
  [
    {prop: 'staffs', label: '企业规模：'},
    {prop: 'webInfo', label: '企业网址：'},
    {prop: 'industry', label: '所属行业：', width: '400px'}
  ],
  [
    {prop: 'address', label: '经营地址：', width: '500px'}
  ],
]
</script>

<style lang="scss" scoped>
.filter_container {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  .company_filter_row {
    position: relative;
    height: 50px;
    width: 100%;
  }
}
.after_border_line {
  width: calc(100% - 32px);
  border-bottom: 1px dashed #e4e4e4;
}

.result_container {
  font-family: "PingFang SC";
  flex-grow: 1;
  margin-top: 16px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .company_result_title {
    padding: 16px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid #e7e7e7;
  }
  .company_result_rows {
    position: relative;
    padding: 0 24px;
    overflow: hidden;
    flex-grow: 1;
    width: 100%;
    .rows_container {
      height: 100%;
      position: absolute;
      overflow: auto;
      width: calc(100% - 48px);
      .company_result_row {
        width: 100%;
        padding: 24px;
        display: flex;
        .result_img {
          color: white;
          width: 80px;
          height: 80px;
          border-radius: 10px;
          font-size: 24px;
          font-weight: 400;
          margin-right: 24px;
        }
        .result_content {
          width: 800px;
          .content_title {
            color: #333333;
            font-size: 18px;
            font-weight: 600;
            line-height: 22px;
          }
          .content_tag {
            display: flex;
            margin-top: 10px;
            span {
              margin-right: 16px;
              height: 22px;
              line-height: 22px;
              border-radius: 2px;
              padding:0 8px;
              border: 1px solid #00000000;
              background: #2560d21a;
              color: #2560d2;
              font-size: 12px;
              font-weight: 400;
            }
          }
          .content_row {
            display: flex;
            margin-top: 10px;
            width: 100%;
            .row_item {
              color: #666666;
              font-size: 14px;
              font-weight: 400;
              line-height: 22px;
            }
          }
          .result_other_info {
            margin-top: 10px;
            color: #3470ff;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            span {
              margin-right: 20px;
            }
          }
        }

        &:not(:last-child) {
          border-bottom: 1px solid #e7e7e7;
        }
      }
    }
   
  }
}
</style>
