<template>
  <div class="tc-detail-container">
    <el-card class="tc-detail-card">
      <div class="card-title"><span class="text">车辆信息</span></div>
      <div class="tc-detail-content">
        <div style="background: #f0f0f0; border-radius: 4px">
          <div class="license-title">证件信息</div>
          <div class="license-container">
            <div class="license">
              <upload-file
                is-disabled
                :limit="1"
                :data-list="driverLicenseList"
                :type-num="5"
                describe="行驶证(主页)"
              />
            </div>
            <div class="license">
              <upload-file
                is-disabled
                :limit="1"
                :data-list="travelLicenseList"
                :type-num="5"
                describe="行驶证(副页)"
              />
            </div>
          </div>
        </div>
        <Detail :data="vehicleList"/>
      </div>
    </el-card>
    <el-card class="tc-detail-card">
      <div class="card-title"><span class="text">车主信息</span></div>
      <div class="tc-detail-content">
        <Detail :data="ownerList"/>
      </div>
    </el-card>
    <el-card class="tc-detail-card">
      <div class="card-title"><span class="text">投统筹人信息</span></div>
      <div class="tc-detail-content">
        <Detail :data="applicantList"/>
      </div>
    </el-card>
    <el-card class="tc-detail-card">
      <div class="card-title"><span class="text">被统筹人信息</span></div>
      <div class="tc-detail-content">
        <Detail :data="insuredList"/>
      </div>
    </el-card>
    <el-card class="tc-detail-card">
      <div class="card-title"><span class="text">交强险</span></div>
      <div class="tc-detail-content">
        <Detail :data="compulsoryList"/>
      </div>
    </el-card>
    <el-card class="tc-detail-card">
      <div class="card-title"><span class="text">商险信息</span></div>
      <div class="tc-detail-content">
        <Detail :data="buinessList"/>
        <div>
          <el-row class="item-title">
            <el-col :span="6">统筹项目</el-col>
            <el-col :span="5">保障额度</el-col>
            <el-col :span="4">绝对免赔率</el-col>
            <el-col :span="5">每次扣减额度/比例</el-col>
            <el-col :span="4">统筹费用</el-col>
          </el-row>
          <div>
            <el-row class="item-content" v-for="(item, index) in parentTcItemList" :key="'parent' + index">
              <el-col :span="6">{{ item.tcItemName }}</el-col>
              <el-col :span="5">{{ item.guaranteeAmount }}</el-col>
              <el-col :span="4">{{ item.absoluteDeduct }}</el-col>
              <el-col :span="5">{{ item.singleDeduction }}</el-col>
              <el-col :span="4">{{ item.tcPremium }}</el-col>
            </el-row>
          </div>
          <div class="tc-child" v-show="showTcChild">
            <el-row class="item-content" v-for="(item, index) in childrenTcItemList" :key="'child' + index">
              <el-col :span="6">{{ item.tcItemName }}</el-col>
              <el-col :span="5">{{ item.guaranteeAmount }}</el-col>
              <el-col :span="4">{{ item.absoluteDeduct }}</el-col>
              <el-col :span="5">{{ item.singleDeduction }}</el-col>
              <el-col :span="4">{{ item.tcPremium }}</el-col>
            </el-row>
          </div>
          <el-row v-if="childrenTcItemList.length > 0" class="tc-more" @click="() => { showTcChild = !showTcChild }">
            {{ showTcChild ? '收起' : '查看更多' }}
            <el-icon style="margin-left: 5px;">
              <ArrowUpBold v-show="showTcChild"/>
              <ArrowDownBold v-show="!showTcChild"/>
            </el-icon>
          </el-row>
          <el-row class="tc-total">统筹费用合计：{{ props.data.tcTotalExpense }}</el-row>
          <el-row class="item-title">特别约定</el-row>
          <el-row class="tc-special" v-for="(item, index) in props.data.specialAgreementList">
            {{ (index + 1) + '、' + item }}
          </el-row>
        </div>
      </div>
    </el-card>
    <el-card class="tc-detail-card">
      <div class="card-title"><span class="text">材料信息</span></div>
      <div class="tc-detail-content">
        <div>
          <p style="margin: 8px">身份证</p>
          <upload-file is-disabled :limit="2" :data-list="meterialList.idImgList" />
          <p style="margin: 8px">驾驶证</p>
          <upload-file is-disabled :limit="2" :data-list="meterialList.driverLicenseList"/>
          <p style="margin: 8px">其他证件</p>
          <upload-file is-disabled :limit="5" :data-list="meterialList.otherCertificateList"/>
          <p style="margin: 8px">公司营业执照</p>
          <upload-file is-disabled :limit="2" :data-list="meterialList.businessLicenseList"/>
        </div>
      </div>
    </el-card>
    <el-card class="tc-detail-card">
      <div class="card-title"><span class="text">作业信息</span></div>
      <div class="tc-detail-content">
        <Detail :data="taskList"/>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getSelectOption } from '@/api/common';
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue';
import { getInsuranceInfo } from '@/api/overall-business/report'

const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
});

// 车辆
const vehicleList = ref({
  isFleet: {title: '是否车队', content: "", type: 'radio', options: 'isOrNot'},
  ownerCompanyName: {title: '归属公司名称', content: "", type: 'input'},
  fleetScale: {title: '车队规模', content: "", type: 'select', options: []},
  carNumber:  {title: '车牌号码', content: "", type: 'input'},
  plateType: {title: '号牌类型', content: "", type: 'select', options: []},
  carVinNo: {title: '车架号', content: "", type: 'input'},
  engineNo: {title: '发动机号', content: "", type: 'input'},
  carNatureUse: {title: '使用性质', content: "", type: 'select', options: []},
  carType: {title: '车辆种类', content: "", type: 'select', options: []},
  energyType: {title: '能源类型', content: "", type: 'select', options: []},
  brandAndModel: {title: '厂牌型号', content: "", type: 'input'},
  carNewPrice: {title: '新车购置价', content: "", type: 'input'},
  marketReferencePrice: {title: '市场参考价格', content: "", type: 'input'},
  negotiatedPrice: {title: '协商价格', content: "", type: 'input'},
  firstRegistrationDate: {title: '初次登记日期', content: "", type: 'input'},
  outputVolume: {title: '排量（L）', content: "", type: 'input'},
  approvedPassenger: {title: '核定载人数（人）', content: "", type: 'input'},
  approvedLoad: {title: '核定载质量（kg）', content: "", type: 'input'},
})

// 车主、投保人、被统筹人、交强险
const ownerList = ref({
    // 车主信息
    ownerNature: {title: '车主性质', content: "", type: 'select', options: []},
    ownerName: {title: '车主名称', content: "", type: 'input'},
    ownerCertificateType: {title: '证件类型', content: "", type: 'select', options: []},
    ownerCertificateNo: {title: '证件号', content: "", type: 'input'},
  })

  const applicantList = ref({
    // 投统筹人信息
    applicantNature: {title: '投统筹人性质', content: "", type: 'select', options: []},
    applicantName: {title: '投统筹人名称', content: "", type: 'input'},
    applicantCertificateType: {title: '证件类型', content: "", type: 'select', options: []},
    applicantCertificateNo: {title: '证件号', content: "", type: 'input'},
    applicantCertificateValidity: {title: '投统筹人证件有效期', content: "", type: 'input'},
    applicantPhone: {title: '投统筹人手机号', content: "", type: 'input'},
    applicantMailbox: {title: '投统筹人邮箱', content: "", type: 'input'},
    applicantAddress: {title: '投统筹人地址', content: "", type: 'input'},
  })
  
  const insuredList = ref({
    // 被统筹人信息
    insuredNature: {title: '被统筹人性质', content: "", type: 'select', options: []},
    insuredName: {title: '被统筹人名称', content: "", type: 'input'},
    insuredCertificateType: {title: '证件类型', content: "", type: 'select', options: []},
    insuredCertificateNo: {title: '证件号', content: "", type: 'input'},
    insuredCertificateValidity: {title: '被统筹人证件有效期', content: "", type: 'input'},
    insuredPhone: {title: '被统筹人手机号', content: "", type: 'input'},
    insuredMailbox: {title: '被统筹人邮箱', content: "", type: 'input'},
    insuredAddress: {title: '被统筹人地址', content: "", type: 'input'},
  })
  const compulsoryList = ref({
    // 交强险
    compulsoryInsuranceStartTime: {title: '交强险起期', content: "", type: 'input'},
    compulsoryInsuranceEndTime: {title: '交强险止期', content: "", type: 'input'},
    compulsoryInsuranceExpense: {title: '交强险费用', content: "", type: 'input'},
    vehicleAndVesselTax: {title: '车船税', content: "", type: 'input'}
  });

// 商险信息
  const buinessList = ref({
    insuranceStartTime: {title: '保险起期', content: "", type: 'input'},
    insuranceEndTime: {title: '保险止期', content: "", type: 'input'},
    standardPremium: {title: '标准保费', content: "", type: 'input'},
    discountedPremium: {title: '折后保费', content: "", type: 'input'},
    transferFlag: {title: '过户标识', content: "", type: 'radio', options: 'isOrNot'},
    serviceCharge: {title: '手续费', content: "", type: 'input'},
    businessCharge: {title: '业务费', content: "", type: 'input'},
    addedServiceCharge: {title: '增值服务费', content: "", type: 'input'},
    frequentCityList: []
  });

// 材料信息
  const meterialList = ref({
    businessLicenseList:[],
    driverLicenseList:[],
    idImgList:[],
    otherCertificateList:[]
  })
// 作业信息
const taskList = ref({
  auditUsername: {title: '核保作业人员', content: "", type: 'input'},
  auditUserNum: {title: '核保人员工号', content: "", type: 'input'},
  auditUserPhone: {title: '核保人员手机号', content: "", type: 'input'},
  payUsername: {title: '支付审核作业人员', content: "", type: 'input'},
  payUserNum: {title: '支付审核人员工号', content: "", type: 'input'},
  payUserPhone: {title: '支付审核人员手机号', content: "", type: 'input'},
  businessBelongTo: {title: '业务归属机构', content: "", type: 'input'},
  receivingCompany: {title: '收款公司名称', content: "", type: 'input'},
  receivingAccount: {title: '收款公司账户', content: "", type: 'input'},
})

  // 行驶证
  const travelLicenseList = ref([])
  const driverLicenseList = ref([])

  // 商险信息统筹项
  const parentTcItemList = ref([])
  const childrenTcItemList = ref([])
  // 展示子项
  const showTcChild = ref(false)

watch(() => props.data, (newValue, oldValue) => {
  setValue(newValue)
}, { deep: true });

function setValue(newValue) {
  for (let key in vehicleList.value) {
    vehicleList.value[key].content = newValue[key]
  }
  if(newValue.drivingLicenseSidePage) {
    travelLicenseList.value = [{ name: 'drivingLicenseSidePage', url: newValue.drivingLicenseSidePage }]
  }
  if (newValue.drivingLicenseHomePage) {
    driverLicenseList.value = [{ name: 'drivingLicenseHomePage', url: newValue.drivingLicenseHomePage }]
  }
  for (let key in ownerList.value) {
    ownerList.value[key].content = newValue[key]
  }
  for (let key in applicantList.value) {
    applicantList.value[key].content = newValue[key]
  }
  for (let key in insuredList.value) {
    insuredList.value[key].content = newValue[key]
  }
  for (let key in compulsoryList.value) {
    compulsoryList.value[key].content = newValue[key]
  }
  for (let key in buinessList.value) {
    buinessList.value[key].content = newValue[key]
  }
  for (let key in meterialList.value) {
    if(newValue[key] && newValue[key].length > 0) meterialList.value[key] = newValue[key]
  }
  for (let key in taskList.value) {
    taskList.value[key].content = newValue[key]
  }
  if (newValue.tcItemList && newValue.tcItemList.length > 0) {
    getTcProjects(newValue.tcItemList)
  }
}

onMounted(() => {
  if (props.data) {
    setValue(props.data)
  }
  getSelect()
})

function getSelect() {
  getSelectOption(['CAR_TYPE', 'DOCUMENT_TYPE', 'ENERGY_TYPE', 'FLEET_SIZE', 'OWNER_NATURE', 'USE_NATURE', 'VEHICLE_TYPE']).then(({ data }) => {
    // 车队规模
    vehicleList.value.fleetScale.options = data['FLEET_SIZE']
    // 号牌类型
    vehicleList.value.plateType.options = data['CAR_TYPE']
    // 使用性质
    vehicleList.value.carNatureUse.options = data['USE_NATURE']
    // 能源类型
    vehicleList.value.energyType.options = data['ENERGY_TYPE']
    // 车辆种类 树形结构
    vehicleList.value.carType.options = data['VEHICLE_TYPE']
    // 人员性质
    ownerList.value.ownerNature.options = data['OWNER_NATURE']
    applicantList.value.applicantNature.options = data['OWNER_NATURE']
    insuredList.value.insuredNature.options = data['OWNER_NATURE']
    // 证件类型
    ownerList.value.ownerCertificateType.options = data['DOCUMENT_TYPE']
    applicantList.value.applicantCertificateType.options = data['DOCUMENT_TYPE']
    insuredList.value.insuredCertificateType.options = data['DOCUMENT_TYPE']
  })
}

let insuranceProjects = []

// 获取统筹项
function getTcProjects(tcItemList) {
  if (insuranceProjects.length == 0) {
    getInsuranceInfo().then(({ data }) => {
      if (data && data.length > 0) {
        insuranceProjects = data
        setProjects(tcItemList)
      }
    })
  } else {
    setProjects(tcItemList)
  }
}
// 配置统筹项
function setProjects(tcItemList) {
  let parent = []
  let children = []
  tcItemList.forEach((tcItem) => {
    const index = insuranceProjects.findIndex(item => tcItem.insuranceProjectId == item.insuranceProjectId)
    if (index > -1) {
      parent.push(tcItem)
    } else {
      children.push(tcItem)
    }
  })
  parentTcItemList.value = parent
  childrenTcItemList.value = children
}

</script>

<style lang="scss" scoped>
.license-title {
  width: 96px;
  height: 32px;
  font-size: 14px;
  line-height: 32px;
  padding-left: 20px;
  border-radius: 4px 0 4px 0;
  color: #0125D8;
  font-weight: 500;
  background: linear-gradient(
      90deg,
      #b8ddff 0%,
      #b8ddff 0%,
      #dff0ff 100%,
      #6ab7ff 100%,
      #6ab7ff 100%
  );
}
.license-container {
  display: flex;
  padding: 16px;
  margin-bottom: 20px;
  .license { 
    margin-left: 40px;
    font-size: 14px;
    color: #606266
  }
}
  .item-title {
    padding: 15px 13px;
    color: #909399;
    background-color: #EBEEF5;
    font-weight: bold;
  }
  .item-content {
    padding: 10px 10px;
  }
  .tc-child {
    height: fit-content;
    transition: height 0.5s;
  }
.tc-more {
  justify-content: center;
  padding: 16px;
  cursor: pointer;
  color: #3390FF;
  align-items: center;
}
.tc-total {
  display: flex;
  justify-content: right;
  font-size: 18px;
  margin: 10px 0;
}
.tc-special {
  padding: 10px 10px;
}
</style>
