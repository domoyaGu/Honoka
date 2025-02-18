<template>
  <el-config-provider>
    <router-view/>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ElConfigProvider } from 'element-plus';


// 导入 Element Plus 语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';

// const { app } = useStore();

// const language = computed(() => app.language);
// const size: any = computed(() => app.size);

const locale = ref();

</script>

<style scoped>
</style>
