<template>
  <div>
    <SurveySection title="损失计算">
      <el-table :data="data" style="width: 100%; margin-bottom: 10px;" border
        :default-sort="{prop: 'lossProjectId', order: 'ascending'}"
        :header-cell-style="{ background: '#EBEEF5', color: '#909399', height: '48px' }">
        <el-table-column prop="lossProjectId" sortable width="1px">
          <!-- 这边必须给个空值，排序用 -->
          <template #default="scope">
            {{ ' ' }}
          </template>
        </el-table-column>
        <el-table-column label="损失项目" width="120px">
          <template #default="scope">
            <span style="font-weight: bold;font-size: 14px;">{{ scope.row.lossName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计算公式" >
          <template #default="scope">
            <!-- 表单变化太多，必须用多个v-if -->
            <!-- 抚养费信息 -->
            <div v-if="scope.row.lossProjectId == 20">
              <div class="survey-loss-add-btn" style="margin-left: 0;" v-if="segment == 'survey'"
                @click="pushObj(scope.row)">新增</div>
              <div v-for="(item, index) in scope.row.list" style="margin-top: 10px;">
                分摊比
                <span class='input-container' style="width: 35px;">
                  <el-input
                    v-model="item.apportionMolecule"
                    size="small"
                    @input="changeAlimony(item, scope.row)"
                  />
                </span>
                <span class="font-margin">/</span>
                <span class='input-container' style="width: 35px;">
                  <el-input
                    v-model="item.apportionDenominator"
                    size="small"
                    @input="changeAlimony(item, scope.row)"
                  />
                </span>
                <span class="font-margin">*</span>
                年赔偿标准
                <span class='input-container' style="width: 84px;">
                  <el-input
                    v-model="item.yearStandard"
                    size="small"
                    @input="changeAlimony(item, scope.row)"
                  />
                </span>元/年
                <span class="font-margin">*</span>赔偿年限
                <span class='input-container' style="width: 60px;">
                  <el-input
                    v-model="item.payYear"
                    size="small"
                    @input="changeAlimony(item, scope.row)"
                  />
                </span>年
                <span class="font-margin">*</span>赔偿系数
                <span class='input-container' style="width: 60px;">
                  <el-input
                    v-model="item.payRatio"
                    size="small"
                    @input="changeAlimony(item, scope.row)"
                  />
                </span>
                <span class="font-margin" v-if="segment == 'survey'">
                  <el-button
                    link
                    :icon="Delete"
                    @click="deleteItem(scope.row, index) "/>
                </span>
              </div>
            </div>
            <!-- 残疾赔偿金 -->
            <div v-else-if="scope.row.lossProjectId == 16">
              <div class="survey-loss-add-btn" style="margin-left: 0;" v-if="segment == 'survey'"
                @click="pushObj(scope.row)">新增</div>
              <div v-for="(item, index) in scope.row.list" style="display: flex; align-items: center;margin-top: 10px;">
                <div style="display: inline-block;">
                  评残标准
                  <span class='input-container' style="width: 200px;margin-bottom: 5px;">
                    <el-input
                      v-model="item.disabilityStandard"
                      size="small"
                    />
                  </span>
                  评残条款
                  <span class='input-container' style="width: 200px;">
                    <el-input
                      v-model="item.disabilityClause"
                      size="small"
                    />
                  </span>
                  伤残系数
                  <span class='input-container' style="width: 60px;">
                    <el-input
                      v-model="item.disabilityRatio"
                      size="small"
                    />
                  </span><br/>
                  确认伤残系数
                  <span class='input-container' style="width: 60px;">
                    <el-input
                      v-model="item.confirmDisabilityRatio"
                      size="small"
                      @input="changeDisability(item, scope.row)"
                    />
                  </span>
                  <span class="font-margin">*</span>
                  年标准
                  <span class='input-container' style="width: 84px;">
                    <el-input
                      v-model="item.yearStandard"
                      size="small"
                      @input="changeDisability(item, scope.row)"
                    />
                  </span>元/年
                  <span class="font-margin">*</span>
                  赔偿年限
                  <span class='input-container' style="width: 84px;">
                    <el-input
                      v-model="item.payYear"
                      size="small"
                      @input="changeDisability(item, scope.row)"
                    />
                  </span>年
                </div>
                <span class="font-margin" v-if="segment == 'survey'">
                  <el-button
                    link
                    :icon="Delete"
                    @click="deleteItem(scope.row, index) "/>
                </span>
              </div>
            </div>
            <!-- 住宿费 -->
            <div v-else-if="scope.row.lossProjectId == 22">
              <div class="survey-loss-add-btn" style="margin-left: 0;" v-if="segment == 'survey'"
                @click="pushObj(scope.row)">新增</div>
              <div v-for="(item, index) in scope.row.list" style="margin-top: 10px;">
                住宿
                <span class='input-container' style="width: 60px;">
                  <el-input
                    v-model="item.accommodationTime"
                    size="small"
                    @input="changeHotel(item, scope.row)"
                  />
                </span>天
                <span class="font-margin">*</span>
                每日标准
                <span class='input-container' style="width: 84px;">
                  <el-input
                    v-model="item.standardAmount"
                    size="small"
                    @input="changeHotel(item, scope.row)"
                  />
                </span>元/天
                <span class="font-margin">*</span>
                <span class='input-container' style="width: 60px;">
                  <el-input
                    v-model="item.peopleNo"
                    size="small"
                    @input="changeHotel(item, scope.row)"
                  />
                </span>人
                <span class="font-margin" v-if="segment == 'survey'">
                  <el-button
                    link
                    :icon="Delete"
                    @click="deleteItem(scope.row, index) "/>
                </span>
              </div>
            </div>
            <!-- 续医费 -->
            <div v-else-if="scope.row.lossProjectId == 11">
              <div class="survey-loss-add-btn" style="margin-left: 0;" v-if="segment == 'survey'"
                @click="pushObj(scope.row)">新增</div>
              <div v-for="(item, index) in scope.row.list" style="margin-top: 10px;">
                后续治疗项目
                <span class='input-container' style="width: 320px;">
                  <el-input
                    v-model="item.continueTreatment"
                    size="small"
                    @input="changeMedical(item, scope.row)"
                  />
                </span>
                对应费用
                <span class='input-container' style="width: 84px;">
                  <el-input
                    v-model="item.continueCost"
                    size="small"
                    @input="changeMedical(item, scope.row)"
                  />
                </span>元
                <span class="font-margin" v-if="segment == 'survey'">
                  <el-button
                    link
                    :icon="Delete"
                    @click="deleteItem(scope.row, index) "/>
                </span>
              </div>
            </div>
            <!-- 两个输入框的费用 -->
            <div v-else-if="[1, 2, 3, 4, 6].includes(scope.row.type)">
              <!-- // 0：医疗费，1：伙食补助费，2：营养费，3：误工费，4：护理费，5：交通费，6：死亡赔偿金，
              // 7：丧葬费，8：精神抚慰金，9：残疾器具费，10：鉴定费，11：诉讼费，12：其他损失 -->
              <div
                v-if="scope.row.type != 6 && segment == 'survey'"
                class="survey-loss-add-btn"
                style="margin-left: 0;"
                @click="pushObj(scope.row)"
                >
                新增
              </div>
              <div v-for="(item, index) in scope.row.list" :style="'margin-top: ' + (scope.row.type != 6 ? '10' : '0') + 'px;'">
                <span>{{ getPrefix(scope.row.type) }}</span>
                <span class='input-container font-margin' style="width: 80px;">
                  <el-input
                    v-model="item.yearDate"
                    size="small"
                    @input="changeBase(item, scope.row)"
                  />
                </span>
                <span>{{ scope.row.type == 6 ? '年' : '天' }}</span>
                <span class="font-margin">*</span>
                <span>{{ scope.row.type == 6 ? '年' : '每日' }}标准</span>
                <span class='input-container' style="width: 80px;">
                  <el-input
                    v-model="item.moneyValue"
                    size="small"
                    @input="changeBase(item, scope.row)"
                  />
                </span>
                <span>元/{{ scope.row.type == 6 ? '年' : '天' }}</span>
                <span class="font-margin" v-if="scope.row.type != 6 && segment == 'survey'">
                  <el-button
                    link
                    :icon="Delete"
                    @click="deleteItem(scope.row, index) "/>
                </span>
              </div>
            </div>
            <!-- 单个输入框的费用 -->
            <div v-else>
              <div v-for="(item, index) in scope.row.list">
                <span>{{ getPrefix(scope.row.type) }}</span>
                <span class='input-container font-margin' style="width: 84px;">
                  <el-input
                    v-model="item.moneyValue"
                    size="small"
                    @input="changeBase(item, scope.row)"
                  />
                </span>元
                <span v-if="scope.row.type == 7">
                  /年
                  <span class="font-margin">*</span>
                  1/2
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="参与度(%)" fixed="right" width="120px">
          <template #default="scope">
            <span class='input-container' style="width: 60px;">
              <el-input
                v-model="scope.row['participationRatio']"
                placeholder="请输入"
                size="small"
                @input="setRowAmount(scope.row)"
                />
            </span>%
          </template>
        </el-table-column>
        <el-table-column prop="estimatedAmount" label="预估金额" fixed="right" width="120px"/>
        <el-table-column label="索赔金额" fixed="right" width="130px" v-if="segment == 'exam'">
          <template #default="scope">
            <span class='input-container' style="width: 100px;">
              <CurrencyInput
                :default-value="scope.row.claimAmount"
                @inputtext="(val) => { changeClaimAmount(scope.row, val) }"
                clearable
                is-watch
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="examAmount" label="核损金额" fixed="right" width="120px" v-if="segment == 'exam'"/>
      </el-table>
    </SurveySection>
  </div>
</template>

<script lang="ts" setup>
import { currencyDivide, currencyMultiplyAllString, currencyAddAll } from '@/utils/currency';
import { Delete } from '@element-plus/icons-vue';

const props = defineProps({
  // 损失数据
  data: {
    type: Array
  },
  // 环节
  segment: {
    type:String,
    default: "survey"
  }
})

let watchFlag = true

function initWacthFlag() {
  watchFlag = true
}

// 监听父组件，若有默认值，则填充
watch(
  () => props.data, (newValue) => {
    if (newValue && newValue.length > 0 && (watchFlag || props.segment == 'survey')) {
      newValue.forEach((item) => {
        if (!item['participationRatio']) {
          item['participationRatio'] = 100
        }
        if (!item['claimAmount'] && item['claimAmount'] != 0) {
          item['claimAmount'] = item['estimatedAmount']
        }
        if ((!item['list'] || item['list'].length == 0) && props.segment == 'survey') {
          pushObj(item)
        } else if (props.segment == 'exam') {
          // 将已有数据赋值
          setItem(item)
        }
      })
      emits('changeAmount')
      watchFlag = false
    }
  },
  {
    deep: true,
    immediate: true
  }
)



// 塞入新增项
function pushObj(item) {
  if (!item.list) {
    item.list = []
  }
  const id = item.lossProjectId
  switch(id) {
    case 20:
      // 抚养费信息
      item.list.push({
        alimonyId: '', // 类型主键
        apportionDenominator: '', // 分摊比例分母
        apportionMolecule: '', // 分摊比例分子
        estimatedAmount: '', // 预估金额
        claimAmount: '', // 索赔金额
        examAmount: '', // 核损金额
        injureId: '', // 伤者主键id
        participationRatio: 100, // 参与度
        payRatio: '', // 赔偿系数
        payYear: '', // 赔偿年限
        yearStandard: '', // 年赔偿标准
        estimatedItemAmount: 0 // 当前行的计算所得金额
      })
      break;
    case 16:
      // 残疾赔偿金
      item.list.push({
        disabilityId: '', // 类型主键
        confirmDisabilityRatio: '', // 确认伤残系数
        disabilityClause: '', // 评残条款
        disabilityRatio: '', // 伤残系数
        estimatedAmount: '', // 预估金额
        claimAmount: '', // 索赔金额
        examAmount: '', // 核损金额
        injureId: '', // 伤者主键id
        participationRatio: 100, // 参与度
        disabilityStandard: '', // 评残标准
        payYear: '', // 赔偿年限
        yearStandard: '', // 年赔偿标准
        estimatedItemAmount: 0 // 当前行的计算所得金额
      })
      break;
    case 22:
      // 住宿费
      item.list.push({
        hotelId: '', // 类型主键
        peopleNo: '', // 人数
        standardAmount: '', // 每日标准金额
        estimatedAmount: '', // 预估金额
        claimAmount: '', // 索赔金额
        examAmount: '', // 核损金额
        injureId: '', // 伤者主键id
        participationRatio: 100, // 参与度
        accommodationTime: '', // 住宿时间：天
        estimatedItemAmount: 0 // 当前行的计算所得金额
      })
      break;
    case 11:
      // 续医费
      item.list.push({
        medicalId: '', // 类型主键
        estimatedAmount: '', // 预估金额
        claimAmount: '', // 索赔金额
        examAmount: '', // 核损金额
        injureId: '', // 伤者主键id
        participationRatio: 100, // 参与度
        continueCost: '', // 对应费用
        continueTreatment: '', // 后续治疗项目
        estimatedItemAmount: 0 // 当前行的计算所得金额
      })
      break;
    default:
      // 基本信息费
      item.list.push({
        calcId: '', // 类型主键
        estimatedAmount: '', // 预估金额
        claimAmount: '', // 索赔金额
        examAmount: '', // 核损金额
        injureId: '', // 伤者主键id
        participationRatio: 100, // 参与度
        moneyValue: '', // 金额：元
        type: item.type,
        yearDate: '', // 天/年
        estimatedItemAmount: 0 // 当前行的计算所得金额
      })
      break;
  }
}

// 旧项赋值
function setItem(item) {
  if (item?.list?.length > 0) {
    let baseAmount = item.list[0].estimatedAmount
    item.list.forEach(listItem => {
      listItem.estimatedAmount = baseAmount
      listItem.claimAmount = item.claimAmount || baseAmount
      listItem.examAmount = item.examAmount || baseAmount
    })
    // 预估金额
    item.estimatedAmount = baseAmount
    // 索赔金额
    item.claimAmount = item.claimAmount || baseAmount
    // 核损金额
    item.examAmount = item.examAmount || baseAmount
  }
}

// 删除
function deleteItem(row, index) {
  row.list.splice(index, 1);
  setRowAmount(row)
}

// 抚养费变更
function changeAlimony(item, row) {
  // 当所有值都填入后，计算预估金额
  if (item.apportionDenominator && item.apportionMolecule && item.payRatio && item.payYear && item.yearStandard && row.participationRatio) {
    item.estimatedItemAmount = Number(
      currencyDivide(
        Number(currencyMultiplyAllString([item.payRatio, item.payYear, item.yearStandard, item.apportionMolecule])),
        item.apportionMolecule
      )
    )
    setRowAmount(row)
  }
}

// 残疾赔偿金
function changeDisability(item, row) {
  // 当所有值都填入后，计算预估金额
  if (item.confirmDisabilityRatio && item.yearStandard && item.payYear && row.participationRatio) {
    item.estimatedItemAmount = currencyMultiplyAllString([item.confirmDisabilityRatio, item.payYear, item.yearStandard])
    setRowAmount(row)
  }
}

// 住宿费
function changeHotel(item, row) {
  // 当所有值都填入后，计算预估金额
  if (item.peopleNo && item.accommodationTime && item.standardAmount && row.participationRatio) {
    item.estimatedItemAmount = currencyMultiplyAllString([item.standardAmount, item.accommodationTime, item.peopleNo])
    setRowAmount(row)
  }
}

// 续医费
function changeMedical(item, row) {
  // 当所有值都填入后，计算预估金额
  if (item.continueCost && row.participationRatio) {
    item.estimatedItemAmount = item.continueCost
    setRowAmount(row)
  }
}

// 父组件触发反馈总预估金额
const emits = defineEmits(['changeAmount'])

// 计算单项总预估金额
function setRowAmount(row) {
  let amounts = []
  if (row.list && row.list.length > 0) {
    row.list.forEach(item => {if (item.estimatedItemAmount) amounts.push(item.estimatedItemAmount)})
    if (amounts.length > 0) {
      // 当前行的合
      let total = (Number(currencyMultiplyAllString([currencyAddAll(amounts), row.participationRatio])) / 100).toFixed(2)
      if (props.segment == 'exam') { row.examAmount = total } else { row.estimatedAmount = total }
      // 每一行里如果还有孙子列表则列表中每一项都重新赋值
      row.list.forEach(item => {
        item.participationRatio = row.participationRatio
        if (props.segment == 'exam') {
          item.claimAmount = row.claimAmount
          item.examAmount = row.examAmount
        }
        item.estimatedAmount = row.estimatedAmount
      })
      emits('changeAmount')
    }
  } else {
    // 清空的情况
    row.estimatedAmount = 0;
    emits('changeAmount')
  }
}

//———————————————————————————————基本损失费用相关————————————————————————————————————————
// 0：医疗费，1：伙食补助费，2：营养费，3：误工费，4：护理费，5：交通费，6：死亡赔偿金，
// 7：丧葬费，8：精神抚慰金，9：残疾器具费，10：鉴定费，11：诉讼费，12：其他损失 
// 获取对应前缀
function getPrefix(type) {
  let res = ''
  if ([0, 5, 9, 10].includes(type)) {
    res = '合理费用'
  } else {
    switch(type) {
      case 1: res = '住院'; break;
      case 2: res = '营养时长'; break;
      case 3: res = '误工时长'; break;
      case 4: res = '护理时长'; break;
      case 6: res = '赔偿年限'; break;
      case 7: res = '平均工资'; break;
    }
  }
  return res;
}

function changeBase(item, row) {
  // 当所有值都填入后，计算预估金额
  if (item.moneyValue) {
    // 两个框的情况，判断是否填入年份
    if ([1, 2, 3, 4, 6].includes(row.type)) {
      if (item.yearDate) {
        item.estimatedItemAmount = currencyMultiplyAllString([item.yearDate, item.moneyValue])
      }
    } else {
      // 一个框的情况直接赋值
      item.estimatedItemAmount = item.moneyValue
    }
    setRowAmount(row)
  }
}
//———————————————————————————————end————————————————————————————————————————

// 索赔金额变更
function changeClaimAmount(row, value) {
  row.claimAmount = value
  setRowAmount(row)
}

defineExpose({
  initWacthFlag
})

</script>

<style lang="scss" scoped>

.el-input,
.el-select {
  width: 100%;
}
:deep(.el-input__wrapper) {
  width: 100%;
}
.input-container {
  display: inline-block;
}
.font-margin {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
