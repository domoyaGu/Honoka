<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <Sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <!-- <tags-view v-if="needTagsView" /> -->
      </div>
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <app-main />
<!--      <RightPanel v-if="showSettings">-->
<!--        <settings />-->
<!--      </RightPanel>-->
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件依赖
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import { computed, watchEffect } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { AppMain, Navbar, TagsView } from './components/index'; // Settings
import Sidebar from './components/Sidebar/index.vue';
// import RightPanel from '@/components/RightPanel/index.vue';

import useStore from '@/store';

const { width } = useWindowSize();
const WIDTH = 992;

const { app, setting } = useStore();

const sidebar = computed(() => app.sidebar);
const device = computed(() => app.device);
const needTagsView = computed(() => setting.tagsView);
const fixedHeader = computed(() => setting.fixedHeader);
// const showSettings = computed(() => setting.showSettings);

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}));

watchEffect(() => {
  if (width.value < WIDTH) {
    app.toggleDevice('mobile');
    app.closeSideBar(true);
  } else {
    app.toggleDevice('desktop');
  }
});

function handleClickOutside() {
  app.closeSideBar(false);
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variables.module.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.breadcrumb-container {
    float: left;
  }

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 84px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
