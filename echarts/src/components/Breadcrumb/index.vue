<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="app-breadcrumb" >
    <i class="el-icon-house" style="color:#909399;margin-right: 6px;"></i>
    <!-- <transition-group name="breadcrumb"> -->
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span
          v-if="
            item.redirect === 'noredirect' || index === breadcrumbs.length - 1
          "
          class="no-redirect"
          >{{ generateTitle(item.meta.title) }}</span
        >
        <a v-else @click.prevent="handleLink(item)">
          {{ generateTitle(item.meta.title) }}
        </a>
      </el-breadcrumb-item>
    <!-- </transition-group> -->
  </el-breadcrumb>
</template>

<script setup lang="ts">
// import { onBeforeMount, ref, watch } from 'vue';
import { useRoute, RouteLocationMatched } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue'
import { compile } from 'path-to-regexp';
import router from '@/router';
import { generateTitle } from '@/utils/i18n';

const currentRoute = useRoute();
const pathCompile = (path: string) => {
  const { params } = currentRoute;
  const toPath = compile(path);
  return toPath(params);
};

const breadcrumbs = ref([] as Array<RouteLocationMatched>);

function getBreadcrumb() {
  let matched = []
  // 目前路由是动态的，没有子路由的设定，因此三级的面包屑会有问题
  // 因此从面包屑历史中匹配
  // 逻辑：当前活动菜单路由 == 历史路由
  // 如果是三级路由
  // if (breadcrumbs.value && breadcrumbs.value.length == 2
  //     && currentRoute.matched && currentRoute.matched.length == 2
  //       && currentRoute.matched[1].meta.activeMenu == breadcrumbs.value[1].path) {
  //   // 第一级
  //   matched.push(currentRoute.matched[0])
  //   // 第二级(格式化成对象)
  //   // matched.push(JSON.parse(JSON.stringify(breadcrumbs.value[1])))
  //   // 取第三级
  //   matched.push(currentRoute.matched[1])
    
  // } else {
  //   matched = currentRoute.matched.filter(
  //     item => item.meta && item.meta.title
  //   );
  // }
  matched = currentRoute.matched.filter(
    item => item.meta && item.meta.title
  );
  breadcrumbs.value = matched.filter(item => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false;
  });
  
}

// function isDashboard(route: RouteLocationMatched) {
//   const name = route && route.name;
//   if (!name) {
//     return false;
//   }
//   return (
//     name.toString().trim().toLocaleLowerCase() ===
//     'Dashboard'.toLocaleLowerCase()
//   );
// }

function handleLink(item: any) {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect).catch(err => {
      console.warn(err);
    });
    return;
  }
  router.push(pathCompile(path)).catch(err => {
    console.warn(err);
  });
}

watch(
  () => currentRoute.path,
  path => {
    if (path.startsWith('/redirect/')) {
      return;
    }
    getBreadcrumb();
  }
);

onBeforeMount(() => {
  getBreadcrumb();
});
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a.el-breadcrumb__inner.is-link  {
  font-weight: 400 !important;
}
.app-breadcrumb{
  :deep(.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link){
    color: #909399;
  }
  a:hover{
    color: #409eff;
  }
}

.app-breadcrumb.el-breadcrumb {
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
  line-height: 14px;
  padding-left: 8px;
  padding-top: 16px;
  background-color: #f3f4f9;
  .no-redirect {
    color: #131414;
    cursor: text;
  }
}
</style>
