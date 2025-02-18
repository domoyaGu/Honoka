<template>
  <div class="tc-detail-container">
    <el-card class="tc-detail-card">
      <div class="card-title"><span class="text">批改记录</span></div>
      <div v-if="endorsementRecordList.length == 0" class="tc-detail-content">无批改记录</div>
      <div v-else class="tc-detail-content">
        <el-row style="margin-bottom: 24px;">
          <el-col :span="11">批改记录</el-col>
          <el-col :span="13">批改内容</el-col>
        </el-row>
        <el-row style="margin-bottom: 36px;">
          <el-col :span="8">
            <div class="correct-content">
              <p class="content"
                v-for="(item, index) in endorsementRecordList"
                @click="setSelect(index)"
                :style="'cursor: pointer;' + (selected == index ? 'color: #2A63F6' : '')">
                批单号：{{ item.correctionNo }}
              </p>
            </div>
          </el-col>
          <el-col :span="3" class="correct-separation-container">
            <div class="correct-separation"></div>
          </el-col>
          <el-col :span="13">
            <div class="correct-content">
              <p class="content" v-for="(item, index) in correctionContentList" :key="index">
                {{ (index + 1) + '、' + item }}
              </p>
            </div>
          </el-col>
        </el-row>
        <Detail :data="taskList"/>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getCorrectionList } from '@/api/common'

const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
});

onMounted(() => {
  if (props.data) {
    setValue(props.data)
  }
})

// 作业信息
const taskList = ref({
  correctionCommitUsername: {title: '批改作业人员', content: "", type: 'input'},
  correctionCommitUserNum: {title: '工号', content: "", type: 'input'},
  correctionCommitUserPhone: {title: '手机号', content: "", type: 'input'}
})

watch(() => props.data, (newValue, oldValue) => {
  if (newValue.insuranceId != oldValue.insuranceId) {
    setValue(newValue)
  }
}, { deep: true });

const endorsementRecordList = ref([])

function setValue(newValue) {
  if (newValue.insuranceId) {
    // 批改记录单独获取
    getCorrectionList(newValue.insuranceId).then(({ data }) => {
      // 批改记录
      endorsementRecordList.value = data;
      setSelect(0);
    })
  }
}

// 选中项
const selected = ref()
const correctionContentList = ref([])

// 设置选中项
function setSelect(index) {
  if (selected.value != index) {
    selected.value = index
    if (endorsementRecordList.value[index]) {
      correctionContentList.value = endorsementRecordList.value[index]?.correctionContentList
      // 作业信息
      for (let key in taskList.value) {
        taskList.value[key].content = endorsementRecordList.value[index][key]
      }
    }
  }
}

</script>

<style lang="scss" scoped>
// 左右框
.correct-content {
  padding: 16px 16px 0 16px;
  border: 1px #DCDFE6 solid;
  min-height: 200px;
  .content {
    margin-bottom: 16px;
  }
}
// 分隔符
.correct-separation-container {
  justify-content: center;
  display: flex;
  align-items: center;
  .correct-separation {
    height: 50%;
    border-left: 1px #DCDFE6 solid;
  }
}
</style>
