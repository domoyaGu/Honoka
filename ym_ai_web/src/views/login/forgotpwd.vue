<template>
  <div class="login_page">
    <div class="login-container">
      <div class="login_box">
        <!-- <img src="../../assets/logo.png"/> -->
        <h2>测试平台</h2>
        <el-card class="login-form">
          <div class="login-title">
            <el-button
              link
              :icon="ArrowLeft"
              style="margin-right: 5px"
              @click="router.go(-1)"
            />
            重置密码
          </div>
          <div class="login-form" style="width: 380px">
            <el-form
              :model="forgotpwdForm"
              ref="forgotpwdFormRef"
              label-position="top"
              style="margin-top: 15px"
              :rules="formRules"
            >
              <el-form-item label="手机号/邮箱" prop="userCredit">
                <el-input
                  v-model="forgotpwdForm.userCredit"
                  size="large"
                  placeholder="请输入手机号/邮箱"
                  clearable
                />
              </el-form-item>
              <el-form-item label="验证码" prop="verifyCode">
                <VerificationCode
                  v-model="forgotpwdForm.verifyCode"
                  ref="codeRef"
                  @before-send-code="getCode"
                />
              </el-form-item>
              <el-form-item label="新密码" prop="password">
                <el-input
                  v-model="forgotpwdForm.password"
                  size="large"
                  type="password"
                  placeholder="请输入新密码"
                  clearable
                />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="forgotpwdForm.confirmPassword"
                  size="large"
                  type="password"
                  placeholder="请再次输入密码"
                  clearable
                />
              </el-form-item>
            </el-form>
            <el-button
              type="primary"
              size="large"
              style="width: 100%; margin-top: 5px"
              @click="forgotpwd"
              >重 置 密 码</el-button
            >
          </div>
        </el-card>
      </div>
    </div>
    <footer-info />
  </div>
</template>

<script lang="ts" setup>
import { ElForm, ElMessage } from 'element-plus';
import { putUserPassword } from '@/api/login';
import router from '@/router';
import { ArrowLeft } from '@element-plus/icons-vue';

const forgotpwdForm = ref({
  confirmPassword: '',
  verifyCode: '',
  password: '',
  userCredit: ''
});

// 忘记密码表单ref
const forgotpwdFormRef = ref(ElForm);

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
  if (value !== forgotpwdForm.value.password) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
}

const formRules = {
  userCredit: [
    { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] }
    // { pattern: regRule('phone'), message: '请输入正确的手机号码', trigger: ['blur'] }
  ],
  verifyCode: [
    { required: true, message: '验证码不能为空', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
    { required: true, trigger: 'blur', validator: validatePassword }
  ],
  confirmPassword: [
    { required: true, trigger: 'change', validator: validateRepeatPassword }
  ]
};

const codeRef = ref();
/**
 * 获取验证码
 */
function getCode() {
  // 校验手机号
  forgotpwdFormRef.value.validateField(['userCredit'], (valid, err) => {
    if (valid) {
      codeRef.value.startInterval(forgotpwdForm.value.userCredit);
    }
  });
}

/**
 * 注册
 */
function forgotpwd() {
  // 校验手机号
  forgotpwdFormRef.value.validate(valid => {
    if (valid) {
      putUserPassword(forgotpwdForm.value).then(res => {
        ElMessage.success(res.data + ',请登录');
        router.push('/login');
      });
    }
  });
}
</script>

<style lang="scss" scoped></style>
