<template>
  <div>
    <el-dialog v-bind="$attrs" width="500" v-model="showDialog">
			<template #header>
				<span>填写作废说明</span>
			</template>
			<div class="cancel-text-container">
				<el-input
          v-model="remark"
          type="textarea"
          placeholder="请输入作废说明(没有可不填)"
          clearable
        />
			</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="submit">
            确定
          </el-button>
        </span>
      </template>
		</el-dialog>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    // 调接口的数据(暂时用不到)
    params: {} as any
  })
  // 父组件函数
  const emit = defineEmits(['submit']);

  // 确认提交表单
  function submit () {
    emit('submit', state.remark)
  }

  const state = reactive({
    // 弹窗开关
    showDialog: false as Boolean,
    // 作废说明信息
    remark: '' as string
  })

  const { showDialog, remark } = toRefs(state)
  
  // 打开弹窗
  function open() {
    state.showDialog = true
  }

  // 关闭弹窗
  function close() {
    state.showDialog = false
  }

  defineExpose({
    open,
    close
  })

</script>

<style lang="scss" scoped>
  // 样式穿透
  :deep(.el-textarea__inner) {
    min-height: 100px !important;
  }
</style>
