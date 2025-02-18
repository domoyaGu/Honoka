<template>
  <div class="app-wrapper">
    <div style="display: flex; height: 100%">
      <SubMenu :isCollapse="isCollapse"></SubMenu>
      <div class="main-content">
        <el-header class="app-header">
          <div class="display-flex-center">
            <img src="@/assets/header_back.svg" alt="" class="back_img" @click="back()"/>
            <breadcrumb />
          </div>
          <div class="header-avater">
            <el-avatar style="margin-right: 10px; width: 30px; height: 30px"
              ><img src="@/assets/my.png"
            /></el-avatar>
            <el-popover placement="bottom" title="" trigger="click" width="280">
              <template #reference>
                <span style="color: #000000; font-size: 14px; font-weight: 400"
                  >{{ userInfo.userName }}
                </span>
              </template>
              <div style="text-align: center">
                <el-button link type="danger" @click="logout"
                  >退出登录</el-button
                >
              </div>
            </el-popover>
          </div>
        </el-header>
        <div class="main_container">
          <div class="router_view">
            <router-view>
              <div class="router_view_content">
                <!-- 三级路由必须再套一层router-view,否则keep-alive不生效 -->
                <router-view v-slot="{ Component }">
                  <keep-alive>
                    <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive"/>
                  </keep-alive>
                  <component :is="Component" :key="$route.fullPath" v-if="!$route.meta.keepAlive"/>
                </router-view>
              </div>
            </router-view>
          </div>
        </div>
      </div>
    </div>
    <!-- <footer-info/> -->
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import useStore from '@/store';
import { KeepAlive } from 'vue';

const { user, refresh } = useStore();
// 用户信息，从store里取，不从loaclstorage里，避免缓存不清的情况切换账号会保留上个账号状态
const userInfo = user.userInfo;
const router = useRouter();
// 菜单折叠
const isCollapse = ref(false);

/**
 * 注销
 */
function logout() {
  ElMessageBox.confirm('确认退出登录？', '提示', {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning'
  }).then(() => {
    user.logout();
    router.push('/login');
  });
}

/**
 * 返回
 */
function back() {
  // 返回，并且不刷新上一页
  refresh.clear()
  router.go(-1)
}

</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  @include relative;
  .app-header {
    border-bottom: 1px solid #d8d8d8;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    .header-avater {
      display: flex;
      align-items: center;
    }
    .back_img {
      width: 18px;
      height: 18px;
      margin-right: 10px;
      cursor: pointer;
      // &:active {
      //   color: #000;
      // }
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
.main_container {
  display: flex;
  flex-direction: column;
  background: #f4f7f9;
  padding: 16px;
  height: 100%;
  width: 100%;
  .router_view {
    flex-grow: 1;
    .router_view_content {
      height: 100%;
    }
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
