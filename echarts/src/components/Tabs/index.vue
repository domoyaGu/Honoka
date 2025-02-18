<template>
	<div class="tab-container">
		<div
			v-for="(tab, index) in list"
			v-show="!tab['isHide']"
		 	:class="'tab ' + (selected == index ? 'active' : '')"
			@click="changeTab(index)">
			{{ tab['name'] }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import { dialogEmits } from 'element-plus';

const props = defineProps({
	// 最初的默认列表
	list: {
		type: Array,
		default: []
	}
})

const selected = ref(0)

// 监听
watch(() => props.list, (newValue, oldValue) => {
	// console.log(newValue)
}, {deep: true});

// 父组件
const emits = defineEmits(['changeTab'])

// 切换
function changeTab(index) {
	if (index != selected.value) {
		selected.value = index
		emits('changeTab', index)
	}
}

</script>

<style lang="scss" scoped>
.tab-container {
	font-size: 15px;
	display: flex;
	border-radius: 6px;
	background-color: white;
	padding: 14px;
	margin-bottom: 10px;
	.tab {
		margin-right: 16px;
		cursor: pointer;
	}
	.active {
		font-size: 16px;
		color: var(--el-color-primary);
		font-weight: bold;
	}
}
</style>
