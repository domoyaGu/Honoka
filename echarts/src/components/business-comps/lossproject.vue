<template>
  <Collapse>
    <template #title><h1>损失类型</h1></template>
    <div>
      <el-checkbox-group v-model="checkedList" :disabled="isDetail">
        <el-checkbox
          v-for="(project, index) in lossprojectList"
          :key="index"
          :label="project.lossProjectId"
          :disabled="project.disabled"
          >{{ project.lossName }}
        </el-checkbox>
      </el-checkbox-group>
      <div>
        <div class="people-loss-container" v-for="(project, index) in peopleLossList">
          <el-checkbox
            :key="index"
            v-model="project.checked"
            :label="project.lossProjectId"
            @change="checked => { project.checked = checked }"
            :disabled="isDetail || project.disabled"
            >
            {{ project.lossName }}
          </el-checkbox>
          <span class="people-loss">
            受伤人数
            <el-input-number :disabled="isDetail || project.disabled" v-model="project.injuredValue" size="small" :min="0" :max="100" />
          </span>
          <span class="people-loss">
            死亡人数
            <el-input-number :disabled="isDetail || project.disabled" v-model="project.deathValue" size="small" :min="0" :max="100" />
          </span>
        </div>
      </div>
    </div>
  </Collapse>
</template>

<script lang="ts" setup>
import { getLossProject } from '@/api/common'
import { ElMessage } from 'element-plus';

const props = defineProps({
  data: {
    type: Object
  },
  isDetail: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  }
})

watch(() => props.data, (newValue, oldValue) => {
	// 默认选中项
  if (lossprojectList.value.length == 0 || peopleLossList.value.length == 0) {
    // 未匹配接口的情况
    getLoss()
  } else {
    // 匹配完接口直接赋值
    getData(newValue)
  }
});

function getData(data) {
  data.forEach((item) => {
    //人伤
    if (item.injuredValue || item.injuredValue == 0) {
      for (let i = 0; i < peopleLossList.value.length; i++) {
        if (item.lossProjectId == peopleLossList.value[i].lossProjectId) {
          peopleLossList.value[i].injuredValue = item.injuredValue
          peopleLossList.value[i].deathValue = item.deathValue
          peopleLossList.value[i].keyId = item.keyId
          peopleLossList.value[i].itemId = item.itemId
          peopleLossList.value[i].checked = true
          peopleLossList.value[i].disabled = true
          break
        }
      }
    } else{
      // 车损
      for (let i = 0; i < lossprojectList.value.length; i++) {
        if (item.lossProjectId == lossprojectList.value[i].lossProjectId) {
          lossprojectList.value[i].itemId = item.itemId
          lossprojectList.value[i].keyId = item.keyId
          lossprojectList.value[i].disabled = true
          checkedList.value.push(i + 1)
          break
        }
      }
    }
    })
}

const checkedList = ref([])

const lossprojectList = ref([])
const peopleLossList = ref([])

// 拼装车损、人损
function fetchList(data) {
  if (data && data.length > 0) {
    lossprojectList.value = []
    peopleLossList.value = []
    data.forEach((item) => {
      // 损失类型：0：无附加信息，1：有附加信息
      if (item.lossType == 0) {
        lossprojectList.value.push({ ...item })
      } else if (item.lossType == 1) {
        peopleLossList.value.push({ ...item, injuredValue: 0, deathValue: 0 })
      }
    })
    if (props.data.reportLossItemList && props.data.reportLossItemList.length > 0) {
      getData(props.data.reportLossItemList)
    }
  }
}

// 获取数据
function getFormData() {
  //拼装参数
  let reportLossItemList = []
  checkedList.value.forEach(item => {
    const obj = lossprojectList.value[item - 1]
    reportLossItemList.push({
      lossProjectId: obj.lossProjectId,
      keyId: props.data?.reportId || '',
      itemId: obj.itemId || ''
    })
  });
  peopleLossList.value.forEach(item => {
    if (item.checked) {
      reportLossItemList.push({
        lossProjectId: item.lossProjectId,
        injuredValue: item.injuredValue,
        deathValue: item.deathValue,
        keyId: props.data?.reportId || '',
        itemId: item.itemId || ''
      })
    }
  })
  return new Promise((resolve, reject) => {
    if (reportLossItemList.length == 0) {
      ElMessage.error('损失类型不能为空')
      reject('损失类型不能为空')
    } else {
      resolve({reportLossItemList})
    }
  })
}

onMounted(() => {
  nextTick(() => {
    if (props.isNew) {
      getLoss()
    }
  })
})

function getLoss() {
  return new Promise((resolve, reject) => {
    // 获取损失类型
    getLossProject([]).then(({ data }) => {
      fetchList(data)
      resolve('')
    }).catch(() => {
      reject('获取损失类型')
    })
  })
}

defineExpose({
  getFormData
})

</script>

<style lang="scss" scoped>
.people-loss-container {
  display: flex;
  align-items: center;
  .people-loss {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-left: 25px;
    color: #606266;
    .el-input-number {
      margin-left: 5px;
    }
  }
}
</style>
