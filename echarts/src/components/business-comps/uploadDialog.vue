<template>
  <el-dialog
    title="附件信息"
    v-bind="$attrs"
    v-model="show"
    @close="close"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    >
    <div v-loading="loading">
      <el-tabs type="border-card">
        <el-tab-pane v-for="uploadType in uploadTypeList" :label="uploadType.dictName">
          <div style="min-height: 500px;">
            <el-tabs tab-position="left" >
              <el-tab-pane v-for="item in uploadType.dictList" :label="item.dictName">
                <div class="file-container">
                  <upload-file
                    :is-disabled="isDisabled"
                    :data-list="imagesList ? (imagesList[item.dictValue] || []) : []"
                    describe="点击上传附件"
                    @imgDatapath="value => { imgDatapath(value, uploadType.dictValue, item.dictValue) }"
                    @deleteImg="value => { deleteImg(value, uploadType.dictValue, item.dictValue) }"
                  />
                  <div v-show="isDisabled && (!imagesList[item.dictValue] || imagesList[item.dictValue]?.length == 0)">暂无附件</div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #footer>
      <div style="text-align: center;">
        <el-button type="primary" @click="submit(1)" v-if="!isDisabled">保存</el-button>
        <el-button type="primary" @click="submit(2)" v-if="!isDisabled">提交</el-button>
        <el-button @click="close">{{ isDisabled ? '返回' : '取消' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { surveyAttachPage, surveyAttachSave, deleteSurvey } from '@/api/overall-business/survey'
import { ElMessage } from 'element-plus';

const props = defineProps({
  data: {
    type: Array,
    default: []
  }
})

// 首次加载标识
// let firstLoading = true
// 加载状态
const loading = ref(false)
// 查勘id，记录方便传给接口
let id = ''
// 上传-false 查看-true
const isDisabled = ref(false)
// 图片列表
const imagesList = ref({})

//————————————————————————————————弹窗相关——————————————————————————————————————
// 打开关闭状态
const show = ref(false)
function open(claimNo, disabled) {
  isDisabled.value = disabled
  if (claimNo) {
    show.value = true
    // 如果有查勘id，获取附件
    id = claimNo
    // 调接口获取附件
    loading.value = true
    surveyAttachPage(claimNo).then(({data}) => {
      setImageList(data)
      loading.value = false
      // firstLoading = false
    })
  } else {
    ElMessage.error('未查询到查勘id')
    show.value = false
  }
}

// 接口列表转换成组件接受的了的格式
function setImageList(data) {
  let tempList = {}
  if (data && data.length > 0) {
    // 列表赋值(直接将附件类型作为key值存url)
    data.forEach(item => {
      // 如果没有改节点，则创建
      if (!tempList[item.uploadItem]) {
        tempList[item.uploadItem] = []
      }
      tempList[item.uploadItem].push({ url: item.uploadUrl, uploadId: item.uploadId })
    })
  }
  imagesList.value = tempList
}

function close() {
  imagesList.value = {}
  show.value = false
}
//————————————————————————————————end——————————————————————————————————————


//——————————————————————————————图片配置————————————————————————————————————
// 附件类型列表(暂时写死) 
// 附件类型大类
const uploadTypeList = ref([
  {
    dictValue: 0,
    dictName: '共同单证',
    dictList: [
      {dictValue: 0, dictName: '企业证件'},
      {dictValue: 1, dictName: '标的证件'},
      {dictValue: 2, dictName: '标的领款材料'},
      {dictValue: 3, dictName: '三者证件'},
      {dictValue: 4, dictName: '三者领款材料'},
      {dictValue: 5, dictName: '索赔申请'},
      {dictValue: 6, dictName: '事故证明'},
      {dictValue: 7, dictName: '委托书'},
      {dictValue: 8, dictName: '工资单/劳动合同'},
      {dictValue: 9, dictName: '其他材料 '},
    ]
  },
  {
    dictValue: 1,
    dictName: '车物单证',
    dictList: [
      {dictValue: 10, dictName: '现场照片'},
      {dictValue: 11, dictName: '证件照片'},
      {dictValue: 12, dictName: '过程照片'},
      {dictValue: 13, dictName: '维修发票'},
      {dictValue: 14, dictName: '施救费发票'},
      {dictValue: 15, dictName: '财务损失发票'},
      {dictValue: 16, dictName: '购车发票/完税证明'},
      {dictValue: 17, dictName: '其他发票'},
      {dictValue: 18, dictName: '其他材料 '},
    ]
  },
  {
    dictValue: 2,
    dictName: '人伤单证',
    dictList: [
      {dictValue: 19, dictName: '伤者照片'},
      {dictValue: 20, dictName: '现场照片'},
      {dictValue: 21, dictName: '医疗发票'},
      {dictValue: 22, dictName: '费用清单'},
      {dictValue: 23, dictName: '病历'},
      {dictValue: 24, dictName: '报告单'},
      {dictValue: 25, dictName: '鉴定报告'},
      {dictValue: 26, dictName: '伤残材料'},
      {dictValue: 27, dictName: '死亡材料'},
      {dictValue: 28, dictName: '交通发票'},
      {dictValue: 29, dictName: '其他发票 '},
      {dictValue: 30, dictName: '其他材料 '},
    ]
  },
])

// 上传图片存储暂存路径
function imgDatapath(value, uploadType, uploadItem) {
  if (!imagesList.value[uploadItem]) {
    imagesList.value[uploadItem] = []
  }
  imagesList.value[uploadItem].push({url:value})
}

// 删除某个图片
function deleteImg(value, uploadType, uploadItem) {
  // 有uploadId的需要调接口删除
  if (value.uploadId) {
    deleteSurvey(value.uploadId).then(({ data }) => {
      afterDeleteImg(value, uploadItem)
    })
  } else {
    afterDeleteImg(value, uploadItem)
  }
}

function afterDeleteImg(value, uploadItem) {
  let list = imagesList.value[uploadItem]
  for (let i = 0; list && i < list.length; i++) {
    if (list[i] == value) {
      list.splice(i, 1)
      break;
    }
  }
}

//————————————————————————————————end——————————————————————————————————————

// 保存/提交
function submit(type) {
  loading.value = true
  // 拼装
  let surveyAttachBeanList = []
  // 遍历图片列表
  for (let uploadItem in imagesList.value) {
    const list = JSON.parse(JSON.stringify(imagesList.value[uploadItem]))
    if (list && list.length > 0) {
      list.forEach(item => {
        // 拼装放入接口对象
        surveyAttachBeanList.push({
          claimNo: id,
          // uploadType: item.uploadType,
          uploadItem,
          uploadId: item.uploadId,
          uploadName: item.name || '',
          uploadUrl: item.url
        })
      })
    }
  }
  // 调接口保存
  surveyAttachSave({ surveyAttachBeanList }).then(({ data }) => {
    loading.value = false
    setImageList(data)
    if (type === 1) {
      // 保存
      ElMessage.success('保存成功')
    } else if (type === 2) {
      // 提交
      ElMessage.success('提交成功')
      close()
    }
  })
}



defineExpose({
  open
})

</script>

<style lang="scss" scoped>
.upload-aside {
  padding: 10px;
}

.file-container {
  width: 100%;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
