<template>
  <div class="login_page">
    <img src="../../assets/login_bg.png" style="height: 100%; width: 63%" />
    <div class="login_container display-flex-center">
      <div class="login_form">
        <div style="width: 432px">
          <span style="font-size: 30px; font-weight: 600; color: #000000"
            >验证码登录</span
          >
          <el-form
            :model="loginForm"
            ref="loginFormRef"
            label-position="top"
            style="margin-top: 50px"
            hide-required-asterisk
            :rules="formRules"
          >
            <el-form-item label="手机号/邮箱" prop="userName">
              <template #label>
                <div class="label_container">
                  <img
                    src="@/assets/login/phone.svg"
                    style="height: 40px; width: 40px"
                  />
                  <span class="label_title">手机号/邮箱</span>
                </div>
              </template>
              <el-input
                v-model="loginForm.userName"
                size="large"
                placeholder="请输入手机号/邮箱"
                clearable
                style=""
              />
            </el-form-item>
            <el-form-item prop="password" style="margin-top: 32px">
              <template #label>
                <div class="label_container">
                  <img
                    src="@/assets/login/lock.svg"
                    style="height: 40px; width: 40px"
                  />
                  <span class="label_title">验证码</span>
                </div>
              </template>
              <verification-code
                ref="codeRef"
                v-model="loginForm.password"
                @before-send-code="sendCode"
              />
              <!-- <el-input
                  v-model="loginForm.password"
                  size="large"
                  type="password"
                  placeholder="请输入密码"
                  clearable
                  @keyup.enter="login"
                /> -->
            </el-form-item>
          </el-form>
        </div>
        <div style="width: 432px; margin-top: 95px">
          <div class="check_container">
            <el-checkbox
              v-model="remmberCheck"
              label=""
              style="margin-right: 9px"
            ></el-checkbox>
            <div class="check_content">
              我已阅读并同意 <a style="color: #2560d2">《服务协议》</a>和<a
                style="color: #2560d2"
                >《隐私权条款》</a
              >，未注册手机号登录时自动创建新账号
            </div>
          </div>
          <el-button
            type="primary"
            size="large"
            style="
              width: 100%;
              margin-top: 15px;
              height: 56px;
              font-size: 22px;
              border-radius: 7px;
            "
            @click="login"
            >登 录</el-button
          >
        </div>
        <!-- <div class="login_bottom">
            <el-button link type="primary" @click="router.push('/forgotpwd')"
              >忘记密码</el-button
            >
          </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElForm } from 'element-plus';
import router from '@/router';
import useStore from '@/store';
import { hideLoading, showLoading } from '@/utils/loading';
import { onBeforeRouteLeave } from 'vue-router';

const { user } = useStore();
const loginForm = ref({
  userName: '',
  password: ''
});
// 记住登录状态
const remmberCheck = ref(true);

// 密码校验
function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error('密码不能少于六位'));
  } else {
    callback();
  }
}

const formRules = {
  userName: [
    {
      required: true,
      message: '手机号/邮箱不能为空',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    { required: true, message: '验证码不能为空', trigger: ['blur', 'change'] },
    { required: true, trigger: 'blur', validator: validatePassword }
  ]
};
// 表单ref
const loginFormRef = ref(ElForm);

/**
 * 登录
 */
function login() {
  if (remmberCheck.value) {
    loginFormRef.value.validate((valid: boolean) => {
      if (valid) {
        // 加载
        showLoading();
        router.push('/home');
      } else {
        return false;
      }
    });
  } else {
    ElMessage.error('请勾选同意协议')
  }
}

// 验证码
const codeRef = ref();
/**
 * 发送验证码
 */
function sendCode() {
  loginFormRef.value.validateField('userName', vaild => {
    if (vaild) codeRef.value.startInterval(loginForm.value.userName);
  });
}

onBeforeRouteLeave((to, from, next) => {
  // 执行一些离开当前路由之前的操作
  hideLoading();
  // 调用 next() 继续导航
  next();
});
</script>

<style lang="scss" scoped>
.login_page {
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  .login_container {
    width: 36%;
    .login_form {
      min-width: 60%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .label_container {
        display: flex;
        align-items: center;
        .label_title {
          color: #333333;
          font-size: 20px;
          font-weight: 400;
          line-height: 40px;
        }
      }
      .check_container {
        display: flex;
        align-items: baseline;
        position: relative;
        .check_content {
          font-size: 14px;
          font-weight: 400;
          position: relative;
          top: -3px;
        }
      }
    }
  }
}

:deep(.el-input__wrapper) {
  background: #f8f9fb;
  border: 1px solid #ececec;
  border-radius: 7px;
  box-shadow: none;
  &:hover {
    border: 1px solid #dcdfe6;
  }
}

:deep(.el-input__inner) {
  height: 56px;
  font-size: 20px;
}
:deep(.el-checkbox__inner) {
  border-radius: 3px;
}
// 去除自动填充的背景色
input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px transparent inset !important;
}
input:-internal-autofill-previewed {
  // -webkit-text-fill-color: #ffffff !important;
  transition: background-color 50000s ease-in-out 0s !important;
}
input:-internal-autofill-selected {
  // -webkit-text-fill-color: #ffffff !important;
  transition: background-color 50000s ease-in-out 0s !important;
}
</style>
