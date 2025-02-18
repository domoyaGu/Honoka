<template>
  <el-config-provider>
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';

window.onload = window.onresize = () => {
  // 适配屏幕大小，1920分辨率以下自动缩放页面
  let zoom = Math.min(
    window.innerWidth > 1920 ? 1 : window.innerWidth / 1920,
    window.innerHeight > 1080 ? 1 : window.innerHeight / 1080
  );
  document.body.style['zoom'] = Math.max(0.7, zoom);
};
</script>
