<template>
  <div class="login-container">
    <div class="login-text">{{ htmlTitle || '易统筹' }}·理赔平台</div>
    <div class="login-box" :style="isLogin ? (noDomain ? 'height: 500px' : 'height: 420px') : 'height: 550px'">
        <div v-if="isLogin" class="login-form">
          <div class="title-container">
            <div class="title">登录</div>
          </div>
            <el-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="loginRules"
              auto-complete="on"
              label-position="top"
            >
              <div v-if="noDomain" class="login-form-lable">域名</div>
              <el-form-item v-if="noDomain" prop="companyDomain">
                <el-input
                  ref="companyDomain"
                  v-model="loginForm.companyDomain"
                  placeholder="请输入域名"
                  name="companyDomain"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                  size="large"
                />
              </el-form-item>
              <div class="login-form-lable">账号</div>
              <el-form-item prop="userName">
                <el-input
                  ref="userName"
                  v-model="loginForm.userName"
                  placeholder="请输入手机号/邮箱"
                  name="userName"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                  size="large"
                />
              </el-form-item>
              <div class="login-form-lable">密码</div>
              <el-form-item prop="password">
                <el-input
                  ref="password"
                  v-model="loginForm.password"
                  type="password"
                  show-password
                  placeholder="请输入登录密码"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.enter="handleLogin"
                  size="large"
                />
              </el-form-item>
              <div class="remember_paw">
                <el-checkbox v-model="passwordChecked">记住密码</el-checkbox>
                <el-divider direction="vertical" />
                <span @click="forgetPasswordFn">忘记密码？</span>
              </div>
              <el-button
                size="large"
                type="primary"
                class="login-btn"
                @click.prevent="handleLogin"
              >登录
              </el-button>
            </el-form>
        </div>
      <div v-if="!isLogin" class="reset-form">
        <div class="title-container">
          <div class="title">忘记密码</div>
        </div>
        <el-tabs v-model="tabType" class="demo-tabs" @tab-click="tabChange">
          <el-tab-pane label="邮箱找回" name="email" />
          <el-tab-pane label="手机找回" name="phone" />
        </el-tabs>
        <div v-if="tabType == 'email'">
          <el-form
            ref="resetFormRef"
            :model="resetForm"
            :rules="resetRules"
            auto-complete="on"
            label-position="top"
          >
            <div class="login-form-lable">邮箱号</div>
            <el-form-item prop="userName">
              <el-input
                v-model="resetForm.userName"
                placeholder="请输入邮箱号"
                type="text"
                size="large"
                clearable
              />
            </el-form-item>
            <div class="login-form-lable">邮箱验证码</div>
            <el-form-item prop="code">
              <el-row>
                <el-col :span="14">
                  <el-input
                    v-model="resetForm.code"
                    type="text"
                    placeholder="请输入验证码"
                    size="large"
                    clearable
                  />
                </el-col>
                <el-col :span="10">
                  <el-button
                    v-if="!isGetCode"
                    size="large"
                    type="primary"
                    @click="getCode"
                  >{{ codeTitle }}
                  </el-button>
                  <el-button
                    v-else
                    disabled
                    size="large"
                    type="info"
                  >{{ codeTime }}秒后发送
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <div class="login-form-lable">密码</div>
            <el-form-item prop="password">
              <el-input
                v-model="resetForm.password"
                type="password"
                show-password
                placeholder="请输入登录密码"
                size="large"
                clearable
              />
            </el-form-item>
          </el-form>
        </div>
        <div v-if="tabType == 'phone'">
          <el-form
            ref="resetFormRef"
            :model="resetForm"
            :rules="resetRules"
            auto-complete="on"
            label-position="top"
          >
            <div class="login-form-lable">手机号</div>
            <el-form-item prop="userName">
              <el-input
                v-model="resetForm.userName"
                placeholder="请输入手机号"
                type="text"
                size="large"
                clearable
              />
            </el-form-item>
            <div class="login-form-lable">手机验证码</div>
            <el-form-item prop="code">
              <el-row>
                <el-col :span="14">
                  <el-input
                    v-model="resetForm.code"
                    type="text"
                    placeholder="请输入验证码"
                    size="large"
                    clearable
                  />
                </el-col>
                <el-col :span="10">
                  <el-button
                    v-if="!isGetCode"
                    size="large"
                    type="primary"
                    @click="getCode"
                  >{{ codeTitle }}
                  </el-button>
                  <el-button
                    v-else
                    disabled
                    size="large"
                    type="info"
                  >{{ codeTime }}秒后发送
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <div class="login-form-lable">密码</div>
            <el-form-item prop="password">
              <el-input
                v-model="resetForm.password"
                type="password"
                show-password
                placeholder="请输入登录密码"
                size="large"
                clearable
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="login_select">
          <span @click="isLogin = true">有账号？去登陆</span>
        </div>
        <el-button
          size="large"
          v-loading="loading"
          type="primary"
          class="login-btn"
          @click="changePassword"
        >确认
        </el-button>
      </div>
    </div>
    <a href="https://beian.miit.gov.cn" target="_blank" class="copyright-box">备案号：苏ICP备2022001536号</a>
  </div>
</template>

<script setup lang="ts">
import { ElForm, ElMessage } from 'element-plus'
import router from '@/router';
import useStore from '@/store';
import { LoginFormData } from '@/types/api/login';
import { regRule, getNowDate, isNotNull } from '@/utils/validate';
import { encryptByDES, decryptByDES } from '@/utils/crypto';
import { localStorage } from '@/utils/storage';
import { getSmsCode, getEmailCode, getCompanyName } from '@/api/common';
import { putUserPassword } from '@/api/login';


const { user, system } = useStore();
const route = useRoute();

const loginFormRef = ref(ElForm);
const resetFormRef = ref(ElForm);

const state = reactive({
  redirect: '',
  loginForm: {
    sys: '统筹承保系统',
    companyDomain: '',
    userName: '',
    password: ''
  } as any,
  loginRules: {
    companyDomain: [
      { required: true, message: '域名不能为空', trigger: ['blur', 'change'] }
    ],
    userName: [
      { required: true, message: '手机号/邮箱不能为空', trigger: ['blur', 'change'] }
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
      { required: true, trigger: 'blur', validator: validatePassword },
    ],
  },
  loading: false,
  otherQuery: {},
  // 记住密码
  passwordChecked: true,
  // 登陆状态、修改密码状态
  isLogin: true,
  // 邮箱、手机号找回
  tabType: '',
  // 重置密码表单
  resetForm: {
    userName: '',
    code: '',
    password: ''
  },
  resetRules: {
    userName: [
      { required: true, message: '请输入邮箱', trigger: ['blur', 'change'] },
      { pattern: regRule('email'), message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
    ],
    code: [],
    password: []
  },
  isGetCode: false,
  codeTitle: '获取验证码',
  // 获取验证码时间
  codeTime: 120,
  // 倒计时
  codeTimer: null,
  noDomain: false,
  htmlTitle: document.title ? document.title.replace('·理赔平台', '') : '',
});

// 密码校验
function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error('密码不能少于六位'));
  } else {
    callback();
  }
}

const {
  loginForm,
  loginRules,
  loading,
  passwordChecked,
  isLogin,
  tabType,
  resetForm,
  resetRules,
  isGetCode,
  codeTitle,
  codeTime,
  noDomain,
  htmlTitle
} = toRefs(state);

const secretKey = 'YuaNm0u@04Z7./*#'
const regexIP = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/g

// 网站title
function getTitle() {
  // 页面有未获取到document.title就渲染完成的情况
  getCompanyName().then(({ data }) =>{
    // document.title = data.companyShowName + '·理赔平台'
    state.htmlTitle = data.companyShowName
  })
}

watch(
  route,
  () => {
    const query = route.query;
    if (query) {
      state.redirect = query.redirect as string;
      state.otherQuery = getOtherQuery(query);
    }
  },
  {
    immediate: true,
  }
);



// 登录
function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 加载
      if (state.passwordChecked) {
        // 存入cookie 加密密码
        setCookie(
          state.loginForm.userName,
          encryptByDES(state.loginForm.password, secretKey),
          7) // 保存7天
        setRememberPassword(1, 7)
      } else {
        clearCookie()
        setRememberPassword(0, 7)
      }
      state.loading = true;

      user
        .login(state.loginForm)
        .then(() => {
          // router.push({ path: state.redirect || '/', query: state.otherQuery });
          router.push({ path: '/' });
          state.loading = false;
        })
        .catch(() => {
          state.loading = false;
        });
    } else {
      return false;
    }
  });
}

// 更改找回密码方式，清除表单
function tabChange() {
  state.resetForm = {
    userName: '',
    code: '',
    password: ''
  }
  if (state.tabType == 'phone') {
    state.resetRules.userName = [
      { required: true, message: '请输入邮箱', trigger: ['blur', 'change'] },
      { pattern: regRule('email'), message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
    ]
  } else if (state.tabType == 'email') {
    state.resetRules.userName = [
      { required: true, message: '请输入手机号', trigger: ['blur'] },
      { pattern: regRule('phone'), message: '请输入正确的手机', trigger: ['blur', 'change'] }
    ]
  }
  nextTick(() => {
    resetFormRef.value.resetFields();
  })
}

// 获取二级域名（从URL获取公司租户号）
function getDomain() {
  const windowsLink = window.location.host.substring(0, location.host.indexOf(':'))
  // 开发模式 localhost ip 手动输入
  // console.log(window.location.hostname == 'localhost')
  // console.log(regexIP.test(windowsLink))
  if (window.location.hostname == 'localhost' || regexIP.test(windowsLink)) {
    // 展示输入框，手动输入
    state.noDomain = true
  } else {
    state.noDomain = false
    // 隐藏输入框，获取URL上的域名
    const companyDomain = window.location.hostname.substring(0, location.hostname.indexOf('.'))
    // console.log(companyDomain, '公司域名')
    state.loginForm.companyDomain = companyDomain
  }
}

function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}

function setCookie(c_name, c_pwd, exdate) { // 账号，密码 ，过期的天数
  var currentDate = new Date()
  currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000 * exdate) // 保存的天数
  document.cookie = 'username=' + c_name + ';path=/;expires=' + currentDate.toLocaleString()
  document.cookie = 'password=' + c_pwd + ';path=/;expires=' + currentDate.toLocaleString()
}

function setRememberPassword(flag, exdate) { // 是否记住密码， 过期的天数
  var currentDate = new Date()
  currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000 * exdate) // 保存的天数
  document.cookie = 'isRememberPwd=' + flag + ';path=/;expires=' + currentDate.toLocaleString()
}

function clearCookie() {
  setCookie('', '', -1) // 清除cookie
}

function getCookie(name) {
  var arr = document.cookie.split(';')
  for (var i = 0; i < arr.length; i++) {
    var arr2 = arr[i].split('=')
    if (arr2[0].trim() == name) {
      return arr2[1]
    }
  }
}

// 登录初始化
function account() {
  if (document.cookie.length >= 0) {
    state.passwordChecked = getCookie('isRememberPwd') == '1'
  }
  if (state.passwordChecked) {
    state.loginForm.userName = getCookie('username')
    state.loginForm.password = decryptByDES(getCookie('password'), secretKey)
  }
}

// 点击获取验证码
function getCode() {
  nextTick(() => {
    resetFormRef.value.validate((valid) => {
      if (valid) {
        state.codeTitle = '验证码发送中'
        state.isGetCode = true
        codeTimer()
        // 获取验证码
        getVerificationCode()
      }
    })
  })
}

// 获取验证码
function getVerificationCode() {
  if (state.tabType == 'email') {
    const data = { email: state.resetForm.userName }
    getEmailCode(data).then((response: any) => {
      if (response.code == 0) {
        ElMessage.success('验证码已发送')
      }
    })
      .catch((err) => {
        console.log(err)
      })
  } else if (state.tabType == 'phone') {
    const data = { phone: state.resetForm.userName }
    getSmsCode(data).then((response: any) => {
      if (response.code == 0) {
        ElMessage.success('验证码已发送')
      }
    })
      .catch((err) => {
        console.log(err)
      })
  }
}

// 修改密码
function changePassword() {
  if (state.tabType == 'email') {
    state.resetRules = {
      userName: [
        { required: true, message: '请输入邮箱', trigger: ['blur', 'change'] },
        { pattern: regRule('email'), message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
      ],
      code: [
        { required: true, message: '验证码不能为空', trigger: ['blur', 'change'] }
      ],
      password: [
        { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
        { required: true, trigger: 'blur', validator: validatePassword },
      ]
    }
  } else if (state.tabType == 'phone') {
    state.resetRules = {
      userName: [
        { required: true, message: '请输入手机号', trigger: ['blur'] },
        { pattern: regRule('phone'), message: '请输入正确的手机', trigger: ['blur', 'change'] }
      ],
      code: [
        { required: true, message: '验证码不能为空', trigger: ['blur', 'change'] }
      ],
      password: [
        { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
        { required: true, trigger: 'blur', validator: validatePassword },
      ]
    }
  }
  nextTick(() => {
    resetFormRef.value.validate((valid) => {
      if (valid) {
        const changeParam = {
          code: state.resetForm.code,
          password: state.resetForm.password,
          userName: state.resetForm.userName
        }
        // console.log(changeParam, 'changeParam')
        putUserPassword(changeParam).then((response: any) => {
          if (response.code == 0) {
            ElMessage.success('密码修改成功')
            state.isLogin = true
            const { userName, password } = state.resetForm
            state.loginForm.userName = userName
            state.loginForm.password = password
          }
        })
          .catch((err) => {
            console.log(err)
          })
      }
    })
  })
}

// 获取验证码计时器
function codeTimer() {
  state.codeTimer = setInterval(() => {
    if (state.codeTime > 0) {
      state.codeTime --
    } else {
      state.isGetCode = false
      state.codeTitle = '获取验证码'
      clearInterval(state.codeTimer)
      state.codeTimer = null
    }
  }, 1000)
}

function forgetPasswordFn() {
  state.isLogin = false
  state.tabType = 'email'
}

onMounted(() => {
  account()
  getDomain()
  if (!isNotNull(document.title)) {
    getTitle()
  }
});

</script>

<style lang="scss" scoped>
$bg: #FAFAFA;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  width: 100vw;
  height: 100vh;
  background: url('../../assets/login-bg.png') repeat center;
  background-size: cover;
  //background-repeat: repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .platform-logo-box {
    position: absolute;
    top: 56px;
    left: 56px;

    & .platform-logo {
      width: 34px;
      height: 34px;
      vertical-align: middle;
    }

    & .platform-title {
      display: inline-block;
      color: #000000;
      font-weight: 500;
      line-height: 34px;
      font-size: 20px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      margin-left: 6px;
    }
  }

  .login-text {
    font-size: 72px;
    color: #fff;
    padding: 0 0 70px 0;
  }

  .login-box {
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    //width: 666px;
    width: 402px;
    border-radius: 8px;
    box-shadow: 0 2px 30px #5f6f7c17;
    //padding: 48px 28px;
    margin: 0 191px 0 297px;
  }
  .login-right {
    width: 264px;
    height: 100%;
    border: 0;
    border-radius: 8px 0 0 8px;
    background-color: #D5E5FF;
    display: flex;
    align-items: center;
    justify-content: center;
    .img-box {
      margin: 0 57px;
      width: 150px;
      height: 150px;
    }
  }
  .login-form {
    width: 402px;
    height: 100%;
    margin: 0 40px;
    padding: 40px 0;
    overflow: hidden;
  }
  .reset-form {
    width: 402px;
    height: 100%;
    margin: 0 40px;
    padding: 40px 0;
    overflow: hidden;
    .el-row {
      width: 100%;
    }
    .el-col-14 {
      :deep(.el-input__wrapper) {
        margin-right: 16px;
      }
    }
    .el-button {
      width: 100%;
    }
  }

  .login-btn {
    width: 100%;
    margin-bottom: 30px;
    margin-top: 16px
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .login-form-lable {
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    margin-bottom: 12px;
  }
  .svg-container {
    padding: 5px 10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 18px;
      line-height: 22px;
      color: #000000;
      font-weight: 500;
      margin: 0 auto 24px auto;
      text-align: center;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .captcha {
    position: absolute;
    right: 0;
    top: 0;

    img {
      height: 42px;
      cursor: pointer;
      vertical-align: middle;
    }
  }
}

.remember_paw{
  display: flex;
  align-items: center;
  justify-content: center;
  span{
    color: #1891FF;
    line-height: 32px;
    font-size: 14px;
    cursor: pointer;
  }
}

.login_select {
  span{
    color: #1891FF;
    line-height: 32px;
    font-size: 14px;
    cursor: pointer;
  }
}

.demo-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
}

.copyright-box {
  cursor:pointer;
  position: absolute;
  bottom: 36px;
  right: 60px;
  font-size: 16px;
}

@media(max-width:1600px) { // 当屏幕小于1600px时，执行下面css
  .login-text {
    font-size: 50px!important;
    color: #fff!important;
    padding: 0 0 30px 0!important;
  }
}
</style>


<!-- <template>
  <div class="login-container">
    <h1>中和万顺·出单平台</h1>
    <el-form
      label-position="top"
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      class="login-ruleForm"
    >
      <h4>登录</h4>
      <el-form-item label="域名 id" prop="companyDomain">
        <el-input v-model="ruleForm.companyDomain" />
      </el-form-item>
      <el-form-item label="手机号/邮箱" prop="userName">
        <el-input v-model="ruleForm.userName" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width: 270px"
          @click="submitForm(ruleFormRef)"
          >登 录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import useStore from '@/store';
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
// import { encryptByDES, decryptByDES } from '@/utils/crypto';
// import { localStorage } from '@/utils/storage';

const { user } = useStore();
const route = useRoute();
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  companyDomain: 'tccb',
  userName: '16600000000',
  password: '123456',
  sys: '统筹承保系统'
});
let redirect = '';
let otherQuery = {};
const rules = reactive<FormRules>({
  userName: [
    { required: true, message: '请输入手机号或邮箱', trigger: 'blur' }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
});

watch(
  route,
  () => {
    const query = route.query;
    if (query) {
      console.log('$$$$$');
      redirect = query.redirect as string;
      otherQuery = getOtherQuery(query);
    }
  },
  {
    immediate: true
  }
);
function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      user.login(ruleForm).then(() => {
        router.push({ path: '/'})
        // router.push({ path: redirect || '/',query: otherQuery });
        console.log('redirect',redirect)
      });
    } else {
      console.log('error submit!', fields);
    }
  });
};
</script>


<style lang="scss" scoped>
$bg: #fafafa;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  width: 100vw;
  height: 100vh;
  background: url('../../assets/cblogin-bg.png') no-repeat center;
  background-size: cover;
  position: relative;
  .login-ruleForm {
    position: absolute;
    right: 180px;
    top: 241px;
    width: 402px;
    height: 418px;
    padding: 40px 66px;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0px 0px 12px 4px rgba(34, 51, 74, 0.07);
    h4 {
      margin-bottom: 32px;
    }
  }
  h1 {
    position: absolute;
    top: calc(50% - 31px);
    left: 200px;
    font-size: 62px;
    color: #fff;
  }
}
</style> -->
