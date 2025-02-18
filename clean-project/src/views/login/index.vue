<template>
  <div class="login-container">
    <div class="company-logo">测试</div>
    <el-card class="login-form">
      <div style="width: 320px;">
        <span style="font-size: 20px;">密码登录</span>
        <el-form :model="loginForm" ref="loginFormRef" label-position="top" style="margin-top: 15px;" :rules="formRules">
          <el-form-item label="手机号/邮箱" prop="phoneOrEmail">
            <el-input v-model="loginForm.phoneOrEmail" size="large" placeholder="请输入手机号/邮箱" clearable/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password"
              size="large" type="password" placeholder="请输入密码" clearable @keyup.enter="login"/>
          </el-form-item>
        </el-form>
      </div>
      <div style="width: 320px;">
        <el-checkbox v-model="remmberCheck">记住登录状态</el-checkbox>
        <el-button type="primary" size="large" style="width: 100%; margin-top: 5px;" @click="login">登 录</el-button>
      </div>
      <div class="login-bottom">
        <!-- <el-button link type="primary" @click="router.push('/register')">注册账号</el-button> -->
        <el-button link type="primary" @click="router.push('/forgotpwd')">忘记密码?</el-button>
      </div>
    </el-card>
    <div class="footer-info" @click="openInfo">备案信息：@苏ICP备2022001536号-1</div>
  </div>
</template>

<script setup lang="ts">
import { ElForm, ElMessage } from 'element-plus'
import router from '@/router';
import useStore from '@/store';
import { hideLoading, showLoading } from '@/utils/loading';

const loginForm = ref({
  phoneOrEmail: '',
  password: ''
})

// 记住登录状态
const remmberCheck = ref(false)

// 密码校验
function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error('密码不能少于六位'));
  } else {
    callback();
  }
}

const formRules = {
  phoneOrEmail: [
    { required: true, message: '手机号/邮箱不能为空', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
    { required: true, trigger: 'blur', validator: validatePassword },
  ]
}

onMounted(() => {
  hideLoading();
})

// 表单ref
const loginFormRef = ref(ElForm);

/**
 * 登录
 */
function login() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const { user } = useStore()
      // 加载
      showLoading()
      user.login(loginForm.value, remmberCheck.value).then(() => {
        user.getUserInfo().then(() => router.push({ path: '/' }))
      }).finally(() => { hideLoading() });
    } else {
      return false;
    }
  });
}

function openInfo() {
  window.open('https://beian.miit.gov.cn')
}

</script>

<style lang="scss">

:deep(.el-checkbox__inner) {
  border-radius: 14px;
}

</style>