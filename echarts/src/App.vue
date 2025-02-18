<template>
  <el-config-provider :locale="locale" :size="size">
    <router-view v-if="isRouteActive"/>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, ref, watch, provide, nextTick } from 'vue';
import { ElConfigProvider } from 'element-plus';

import useStore from '@/store';

// 导入 Element Plus 语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';

// 网站title(根据接口配置)
import { getCompanyName } from '@/api/common'

// 刷新页面
const isRouteActive = ref(true);
provide('reload', ()=>{
	isRouteActive.value = false;
	nextTick(()=>{
		isRouteActive.value = true;
	})
})

const { app } = useStore();

const language = computed(() => app.language);
const size: any = computed(() => app.size);

const locale = ref();
document.title = '瀚远·OA'

// 网站title和图标
// getCompanyName().then(({ data }) => {
//   document.title = (data.companyShowName || '易统筹') + '·理赔平台'
//   // 图标
//   data.urlThumb && (document.querySelector('link[rel="icon"]')['href'] = data.urlThumb);
// })

watch(
  language,
  value => {
    locale.value = value == 'en' ? en : zhCn;
  },
  {
    // 初始化立即执行
    immediate: true
  }
);

// const router = useRoute()
// watch(
//   router,
//   value => {
//     // console.log("router", value);
//     // 获取路由
//     // permission.getResource().then(({ accessRoutes }) => {
//     //   if (accessRoutes.length) {
//     //         accessRoutes.forEach((route: any) => {
//     //           route.addRoute(route);
//     //         });
//     //       }
//     // })
//   },
//   {
//     deep: true
//   }
// );

</script>
