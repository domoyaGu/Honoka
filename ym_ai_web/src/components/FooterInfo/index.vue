<template>
  <div class="footer_info">
    <!-- <el-divider /> -->
    <div class="footer_content">
      <el-link
        href="https://beian.miit.gov.cn/"
        target="_blank"
        type="default"
        :underline="false"
        >沪ICP备19018810号-2</el-link
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.footer_info {
  width: 80%;
  margin: 0 auto;
  padding: 10px 0;
  .footer_content {
    padding: 0 20px;
    display: flex;
    flex-direction: row-reverse;
  }
}
:deep(.el-divider--horizontal) {
  margin: 0 0 10px 0;
}
</style>
