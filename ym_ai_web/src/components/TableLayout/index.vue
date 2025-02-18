<template>
  <!-- 一览专用 -->
  <div class="table_layout">
    <div class="filter_style">
      <slot name="segmenttop"></slot>
    </div>
    <div class="table_style">
      <slot name="table"></slot>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.table_layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  .table_style {
    flex-grow: 1;
  }
}
</style>
