<template>
  <div style="display: flex; flex-direction: column;height: calc(100% - 30px);">
    <div class="title-container">
      <el-row align="middle" style="margin-bottom: 10px;">
        <span style="margin-right: 10px;font-size: 16px;">{{ info.userName }}</span>
        <span class="user-status" :style="'background-color:' + status.userStatusEnum[info.userStatus]?.spot">
          {{ status.userStatusEnum[info.userStatus]?.text }}
        </span>
      </el-row>
      <el-row>
        <el-col :span="6"><DetailItem position="left" :item="{title: '用户ID', content: info.userId, type: 'input'}"/></el-col>
        <el-col :span="6"><DetailItem position="left" :item="{title: '注册时间', content: info.createTime, type: 'input'}"/></el-col>
      </el-row>
    </div>
    <div class="title-container" style="flex-grow: 1;">
      <div class="title">
        <span style="margin-right: 5px;">基 本 信 息</span>
        <span><el-button link type="primary" :icon="Edit" @click="openEditDialog"/></span>
      </div>
      <div>
        <DetailItem position="left" :item="{title: '昵称', content: info.userName, type: 'input'}"/>
        <DetailItem position="left" :item="{title: '手机号', content: info.userPhone, type: 'input'}"/>
        <DetailItem position="left" :item="{title: '邮箱', content: info.userEmail, type: 'input'}"/>
        <DetailItem v-if="!info.isAdmin" position="left" :item="{title: '剩余积分', content: info.pointSum, type: 'input'}">
          <template #suffix>
            <el-button v-if="info.pointSum" link type="primary" :icon="Edit" @click="openPointEditDialog"/>
          </template>
        </DetailItem>
        <!-- <DetailItem v-if="!info.isAdmin" position="left" :item="{title: '累计获得积分', content: info.pointSurplus, type: 'input'}"/> -->
      </div>
    </div>
    <UserEdit ref="editDialogRef" @refresh="getUserDetail"/>
    <PointEdit ref="pointDialogRef" @refresh="getUserDetail"/>
  </div>
</template>

<script lang="ts" setup>
import { getDetail } from '@/api/user'
import { UserInfo } from '@/types/common'
import { status } from '@/utils/status'
import { Edit } from '@element-plus/icons-vue'

const route = useRoute()

// 页面所有数据
const info = ref({} as UserInfo)

onMounted(() => {
  getUserDetail()
})

// 获取用户信息
function getUserDetail() {
  getDetail({ userId: route.query.id }).then(({ data }) => {
    info.value = data
  })
}

// 编辑弹窗
const editDialogRef = ref()
function openEditDialog() {
  editDialogRef.value.open(info.value)
}
// 积分编辑弹窗
const pointDialogRef = ref()
function openPointEditDialog() {
  pointDialogRef.value.open(info.value)
}

</script>

<style lang="scss" scoped>

</style>
