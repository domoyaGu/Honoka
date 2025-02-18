<template>
  <el-table-column :prop="propName" :label="item.title" :width="item.width">
    <template #default="scope">
      <el-input
        v-if="item.type == 'input'"
        v-model="scope.row[propName]"
        placeholder="请输入"
        @input="changeAmount(scope.row)"
        :disabled="isDisabled || item.disabled"
        clearable
      />
      <CurrencyInput
        v-else-if="item.type == 'currency'"
        :default-value="scope.row[propName]"
        @inputtext="(val) => { scope.row[propName] = val; changeAmount(scope.row); }"
        :disabled="isDisabled || item.disabled"
        type="text"
        :placeholder="item.disabled ? '' : '请输入'"
        clearable
        is-watch
        is-negative
      />
      <el-select
        v-else-if="item.type == 'select'"
        clearable
        v-model="scope.row[propName]"
        :disabled="isDisabled || item.disabled"
        placeholder="请选择">
        <el-option
          v-for="(option, index) in item.options"
          :value="option.dictValue"
          :label="option.dictName"
          :key="index"
        />
      </el-select>
      <div v-else-if="item.type == 'otherCurrency'"> {{ currencyFormat(scope.row[propName], true) }}</div>
      <div v-else> {{ scope.row[propName] }}</div>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
import { currencyAddAllString, currencyMultiply, currencySubtract, currencySubtractString } from '@/utils/currency';
import { currencyFormat } from '@/utils/filter';

const props = defineProps({
  // 配置对象
  item: {
    type: Object,
    default: {
      type: 'input',
      options: []
    }
  },
  // 主键
  propName: {
    type: String,
    default: ''
  },
  // 禁用（展示详情）
  isDisabled: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['changeAmount', 'changeResidual'])

// 价格联动
function changeAmount(row) {
  if (props.propName == 'partPrice' || props.propName == 'partNumber') {
    if (!isNaN(Number(row['partPrice'])) && !isNaN(Number(row['partNumber']))) {
      // 车损价格、数量变动更新金额(只有车损信息有这两个字段)
      let amount = currencyMultiply(Number(row['partPrice']), Number(row['partNumber']))
      if (amount) {
        row['checkMoney'] = amount
        row['partMoney'] = amount
        // 更新核价金额
        emits('changeAmount')
      }
    }
  } else if (props.propName == 'goodsNumber' || props.propName == 'goodsPrice') {
    if (!isNaN(Number(row['goodsPrice'])) && !isNaN(Number(row['goodsNumber']))) {
      // 物损价格、数量变动更新金额(只有物损信息有这两个字段)
      let amount = currencyMultiply(Number(row['goodsPrice']), Number(row['goodsNumber']))
      if (amount) {
        row['goodsMoney'] = amount
        if (!isNaN(Number(row['workPrice'])) && !isNaN(Number(row['workNumber']))) {
          // 物损/工时变动更新表格内核价金额
          row['checkMoney'] = currencyAddAllString([row['workMoney'], row['goodsMoney']])
          row['checkAmount'] = currencySubtractString(row['checkMoney'], row['residualMoney'])
          // 更新外部总核价金额
          emits('changeAmount')
        }
      }
    }
  } else if (props.propName == 'workNumber' || props.propName == 'workPrice') {
    if (!isNaN(Number(row['workPrice'])) && !isNaN(Number(row['workNumber']))) {
      // 工时价格、数量变动更新金额(只有物损信息有这两个字段)
      let amount = currencyMultiply(Number(row['workPrice']), Number(row['workNumber']))
      if (amount) {
        row['workMoney'] = amount
        if (!isNaN(Number(row['goodsPrice'])) && !isNaN(Number(row['goodsNumber']))) {
          // 物损/工时变动更新表格内核价金额
          row['checkMoney'] = currencyAddAllString([row['workMoney'], row['goodsMoney']])
          row['checkAmount'] = currencySubtractString(row['checkMoney'], row['residualMoney'])
          // 更新外部总核价金额
          emits('changeAmount')
        }
      }
    }
  } else if (props.propName == 'checkMoney') {
    // 核价金额变动，核定金额跟着变动
    row['checkAmount'] = currencySubtractString(row['checkMoney'], row['residualMoney'])
    // 核价金额变动，更新外部核价金额合计
    emits('changeAmount')
  } else if (props.propName == 'residualMoney') {
    // 残值变动，核定金额跟着变动
    row['checkAmount'] = currencySubtractString(row['checkMoney'], row['residualMoney'])
    // 残值变动，更新外部残值合计
    emits('changeResidual')
  }
}

</script>

<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  width: 110px;
}
:deep(.el-input,.el-select) {
  width: 100px;
}
</style>
