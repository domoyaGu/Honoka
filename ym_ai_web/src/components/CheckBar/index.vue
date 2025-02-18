<template>
	<div class="check_bar_container">
		<div class="check_bar_float" :class="{ 'float_active': isMore }">
			<div class="check_bar_content">
				<div class="check_bar_label">
					{{ label }}
				</div>
				<div class="checks">
					<div v-if="isMulti" style="display: flex; align-items: center;">
						<!-- <el-checkbox
							v-model="checkAll"
							:indeterminate="isIndeterminate"
							@change="handleCheckAllChange"
							>不限</el-checkbox
						> -->
						<el-checkbox-group
							v-model="checkedValues"
							@change="handleCheckedValuesChange"
						>
							<el-checkbox v-for="(item, index) in data" :key="index" :label="item">{{
								item
							}}</el-checkbox>
						</el-checkbox-group>
					</div>
					<div v-else>
						<span class="item_span" v-for="(item, index) in data" :key="index" :class="{ 'item_checked': value == item }" @click="clickValue(item)">
							{{ item }}
						</span>
					</div>
				</div>
			</div>
			<div class="check_bar_more" @click="isMore = !isMore" v-if="data.length > 10">
				{{ isMore ? '收起' : '更多' }}
				<el-icon size="14px" color="#999999" :class="{ 'is_more': isMore }">
					<CaretBottom />
				</el-icon>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { CaretBottom } from '@element-plus/icons-vue';

const props = defineProps({
	modelValue: {},
	label: {
		type: String,
		default: ""
	},
	// 勾选项数组
	data: {
		type: Array,
		default: () => []
	},
	// 是否是多选项
	isMulti: {
		type: Boolean,
		default: false
	}
});

//——————————————————————————————————父子通信相关————————————————————————————————————————————
// value值
const checkedValues = ref(); // 多选
const value = ref(props.modelValue); // 单选
// 是否展开
const isMore = ref(false);
// 更新外部v-model
const emits = defineEmits(['update:modelValue']);

function clickValue(item) {
	if (value.value != item) {
		value.value = item
		emits('update:modelValue', value.value)
	}
}

//——————————————————————————————————————end——————————————————————————————————————————————————————

//——————————————————————————————————多选组件相关————————————————————————————————————————————
const checkAll = ref(false)
const isIndeterminate = ref(true)

const handleCheckAllChange = (val: boolean) => {
  checkedValues.value = val ? props.data : []
  isIndeterminate.value = false
	emits('update:modelValue', checkedValues.value)
}
const handleCheckedValuesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === props.data.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.data.length
	emits('update:modelValue', checkedValues.value)
}

//——————————————————————————————————————end——————————————————————————————————————————————————————
</script>

<style lang="scss" scoped>
.check_bar_container {
	position: absolute;
	min-height: 48px;
	min-width: 800px;
	width: 100%;
	font-size: 14px;
	font-weight: 400;
	font-family: "PingFang SC";
	letter-spacing: 0.41px;
	.check_bar_float {
		width: 100%;
		display: flex;
		padding: 14px 16px;
		justify-content: space-between;
		align-items: baseline;
		background: white;
		transition: 0.3s;
		max-height: 49px;
		border-radius: 8px;
		overflow: hidden;
		.check_bar_content {
			display: flex;
			.check_bar_label {
				width: 88px;
				color: #666666;
			}
			.checks {
				color: #333333;
				.item_span {
					display: inline-block;
					margin-right: 50px;
					cursor: pointer;
					&:not(:last-child) {
						margin-bottom: 16px;
					}
				}
				.item_checked{
					color: #2560d2;
					font-weight: 500;
				}
			}
		}
		.check_bar_more {
			width: 100px;
			color: #999999;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: right;
			.el-icon {
				transition: 0.3s;
			}
		}
	}
	.float_active {
    z-index: 2;
    position: absolute;
		max-height: 500px;
		box-shadow: 0 8px 5px 0 #0000000f;
	}
}

// 图标旋转
.is_more {
	transform: rotate(180deg);
	margin-top: 5px;
}

// 选择框样式穿透
:deep(.el-checkbox) {
	margin-right: 50px;
	margin-top: -7px;
}
</style>
  