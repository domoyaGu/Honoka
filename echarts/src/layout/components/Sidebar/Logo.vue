<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo"  alt=""/>
        <h1 v-else class="sidebar-title">瀚远·OA</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo"  alt=""/>
        <h1 class="sidebar-title">{{ state.logoInfo.companyShowName }}<br/>{{ state.logoInfo.companyEnglishName }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, toRefs} from 'vue';
import useStore from '@/store';
import { isNotNull } from '@/utils/validate';

const { user } = useStore()

const props = defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
});

const state = reactive({
  isCollapse: props.collapse,
  logo: new URL(`../../../assets/my.png`, import.meta.url).href,
  logoInfo: {
    companyShowName: '瀚远·OA',
    companyEnglishName: 'HAN YUAN OA'
  }
});

const { logo } = toRefs(state);

onMounted(() => {
  const { companyShowName, companyEnglishName, urlThumb } = user.userInfo
  // console.log(companyShowName, companyEnglishName, fileName)
  isNotNull(companyShowName) && (state.logoInfo.companyShowName = companyShowName)
  isNotNull(companyEnglishName) && (state.logoInfo.companyEnglishName = companyEnglishName)
  isNotNull(urlThumb) && (state.logo = urlThumb)
});
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 63px;
  line-height: 63px;
  background: #2a63f6;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      color: #ffffff;
      font-weight: 500;
      line-height: 50px;
      font-size: 14px;
      line-height: 24px;
      // font-family: DINCondensed-Bold;
      font-family: PingFangSC-Medium;
      vertical-align: middle;
      margin-left: 12px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
