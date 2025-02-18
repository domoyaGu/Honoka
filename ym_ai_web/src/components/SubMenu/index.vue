<template>
  <div class="menu_container">
    <div class="menu_logo display-flex-column-center">
      <img src="@/assets/my.png" />
      <span>智能风控</span>
    </div>
    <div class="menu_content">
      <div
        v-for="(item, index) in siderMenuList"
        :key="index"
        class="menu_item_container"
      >
        <div v-if="item.meta?.type == 'group'" class="menu_title">
          {{ item.meta?.title }}
        </div>
        <!-- 这边a标签可以支持一些默认打开链接 -->
        <a v-else :href="item.path" @click="clickA">
          <div
            class="menu_item"
            :class="{ menu_active: activeName == item.name }"
            @click="menuClick(item)"
          >
            <img v-show="activeName == item.name" :src="item.meta.activeIcon" />
            <img
              v-show="activeName != item.name"
              :src="item.meta.deActiveIcon"
            />
            <span class="item_title">
              <span>{{ item.meta?.title }}</span>
              <span
                :class="{ item_title_acitve: activeName == item.name }"
              ></span>
            </span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// import { permissionMenuList } from '@/router/menuRoutes';
import { useRouter } from 'vue-router';
import { initMenuList } from '@/router/index';
import useStore from '@/store';

const { refresh } = useStore()

// 当前选中的菜单
const activeName = ref('picture');

function clickA(e) {
  if (!isKeyDown) e.preventDefault();
}

// 菜单点击
function menuClick(item) {
  // 按键的情况下不跳转路由,打开新标签页
  if (!isKeyDown) {
    activeName.value = item.name;
    // 刷新列表页
    refresh.refresh()
    router.push(item.path);
  }
}

const router = useRouter();
const siderMenuList = ref([]);

// 处理菜单路由
function handleMenuRoute() {
  // siderMenuList.value = permissionMenuList[0].children.map(item => {
  //   return recursionMenu(item);
  // });
  // 菜单初始化
  let menuList = initMenuList()[0].children;
  menuList.forEach(child => {
    siderMenuList.value.push(child);
    if (child.children?.length > 0) {
      child.children.forEach(item => {
        if (item.meta.level === 2) siderMenuList.value.push(item)
      });
    }
  });
  // 选中的菜单
  activeName.value = router.currentRoute.value.name;
}

onMounted(() => {
  handleMenuRoute();
});

let isKeyDown = false;
document.onkeydown = () => {
  isKeyDown = true;
};
document.onkeyup = () => {
  isKeyDown = false;
};

// todo: 页面路由改变更改激活的菜单
</script>
<style lang="scss" scoped>
.menu_container {
  height: 100%;
  min-width: 272px;
  box-shadow: 4px 0 7px 0 #95959514;
  border-right: 1px solid #d8d8d8;
  background: #fafbfc;
  z-index: 1;
  .menu_logo {
    width: 100%;
    margin-top: 16px;
    img {
      width: 56px;
      height: 56px;
      border-radius: 17px;
      border: 1px solid #d8d8d8;
      box-shadow: 0 4px 3px 0 #0000000a;
    }
    span {
      color: #333333;
      font-size: 18px;
      font-weight: 600;
      margin-top: 15px;
    }
  }
  .menu_content {
    width: 100%;
    padding: 11px;
    .menu_item_container {
      .menu_title {
        width: 100%;
        margin-top: 20px;
        padding: 17px 17px 17px 20px;
        font-size: 14px;
        font-weight: 500;
        color: #999999;
      }
      .menu_item {
        width: 100%;
        height: 54px;
        padding-left: 16px;
        font-size: 16px;
        font-weight: 400;
        color: #676f7f;
        border-radius: 8px;
        display: flex;
        align-items: center;
        &:hover {
          background-color: #f0f5fc;
        }
        .item_title {
          flex-grow: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .item_title_acitve {
            width: 5px;
            height: 27px;
            border-radius: 4px;
            background-color: #2560d2;
          }
        }
        img {
          width: 34px;
          height: 34px;
          margin-right: 10px;
        }
      }
      .menu_active {
        color: #2560d2;
        background-color: #e6ecfc;
      }
    }
  }
}
</style>
