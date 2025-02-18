<template>
    <el-row>
      <template v-for="(item, key) in dataList">
        <el-col v-if="!item['isHide']"
          :lg="{ span: item['span'] || span }" :md="{ span: 12 }" :sm="{ span: 24 }">
          <detail-item :item="item"/>
        </el-col>
      </template>
    </el-row>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

//接收参数
const props = defineProps({
	// 表单结构配置
	data: {
		type: Object
	},
  // 间隔
  span: {
    type: Number,
    default: 8
  },
})

// 表单配置
const dataList = ref({})

// 监听父组件表单配置的变化
watch(() => props.data, (newValue, oldValue) => {
	dataList.value = newValue
}, { deep: true, immediate: true });

</script>

<style lang="scss" scoped>

</style>