<template>
  <div class="app-wrapper">
    <el-container>
      <el-header class="app-header">
        <div style="line-height: 60px; display: flex; align-items: center;">
          <h3>测试</h3>
          <hamburger 
            id="hamburger-container"
            :is-active="!isCollapse"
            @toggle-click="clickHamburger()"/>
        </div>
        <div class="header-avater">
          <el-avatar style="margin-right: 10px;"><img src="@/assets/my.png"/></el-avatar>
          <el-popover
            placement="bottom"
            title=""
            trigger="click"
            width="280"
          >
            <template #reference>
              <span style="cursor: pointer;">
                Hi！{{ user?.userInfo?.userPhone }}
              </span>
            </template>
            <!-- <div class="pop-content">
              <p>手机号：{{ user?.userInfo?.userPhone || '--' }}</p>
              <p>邮箱：{{ user?.userInfo?.userEmail || '--' }}</p>
            </div> -->
            <div style="text-align: center;">
              <el-button link type="danger" @click="logout">退出登录</el-button>
            </div>
          </el-popover>
        </div>
      </el-header>
      <div>
          <el-menu
            :default-active="router.currentRoute.value.meta.activateMenu"
            :class="isCollapse ? 'menu-collapse-width' : 'menu-width'"
            :style="'height: calc(100vh - 60px);position: fixed;transition: width .25s;overflow: hidden;--icon-display:' 
              + (isCollapse ? 'none' : 'initial')"
          >
            <el-menu-item index="/home" @click="menuSelect">
                <el-icon><House /></el-icon>
                <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/user" @click="menuSelect">
                <el-icon><User /></el-icon>
                <span style="width: 100px;">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/car" @click="menuSelect">
                <el-icon><Setting /></el-icon>
                <span style="width: 100px;">车辆管理</span>
            </el-menu-item>
          </el-menu>
        <div :class="'main-container ' + (isCollapse ? 'main-collapse-container' : '')">
          <breadcrumb/>
          <router-view v-slot="{ Component }">
            <div v-show="$route.meta.level === 1">
              <keep-alive>
              <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive"/>
              </keep-alive>
              <component :is="Component" :key="$route.fullPath" v-if="!$route.meta.keepAlive"/>
            </div>
            <div  v-show="$route.meta.level === 2"><router-view/></div>
          </router-view>
        </div>
      </div>
    </el-container>
    
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import useStore from '@/store';
import { Document, House, Setting, Upload, User } from '@element-plus/icons-vue'

const { user } = useStore()
const activateMenu = ref()

function menuSelect(item) {
  router.push({ path: item.index })
}

// 菜单折叠
const isCollapse = ref(false)

function logout() {
  ElMessageBox.confirm(
    '确认退出登录？',
    '提示',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
    }
  ).then(() => {
    user.logout()
    router.push('/login')
  })
}
// 菜单展开收起
function clickHamburger() {
  isCollapse.value = !isCollapse.value
}

</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  @include relative;
  .app-header {
    border-bottom: 1px solid #f4f6fa;
    display: flex;
    justify-content: space-between;
    .header-avater {
      display: flex;
      align-items: center;
    }
  }
}

.pop-content {
  padding: 18px 10px;
  border-bottom: 1px solid #f3f3f3;
  p {
    padding: 5px 0;
  }
}
.menu-width {
  width: 180px;
}
.menu-collapse-width {
  width: 56px;
}
.main-container {
  display: inline-block;
  width: calc(100% - 180px);
  background-color: #f5f5fc;
  padding: 10px;
  height: calc(100vh - 60px);
  margin-left: 180px;
  overflow: auto;
  transition: 0.28s;
  position: fixed;
}
.main-collapse-container {
  width: calc(100% - 56px);
  margin-left: 56px;
}

:deep(.el-menu-item .el-icon) {
  margin-right: 12px;
}
:deep(.el-sub-menu .el-sub-menu__icon-arrow) {
  display: var(--icon-display);
}
</style>
