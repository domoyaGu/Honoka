<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect" style="margin-right: 16px" />
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img src="@/assets/my.png" class="user-avatar"  alt=""/>
          <div class="avatar-name">{{ user.userInfo.name }}</div>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <div class="header-info">
              <div class="info-attr" @click="router.push({ path: '/aa' })">
                <img v-if="sysInfo.headUrl" class="i-avatar" :src="sysInfo.headUrl" alt="">
                <img v-else class="i-avatar" src="../../assets/my.png" alt="">
              </div>
              <div class="info-cont">
                <div class="each"><span class="e-name">我的姓名：</span><span class="e-content">{{ isEmpty(sysInfo.name) }}</span></div>
                <div class="each"><span class="e-name">公司名称：</span><span class="e-content">{{ isEmpty(sysInfo.companyName) }}</span></div>
                <div class="each"><span class="e-name">我的部门：</span><span class="e-content">{{ isEmpty(sysInfo.deptName) }}</span></div>
                <div class="each"><span class="e-name">我的角色：</span><span class="e-content">{{ isEmpty(sysInfo.roleName) }}</span></div>
                <div class="each"><span class="e-name">手机号码：</span><span class="e-content">{{ isEmpty(sysInfo.phone) }}</span></div>
                <div class="each"><span class="e-name">电子邮箱：</span><span class="e-content">{{ isEmpty(sysInfo.email) }}</span></div>
              </div>
<!--              <router-link to="/">-->
<!--                <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>-->
<!--              </router-link>-->
              <el-dropdown-item divided @click="logout" style="color: #F43535">
                <i-ep-switch-button class="v-icon" style="margin-right: 8px" />
                退出登录
                <!-- {{ $t('navbar.logout') }} -->
              </el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import useStore from '@/store';
// 组件依赖
import Hamburger from '@/components/Hamburger/index.vue';
import Screenfull from '@/components/Screenfull/index.vue';
// import SizeSelect from '@/components/SizeSelect/index.vue';
// import LangSelect from '@/components/LangSelect/index.vue';

const { app, tagsView, user } = useStore();
const sysInfo = user.userInfo

const route = useRoute();
const router = useRouter();

const sidebar = computed(() => app.sidebar);
const device = computed(() => app.device);
// const avatar = computed(() => user.avatar);

function isEmpty(val) {
  return val == null || val == '' || val == undefined || val == [] ? '- - -' : val
}

function toggleSideBar() {
  app.toggleSidebar();
}

function logout() {
  ElMessageBox.confirm('确定退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    user.logout()
    tagsView.delAllViews();
    router.push(`/login`);
  }).catch(()=>{});
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  //box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }



  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        //margin-top: 5px;
        position: relative;
        display: flex;
        flex-direction: row;

        .user-avatar {
          margin: 5px;
          cursor: pointer;
          width: 40px;
          height: 40px;
          //border-radius: 10px;
          border-radius: 50%;
        }
        .avatar-name {
          font-weight: 400;
          font-size: 14px;
          line-height: 50px;
          margin-left: 12px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.header-info{
  width: 300px;
  min-height: 340px;
  padding: 26px 16px 18px;
  box-sizing: border-box;
  position: relative;
  font-size: 14px;
  .info-attr{
    text-align: center;
    margin-bottom: 26px;
    cursor: pointer;
    .i-avatar{
      display: inline-block;
      width: 50px;
      height: 50px;
      border-radius: 100%;
      border: 2px solid #409EFF;
    }
  }
  .info-cont{
    width: 100%;
    .each{
      width: 100%;
      margin-bottom: 12px;
      overflow: hidden;
      .e-name{
        color: #666;
        width: 72px;
        display: inline-block;
        float: left;
      }
      .e-content{
        color: #444;
        width: 186px;
        display: inline-block;
        float: left;
      }
    }
  }
  .info-btn{
    width: 100%;
    //position: absolute;
    //left: 0;
    //bottom: 20px;
    margin-top: 46px;
    .btn{
      display: inline-block;
      margin: 0 18px;
    }
  }
}
</style>
