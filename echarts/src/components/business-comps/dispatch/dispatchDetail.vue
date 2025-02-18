<template>
  <!-- <Collapse>
    <template #title><h1>派工类型</h1></template>
  </Collapse> -->
  <Collapse>
    <template #title><h1>派工详情</h1></template>
    <el-form-item label="派工类型：">
      <el-radio-group :disabled="isDetail" v-model="lpDispatchType">
        <el-radio
          v-for="(option,index) in dispatchTypeList"
          :key="index"
          :label="option.dictValue" >
          {{ option.dictName }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-row style="margin-bottom: 20px;">
      <el-col v-for="(project, index) in projects" :key="index"
        :lg="{ span: 12 }" :md="{ span: 24 }" :sm="{ span: 24 }">
        <!-- <el-card> -->
          <div class="project-container">
            <div>
              <el-checkbox
                style="margin-right: 20px"
                @change="changeChecked(index)"
                :disabled="isDetail || project.taskStatus != 1"
                >
                {{ taskList?.find(item => item.dictValue == project.taskType)?.dictName }}任务派工
              </el-checkbox>
              <br/>
              <el-checkbox
                style="margin-right: 20px"
                :checked="project.taskSmsFlag == 1"
                :disabled="isDetail || project.checked"
                @change="(value) => { project.taskSmsFlag = value ? 1 : 0 }"
                >发送短信
              </el-checkbox>
            </div>
            <el-form
              ref="form"
              :model="project"
              label-position="top"
              :disabled="isDetail || project.checked"
              >
                  <el-form-item label="案件处理机构：" prop="taskOrgName">
                    <el-input
                      v-model="project.taskOrgName"
                      placeholder="请输入"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="处理人员：" prop="taskUserId">
                    <el-select
                      clearable
                      v-model="project.taskUserId"
                      placeholder="请选择">
                      <el-option
                        v-for="(option, index) in userList"
                        :value="option.userId"
                        :label="option.userName"
                        :key="index"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="派工备注：" prop="taskRemark">
                    <el-input
                      v-model="project.taskRemark"
                      type="textarea"
                      placeholder="请输入"
                      :row="1"
                      clearable
                    />
                  </el-form-item>
            </el-form>
          </div>
        <!-- </el-card> -->
      </el-col>
    </el-row>
  </Collapse>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { getSelectOption, getUserList } from '@/api/common';
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
  },
  dispatchType: {
    type: String
  }
})

watch(() => props.data, (newValue, oldValue) => {
	// 默认选中项
  if (newValue && newValue.length > 0) {
    let projectTemp = []
    newValue.forEach((item) => {
      projectTemp.push({ ...item, checked: true })
    })
    projects.value = projectTemp
  }
}, {deep: true});

watch(() => props.dispatchType, (newValue, oldValue) => {
	// 默认选中项
  if (newValue) {
    lpDispatchType.value = newValue
  }
});


// 车物/人伤配置
const projects = ref([])

// 派工详情任务分配select
const taskList = ref([])
// 人员
const userList = ref([])
// 派工类型勾选框
const lpDispatchType = ref(props.dispatchType)
const dispatchTypeList = ref([])

// 勾选项切换
function changeChecked(index) {
  projects.value[index].checked = !projects.value[index].checked
}

onMounted(() => {
  getSelect()
})

// 获取人员、派工类型下拉
function getSelect() {
  getSelectOption(['LP_TASK', 'LP_DISPATCH_TYPE']).then(({ data }) => {
    taskList.value = data['LP_TASK']
    dispatchTypeList.value = data['LP_DISPATCH_TYPE']
  })
  getUserList().then(({ data }) => {
    userList.value = data
  })
}

// 获取数据(传给父组件)
function getFormData() {
  //拼装参数
  let dispatchTaskRoList = []
  projects.value.forEach((item) => {
    const temp = { ...item }
    temp['taskUsername'] = userList.value.find(user => user.userId == item.taskUserId)?.userName
    delete temp.checked
    delete temp.disabled
    dispatchTaskRoList.push(temp)
  })
  return new Promise((resolve, reject) => {
    if (dispatchTaskRoList.length == 0) {
      ElMessage.error('未派工给任何人')
      reject('未派工给任何人')
    } else {
      if (!lpDispatchType.value) {
        ElMessage.error('未选择派工类型')
        reject('未选择派工类型')
      } else {
        resolve({dispatchTaskRoList, dispatchType: lpDispatchType.value})
      }
    }
  })
}

defineExpose({
  getFormData
})

</script>

<style lang="scss" scoped>
.el-input,
.el-select {
  width: 300px;
}
:deep(.el-input__wrapper) {
  min-width: 300px;
}
:deep(.el-textarea__inner) {
  width: 300px;
}
.project-container {
  display: flex;
  justify-content: left;
  align-items: baseline;
}
</style>
