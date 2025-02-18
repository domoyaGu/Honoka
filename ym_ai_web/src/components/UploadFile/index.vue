<template>
  <div style="display: flex">
    <div v-for="item in dataList" :key="item.url" class="div-img">
      <PdfPreview
        v-if="item.url.indexOf('.pdf') != -1"
        :pdfUrl="item.url"
        @click="viewPdf(item.url)"
        style="width: 100%; height: 100%"
      />
      <el-image
        v-else
        style="width: 100%; height: 100%"
        :src="item.url"
        :preview-src-list="[item.url]"
        :initial-index="4"
        fit="cover"
      />
      <div v-if="!isDisabled" class="operation" @click="deleteImg(item)">
        删除
      </div>
    </div>
    <el-upload
      v-if="dataList.length < limit && !isDisabled"
      class="avatar-uploader"
      action="#"
      multiple
      :show-file-list="false"
      :on-remove="handleRemove"
      :http-request="progressImg"
      :on-exceed="errUpload"
    >
      <div class="icon-class">
        <el-icon><Plus /></el-icon>
        <p style="font-size: 14px; width: 100%">{{ describe }}</p>
      </div>
    </el-upload>
  </div>
  <!--    pdf预览-->
  <div v-if="isViewPdf" class="pdf-div" @click="closePdf">
    <div
      style="
        width: 100%;
        height: 20px;
        padding-top: 60px;
        padding-right: 60px;
        text-align: right;
      "
    >
      <!-- <p class="arrow" style="text-align: center; color: #FFFFFF; margin-bottom: 16px">
        <span class="turn" style="cursor: pointer" :class="{grey: currentPageNum==1}" @click.stop="changePdfPage(0)">上一页</span>
        {{ currentPageNum }} / {{ pageCountNum }}
        <span class="turn" style="cursor: pointer" :class="{grey: currentPageNum==pageCountNum}" @click.stop="changePdfPage(1)">下一页</span>
      </p>
      <i style="font-size: 32px;color: #fff; cursor: pointer" class="el-icon-circle-close" /> -->
      <div
        style="
          color: #fff;
          font-size: 28px;
          width: 38px;
          height: 38px;
          float: right;
          margin-right: 20px;
          cursor: pointer;
        "
      >
        <svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          data-v-029747aa=""
        >
          <path
            fill="currentColor"
            d="m466.752 512-90.496-90.496a32 32 0 0 1 45.248-45.248L512 466.752l90.496-90.496a32 32 0 1 1 45.248 45.248L557.248 512l90.496 90.496a32 32 0 1 1-45.248 45.248L512 557.248l-90.496 90.496a32 32 0 0 1-45.248-45.248L466.752 512z"
          ></path>
          <path
            fill="currentColor"
            d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"
          ></path>
        </svg>
      </div>
    </div>
    <div
      style="background-color: #fff; width: 50%; height: 80%"
      @click.stop="
        () => {
          isViewPdf = true;
        }
      "
    >
      <PdfPreview :pdfUrl="pdfUrl" style="width: 100%; height: 100%" />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Plus } from '@element-plus/icons-vue';
import { localStorage } from '@/utils/storage';
import { imgDistinguish } from '@/api/common';
import { ElLoading } from 'element-plus';

import { ElMessage, ElUpload, UploadRequestOptions } from 'element-plus';

const emit = defineEmits(['deleteImg', 'imgDatapath', 'imgDataInfo']);

const props = defineProps({
  dataList: {
    type: Array as any,
    default: function () {
      return [];
    }
  },
  limit: {
    type: Number,
    default: 10
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  describe: {
    type: String,
    default: ''
  },
  imageMaximumSize: {
    type: Number,
    default: 1024 * 1024 * 5
  }
});

// 文件上传加载动画
const loadingInstance: any = ref('');
const openLoading = () => {
  loadingInstance.value = ElLoading.service({
    lock: true,
    text: '正在加载',
    background: 'hsla(0,0%,100%,.3)'
  });
};
const closeLoading = () => {
  loadingInstance.value.close();
};

const pdfLoadingLoading = ref(false);
const isViewPdf = ref(false);
const pdfUrl = ref('');
const pageCountNum = ref(0); // pdf文件总页数
const currentPageNum = ref(0); // pdf文件页码

// 文件上传
const progressImg = (options: UploadRequestOptions): any => {
  openLoading();
  const formData = new FormData();
  formData.append('file', options.file);
  // 判断扩展名
  const fileInfo = options.file;
  const tmpcnt = fileInfo.name.lastIndexOf('.');
  const exname = fileInfo.name.substring(tmpcnt + 1);
  const names = ['pdf', 'jpg', 'png', 'jpeg', 'ico', 'svg'];
  // 判断文件格式
  if (names.indexOf(exname) < 0) {
    ElMessage.error('上传文件的格式不支持');
    closeLoading();
    return;
  }
  // 判断文件大小
  if (options.file.size > props.imageMaximumSize) {
    if (props.imageMaximumSize === 1024 * 1024 * 5) {
      ElMessage.error('上传文件的大小不能超过5M');
    } else if (props.imageMaximumSize === 1024 * 1024 * 3) {
      ElMessage.error('上传文件的大小不能超过3M');
    }
    closeLoading();
    return;
  }
  axios
    .post('/upload/file', formData, {
      headers: {
        token: localStorage.get('token'),
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res: any) => {
      closeLoading();
      if (res.data.code == 0) {
        const url = res.data.data;
        pdfUrl.value = url;
        emit('imgDatapath', url);
      } else {
        ElMessage.error(`${res.msg}`);
      }
    })
    .catch(error => {
      closeLoading();
      console.log(error);
      ElMessage.error('文件上传失败');
    });
};

// 打开PDF
function viewPdf(url) {
  if (pdfUrl.value != url) pdfUrl.value = url;
  isViewPdf.value = true;
  pdfLoadingLoading.value = true;
}

// 关闭PDF
function closePdf() {
  isViewPdf.value = false;
}

// 删除文件
function deleteImg(value) {
  emit('deleteImg', value);
}

// 限制文件上传数报错
function errUpload() {
  ElMessage.error(`文件限制${props.limit}张,请重新上传`);
}

// pdf加载时
function loadPdfHandler(e) {
  currentPageNum.value = 1; // 加载的时候先加载第一页
}

// 改变PDF页码
function changePdfPage(val) {
  isViewPdf.value = true;
  // console.log(val)
  if (val === 0 && currentPageNum.value > 1) {
    currentPageNum.value--;
    // console.log(this.currentPageNum)
  }
  if (val === 1 && currentPageNum.value < pageCountNum.value) {
    currentPageNum.value++;
    // console.log(this.currentPageNum)
  }
}

// 删除图片
function handleRemove(fileUrl) {
  console.log('删除图片');
}
</script>

<style lang="scss" scoped>
img {
  padding: 0;
  margin: 0;
}
.el-image {
  width: 100%;
  height: 100%;
}
.el-dialog,
:deep(.el-upload--picture-card) {
  width: 120px;
  height: 88px;
  line-height: 88px;
}
:deep(.el-upload-list) {
  li {
    width: 120px;
    height: 88px;
  }
}
.div-img {
  margin-right: 30px;
  width: 120px;
  height: 88px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.operation {
  position: absolute;
  cursor: pointer;
  left: 0;
  bottom: 0;
  height: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #ff4d4f;
  width: 100%;
  text-align: center;
  line-height: 36px;
  font-size: 14px;
  overflow: hidden;
}

.div-img:hover {
  .operation {
    transition: all 150ms;
    height: 36px;
  }
}

.pdf-div {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow-y: scroll;
}

.icon-class {
  font-size: 28px;
  width: 128px;
  height: 88px;
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  border: 1px dashed #dcdfe6;
  color: #dcdfe6;
  p {
    text-align: center;
  }
}
</style>
