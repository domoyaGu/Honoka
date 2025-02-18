<template>
  <div style="display: flex;align-items: center; width: 100%;">
    <el-input
      v-model="creditCode"
      placeholder="请输入验证码"
      size="large"
      style="margin-right: 5px;flex-grow: 1;"
      @input="updateValue"
      clearable
    >
    </el-input>
    <el-button type="primary" size="large" @click="getCode" :disabled="isCode" v-loading="loading">
      {{isCode ? `${codeSecond}秒后重新获取` : '获取验证码'}}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { getSmsCode } from '@/api/common';
import { hideLoading } from '@/utils/loading';
import { ElMessage } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: String,
    defaule: ''
  }
})

// 倒计时配置
const code_time = 60

// 倒计时标识
const isCode = ref(false)
const codeSecond = ref(code_time)

const emits = defineEmits(['beforeSendCode', 'update:modelValue'])

// 验证码
const creditCode = ref(props.modelValue)

/**
 * 获取验证码
 */
function getCode() {
  if (!isCode.value) {
    emits('beforeSendCode')
  }
}

// 计时器
let tiktok = null
// 加载状态
const loading = ref(false)

/**
 * 发送验证码
 */
function startInterval(target) {
  isCode.value = true;
  loading.value = true;
  // 获取验证码接口
  getSmsCode({ str: target }).then(() => {
    ElMessage.success('验证码已发送')
    // 开始倒计时
    tiktok = setInterval(() => {
      codeSecond.value--
      if (codeSecond.value === 0) {
        codeSecond.value = code_time
        isCode.value = false
        clearInterval(tiktok)
      }
    }, 1000)
    hideLoading()
  }).catch(() => { isCode.value = false })
  .finally(() => {
    loading.value = false;
  })
}

// 关闭定时器
function clearTiktok() {
  if(tiktok) clearInterval(tiktok)
  codeSecond.value = 60
  isCode.value = false
}

/**
 * 更新验证码（双向绑定）
 */
function updateValue(value) {
  emits('update:modelValue', value)
}

defineExpose({
  startInterval,
  clearTiktok
})

</script>

<style lang="scss" scoped>

</style>
