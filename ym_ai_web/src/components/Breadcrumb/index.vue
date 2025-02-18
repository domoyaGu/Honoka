<template>
  <div v-for="(item, index) in breadcrumbs" :key="item.path" class="breadcrumbs_title">
    <!-- 不可跳转的标题路由 -->
    <span v-if="item.meta.type === 'group'">{{
      item.meta.title
    }}</span>
    <!-- 可实际跳转的路由 -->
    <a v-else-if="index < breadcrumbs.length - 1" @click.prevent="handleLink(item)" class="a_title">
      {{ item.meta?.title }}
    </a>
    <!-- 当前路由 -->
    <span v-else class="cur_title">
      {{ item.meta?.title }}
    </span>
    <span class="separate_icon" v-show="index < breadcrumbs.length - 1">/</span>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { compile } from 'path-to-regexp';
import router from '@/router';

const currentRoute = useRoute();
const pathCompile = (path: string) => {
  const { params } = currentRoute;
  const toPath = compile(path);
  return toPath(params);
};

const breadcrumbs = ref([] as Array<any>);

function getBreadcrumb() {
  let matched = [];
  // 目前路由是动态的，没有子路由的设定，因此三级的面包屑会有问题
  // 因此从面包屑历史中匹配
  // 跳转详情页的情况
  matched = currentRoute.matched.filter(item => item.meta && item.meta.title);
  if (currentRoute.meta.parentPath) {
    breadcrumbs.value = matched.filter(item => {
      return item.meta && item.meta.title && item.path !== currentRoute.path
    });
    console.log(breadcrumbs.value);
    
    breadcrumbs.value.push({
      path: currentRoute.meta.parentPath as string,
      meta: {
        type: 'item',
        title: currentRoute.meta.parentTitle
      }
    })
    breadcrumbs.value.push(currentRoute)
  } else {
    breadcrumbs.value = matched.filter(item => {
      return item.meta && item.meta.title
    });
  }
}

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

.breadcrumbs_title {
  color: #969799;
  font-size: 14px;
  font-weight: 400;
  font-family: "PingFang SC";
  text-align: left;
  line-height: 20px;
  cursor: text;
  .a_title {
    cursor: pointer;
    &:hover {
      color: #0A0A0A;
    }
  }
  .cur_title {
    color: #000;
  }
  .separate_icon {
    padding: 0 8px;
  }
}

</style>
