<template>
  <div class="login-container">
    <div class="company-logo">测试</div>
    <el-card style="margin-top: 20px;">
      <div class="login-title">
        <el-button link :icon="ArrowLeft" style="margin-right: 5px;" @click="router.go(-1)"/>
        重置密码
      </div>
      <div class="login-form" style="width: 380px">
        <el-form :model="forgotpwdForm" ref="forgotpwdFormRef" label-position="top" style="margin-top: 15px;" :rules="formRules">
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model="forgotpwdForm.userPhone" size="large" placeholder="请输入手机号" clearable/>
          </el-form-item>
          <el-form-item label="验证码" prop="captchaCode">
            <VerificationCode v-model="forgotpwdForm.captchaCode" ref="codeRef" @before-send-code="getCode"/>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="forgotpwdForm.newPwd" size="large" type="password" placeholder="请输入新密码" clearable/>
          </el-form-item>
          <el-form-item label="确认密码" prop="affirmNewPwd">
            <el-input v-model="forgotpwdForm.affirmNewPwd" size="large" type="password" placeholder="请再次输入密码" clearable/>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="large" style="width: 100%; margin-top: 5px;" @click="forgotpwd">重 置 密 码</el-button>
      </div>
    </el-card>
    <div class="footer-info" @click="openInfo">备案信息：@苏ICP备2022001536号-1</div>
  </div>
</template>

<script lang="ts" setup>
import { regRule } from '@/utils/validate'
import { ElForm, ElMessage } from 'element-plus';
import { getSmsCode } from '@/api/common'
import { putUserPassword } from '@/api/login'
import router from '@/router';
import { ArrowLeft } from '@element-plus/icons-vue';
import { hideLoading } from '@/utils/loading';


const forgotpwdForm = ref({
  affirmNewPwd: "",
  captchaCode: "",
  newPwd: "",
  // newRepeatPwd: "",
  userPhone: ""
})

// 忘记密码表单ref
const forgotpwdFormRef = ref(ElForm)

// 密码校验
function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error('密码不能少于六位'));
  } else {
    callback();
  }
}

// 再次输入密码校验
function validateRepeatPassword(rule: any, value: any, callback: any) {
  if (value !== forgotpwdForm.value.newPwd) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
}

const formRules = {
  userPhone: [
    { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
    { pattern: regRule('phone'), message: '请输入正确的手机号码', trigger: ['blur'] }
  ],
  captchaCode: [
    { required: true, message: '验证码不能为空', trigger: ['blur', 'change'] }
  ],
  newPwd: [
    { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
    { required: true, trigger: 'blur', validator: validatePassword },
  ],
  affirmNewPwd: [
    { required: true, trigger: 'change', validator: validateRepeatPassword },
  ]
}

const codeRef = ref()
/**
 * 获取验证码
 */
function getCode() {
  // 校验手机号
  forgotpwdFormRef.value.validateField(['userPhone'], (valid, err) => {
    if (valid) {
      codeRef.value.startInterval(forgotpwdForm.value.userPhone)
    }
  })
}

/**
 * 注册
 */
function forgotpwd() {
  // 校验手机号
  forgotpwdFormRef.value.validate((valid) => {
    if (valid) {
      putUserPassword(forgotpwdForm.value).then(() => {
        ElMessage.success('密码重置成功,请登录')
        router.push('/login')
      })
    }
  })
}


function openInfo() {
  window.open('https://beian.miit.gov.cn')
}
</script>

<style lang="scss" scoped>

</style>
