<template>
	<div>
		<el-dialog v-bind="$attrs" width="500" v-model="showDialog">
			<template #header>
				<span>证件识别</span>
			</template>
			<div class="certificate-text-container">
				<p class="certificate-text-title">证件类型</p>
				<el-radio-group v-model="type">
					<el-radio v-for="(item, index) in typeList"
						:key="item.type"
						:label="item.type"
						:style="radioWidth"
						border
					>{{ item.text }}</el-radio>
					<!-- <el-radio label="1" border :style="'width:'+ radioWidth + 'px'">身份证</el-radio>
					<el-radio label="6" border>营业执照</el-radio> -->
					<!-- <el-radio label="2" border>护照</el-radio> -->
				</el-radio-group>
				<p class="certificate-text-title">选择文件</p>
				<upload-file
					:limit="1"
					:data-list="idImgList"
					@imgDatapath="imgDatapath"
					@deleteImg="deleteImg"
					describe="请选择文件"/>
				<el-button :disabled="idImgList.length == 0" class="certificate-button" type="primary" @click="imageRecognition">
					开始识别
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ElButton, ElDialog, ElMessage } from 'element-plus'
import { imgDistinguish } from '@/api/common'
import { isNotNull } from '@/utils/validate';

// 父组件传参
const props = defineProps({
	// 组件key值(用于同组件引用返参辨识)
	keyName: {
    type: String,
    default: function () {
      return "";
    }
  },
	// 默认选中
  defaultType: {
    type: String,
    default: function () {
      return "1";
    }
  }
});
// 父组件函数
const emit = defineEmits(['imageOcr']);

const state = reactive({
	// 文件列表
  idImgList:[],
	// 选中的证件类型
	type: "1",
	// 弹窗开关
	showDialog: false,
	// 根据证件类型数量定义宽度
	radioWidth: ""
});
const { idImgList, type, showDialog, radioWidth } = toRefs(state);

// 这边下来的key值对应不上type，暂时前端写死，待后端优化
const typeList = [
	{selectType: "DOCUMENT_TYPE_1", type: "1", text: "身份证"},
	{selectType: "DOCUMENT_TYPE_2", type: "6", text: "营业执照"},
	// {selectType: "DOCUMENT_TYPE_3", type: "2", text: "护照"}
]

// 初始化证件类型默认值
isNotNull(props.defaultType) && (state.type = props.defaultType)

// 证件类型选择的宽度自适应
state.radioWidth = typeList.length > 3 ? "" : `width:${typeList.length == 3 ? 100 : (typeList.length == 2 ? 160 : "")}px`

// 上传图片存储暂存路径
function imgDatapath(value) {
  idImgList.value.push({url:value})
}

// 删除图片
function deleteImg (value) {
  idImgList.value.find((v,i)=>{if(v==value) idImgList.value.splice(i,1)})
}


// 图片识别
function imageRecognition () {
	imgDistinguish({ imgUrl: idImgList.value[0].url, type: state.type }).then(res => {
		let data = res.data.data
		// 证件类型key值对应下拉key值
		data.type = typeList.find(item => {return item.type == state.type}).selectType
		emit('imageOcr', props.keyName, data)
		ElMessage.success("识别成功")
		close()
	}).catch((err) => {
		ElMessage.error("识别失败：" + err)
	});
}

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
// 字符间距
$letterSpace: 1px;
// 上下间距
$topMargin: 10px;
// 左右间距
$leftPadding: 20px;

// 弹窗头样式
:deep(.el-dialog__header) {
	margin: 0 $leftPadding;
	border-bottom: 1px solid gainsboro;
	color: dodgerblue;
	font-size: 18px;
	font-weight: bolder;
	letter-spacing: $letterSpace;
}
.certificate-text-container {
	padding:0 $leftPadding;

	// 穿透el-radio，隐藏圆圈
	:deep(.el-radio__input) {
		display: none;
	}

	// 标题样式
	.certificate-text-title {
		margin-top: $topMargin;
		font-size: 16px;
		font-weight: bold;
		color: #292421;
		margin-bottom: $topMargin;
		letter-spacing: $letterSpace;
	}

	// 重写文件上传组件的样式
	:deep(.icon-class) {
		width: 100%;
		height: 150px;
    border: 2px dashed #DCDFE6;
		color: dimgrey;
		.el-icon svg {
			width: 0.6em;
		}
		p {
			font-weight: bold;
			font-size: 15px !important; 
		}
	}
	// 重写图片展示的样式
	:deep(.div-img) {
		width: 100%;
		height: 150px;
		margin: 0;
	}

	// 重写el-radio样式
	:deep(.el-radio-group) {
		width: 100%;
    justify-content: space-around;
		.el-radio {
    	margin-top: 3px;
			margin-right: 10px;
			height: 36px;
			width: fit-content;
    	justify-content: center;
		}
		.el-radio.is-bordered.is-checked{
			border: 2px solid var(--el-color-primary);
			font-weight: bold;
		}
	}

	// 重写自定义文件上传组件的样式
	:deep(.avatar-uploader) {
		width: 100%;
		.el-upload {
			width: 100%;
		}
	}

	.certificate-button {
		margin-top: $topMargin;
		width: 100%;
    height: 50px;
	}
}
</style>
