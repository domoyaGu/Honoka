<template>
  <el-dialog
    v-model="show"
    @close="close"
    title="积分调整"
    :width="520"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    style="border-radius: 5px;">
    <div>
      <div style="padding: 0 40px;">
        <div class="current-point">当前积分：<span>{{ userinfo.pointSum || 0 }}</span></div>
        <el-form
          :model="info"
          ref="formRef"
          :rules="formRules"
          label-position="top"
          :validate-on-rule-change="false"
          style="margin-top: 20px;">
          <el-form-item label=" " prop="operateSymbol">
            <el-radio-group v-model="info.operateSymbol">
              <el-radio label="add" border>增加</el-radio>
              <el-radio label="subtract" border>扣减</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="积分数" prop="pointOperateNum">
            <el-input size="large" type="number" v-model="info.pointOperateNum" placeholder="请输入积分数" clearable/>
          </el-form-item>
          <el-form-item :label="'积分' + (info.operateSymbol === 'add' ? '增加' : '扣减') + '原因'" prop="pointRecordReason">
            <el-input v-model="info.pointRecordReason" size="large" placeholder="请输入原因" clearable/>
          </el-form-item>
        </el-form>
      </div>
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
import { ElForm, ElMessage } from 'element-plus';
import { pointOperate } from '@/api/user';

// 父组件函数
const emits = defineEmits(['refresh'])

// 校验
const formRules = ref({
})

// 弹窗展示/隐藏
const show = ref(false)
// 表单内容
const info = ref({
  operateSymbol: 'add',
  pointOperateNum: '',
  pointRecordReason: ''
})
// 表单ref
const formRef = ref(ElForm)
// 用户信息
const userinfo = ref({} as UserInfo)

function close() {
  show.value = false
  info.value = {
    operateSymbol: 'add',
    pointOperateNum: '',
    pointRecordReason: ''
  }
}

// 打开弹窗
function open(data: UserInfo) {
  userinfo.value = data
  show.value = true
}

// 提交
function submit() {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 加载
      showLoading()
      // 调接口
      let params = { ...info.value, userId: userinfo.value.userId }
      pointOperate(params).then(() => {
        ElMessage.success('编辑成功')
        emits('refresh')
        show.value = false
        hideLoading()
      })
    }
  });
}

defineExpose({
  close,
  open
})

</script>

<style lang="scss" scoped>

.current-point {
  font-size: 14px;
  span {
  font-size: 16px;
  font-weight: bold;
  }
}

:deep(input::-webkit-outer-spin-button) {
  -webkit-appearance: none !important;
}
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none !important;
}
:deep(input[type='number']) {
  -moz-appearance: textfield;
}
</style>
