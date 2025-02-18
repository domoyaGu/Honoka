<template>
  <el-dialog
    v-model="show"
    @close="close"
    :title="userinfo.userId ? '编辑用户' : '新增用户'"
    :width="520"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    style="border-radius: 5px;">
    <div style="padding: 0 40px;">
      <el-form :model="userinfo"
        ref="userFormRef"
        :rules="formRules"
        label-position="top"
        :validate-on-rule-change="false"
        style="margin-top: 15px;">
        <el-form-item label="昵称" prop="userName">
          <el-input v-model="userinfo.userName" size="large" placeholder="请输入昵称" clearable/>
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="userinfo.userPhone" size="large" placeholder="请输入手机号" clearable/>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userinfo.userEmail" size="large" placeholder="请输入邮箱" clearable/>
        </el-form-item>
        <el-form-item label="密码" prop="userPwd">
          <el-button v-show="!showPwd" link type="primary" @click="changeRules(true)">修改密码</el-button>
          <div style="display: flex; width: 100%;">
            <span style="flex-grow: 1;">
              <el-input v-show="showPwd" v-model="userinfo.userPwd" type="password" size="large" placeholder="请输入密码" clearable/>
            </span>
            <el-button v-show="showPwd && userinfo.userId" link type="danger" @click="changeRules(false)" style="margin-left: 8px;">
              取消修改
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="userStatus">
          <div style="width: 100%;">
            <el-select
              v-model="userinfo.userStatus"
              placeholder="请选择"
              size="large"
            >
              <el-option
                v-for="(value,key) in ['正常', '锁定']"
                :key="key"
                :value="key"
                :label="value"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { UserInfo } from '@/types/common'; 
import { hideLoading, showLoading } from '@/utils/loading';
import { isNotNull, regRule } from '@/utils/validate';
import { ElForm, ElMessage } from 'element-plus';
import { addUser, editUser } from '@/api/user'

// 父组件函数
const emits = defineEmits(['refresh'])

// 密码校验
function validatePassword(rule: any, value: any, callback: any) {
  if (!value || value.length < 6) {
    callback(new Error('密码不能少于六位'));
  } else {
    callback();
  }
}
// 校验
const formRules = ref({
  userPhone: [
    { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
    { pattern: regRule('phone'), message: '请输入正确的手机号码', trigger: ['blur'] }
  ],
  userName: [
    { required: true, message: '昵称不能为空', trigger: ['blur', 'change'] }
  ],
  userEmail: [
    { required: true, message: '邮箱不能为空', trigger: ['blur', 'change'] },
    { pattern: regRule('email'), message: '请输入正确的邮箱', trigger: ['blur'] }
  ],
  userPwd: []
})

// 修改密码切换
const showPwd = ref(false)

// 修改密码规则添加
function changeRules(isShowPwd) {
  showPwd.value = isShowPwd
  formRules.value.userPwd = isShowPwd ? [
    { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
    { required: true, trigger: 'blur', validator: validatePassword }
  ] : [];
  // 清空密码校验
  if (!isShowPwd) userFormRef.value.clearValidate('userPwd')
}

// 弹窗展示/隐藏
const show = ref(false)
// 表单内容
const userinfo = ref({} as UserInfo)
// 表单ref
const userFormRef = ref(ElForm)

function close() {
  show.value = false
  showPwd.value = false
  userinfo.value = {} as UserInfo
}

function open(info: UserInfo) {
  userinfo.value = JSON.parse(JSON.stringify(info))
  userinfo.value.userPwd = ''
  show.value = true
  // 新增的情况
  const isNew = !isNotNull(userinfo.value.userId)
  showPwd.value = isNew;
  formRules.value.userPwd = isNew ?[
    { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
    { required: true, trigger: 'blur', validator: validatePassword }
  ] : []
  userFormRef.value.clearValidate()
}

// 提交
function submit() {
  userFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 加载
      showLoading()
      const params = { ...userinfo.value }
      delete params.createTime
      delete params.updateTime
      delete params.updateBy
      delete params.userPwdSalt
      // 修改密码必须用户打开才传值
      if (!showPwd.value) {
        params.userPwd = ""
      }
      // 接口新增和保存分开的
      if (userinfo.value.userId) {
        editUser(params).then(() => {
          ElMessage.success('编辑成功')
          emits('refresh')
          show.value = false
        }).finally(() => hideLoading())
      } else {
        addUser(params).then(() => {
          ElMessage.success('新增成功')
          emits('refresh')
          show.value = false
        }).finally(() => hideLoading())
      }
    }
  });
}

defineExpose({
  close,
  open
})

</script>

<style lang="scss" scoped>
.el-select--large {
  width: 100%;
}
</style>
