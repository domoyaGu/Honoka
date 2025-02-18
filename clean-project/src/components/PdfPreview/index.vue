<template>
  <div class="pdf-preview">
    <vue-pdf-embed
      :source="state.source"
      class="vue-pdf-embed"
      :page="state.pageNum"
    />
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';
import { createLoadingTask } from 'vue3-pdfjs/esm'; // 获得总页数
const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  }
});
const state = reactive({
  source: props.pdfUrl,
  pageNum: 1, //当前页面
  scale: 1, // 缩放比例
  numPages: 0 // 总页数
});
onMounted(() => {
  const loadingTask = createLoadingTask(state.source);
  loadingTask.promise.then((pdf: { numPages: number }) => {
    state.numPages = pdf.numPages;
  });
});
</script>
<style lang="css" scoped>
.pdf-preview {
  position: relative;
  /* height: 100vh;
    padding: 20px 0; */
  box-sizing: border-box;
  background-color: e9e9e9;
}
.pdf-wrap {
  overflow-y: auto;
}
.vue-pdf-embed {
  text-align: center;
  width: 100%;
  border: 1px solid #e5e5e5;
  margin: 0 auto;
  box-sizing: border-box;
  /* canvas {
    width: 100%;
    height: 100%;
  } */
}

.page-tool {
  position: absolute;
  bottom: 35px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  background: rgb(66, 66, 66);
  color: white;
  border-radius: 19px;
  z-index: 100;
  cursor: pointer;
  margin-left: 50%;
  transform: translateX(-50%);
}
.page-tool-item {
  padding: 8px 15px;
  padding-left: 10px;
  cursor: pointer;
}
</style>
