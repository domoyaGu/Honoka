<template>
  <el-popover
    placement="bottom"
    title="操作"
    trigger="hover"
  >
    <template #reference>
      <el-icon class="icon-more">
        <MoreFilled />
      </el-icon>
    </template>
    <div class="pop-content">
      <div class="pop-item" v-for="(item, index) in operationList" @click="clickPopItem(item)">
        <el-button
          type="primary"
          link
          :icon="item['icon']"
        >
          {{item['text']}}
        </el-button>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { MoreFilled } from '@element-plus/icons-vue';
defineProps({
  operationList: {
    type: Array,
    default: []
  }
})

function clickPopItem(item) {
  item.clickFunc()
}

</script>

<style lang="scss" scoped>

// 样式穿透
:deep(.el-button) {
  &:hover {
    color: var(--el-color-primary);
  }
}

:deep(.el-popover .el-popper) {
  transition: opacity 0.5s ease 0s
}

.icon-more {
  margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
  color: var(--el-color-primary);
}

.pop-content {
  .pop-item {
    width: 100%;
    min-height: 28px;
    line-height: 30px;
    padding-left: 8px;
    cursor: pointer;
    &:hover {
      background-color: #E3F1FF;
      border-radius: 3px;
    }
  }
}
</style>
