<template>
	<el-form
    ref="form"
    :model="formData"
    :rules="rules || []"
    label-position="top"
    :disabled="allDisabled"
    >
    <el-row :style="'--colWidth:' + width">
      <el-col :lg="{ span: item.span || span }" :md="{ span: item.span || 12 }" :sm="{ span: item.span || 24 }"
        v-for="(item, key) in dataList">
        <el-form-item
          :key="key"
          :label="item.title"
          :prop="key"
          v-show="!item.isHide"
        >
            <el-input
              v-if="item.type == 'input'"
              v-model="formData[key]"
              :placeholder="item.disabled ? '' : '请输入'"
              :rows="item.row"
              :type="item.textType || 'text'"
              :disabled="item.disabled"
              clearable
            />
            <CurrencyInput
              v-else-if="item.type == 'currency'"
              :default-value="formData[key]"
              @inputtext="(val) => { formData[key] = val }"
              :disabled="item.disabled"
              type="text"
              :placeholder="item.disabled ? '' : '请输入'"
              clearable
              is-watch
            />
            <el-date-picker
              v-else-if="item.type == 'date'"
              v-model="formData[key]"
              :disabled="item.disabled"
              value-format="YYYY-MM-DD HH:mm:ss"
              :type="item.dateType || 'date'"
              :disabledDate="item.disabledDate"
              :unlink-panels="true"
              :placeholder="item.disabled ? ' ' : '请选择'"
            />
            <el-select
              v-else-if="item.type == 'select'"
              :disabled="item.disabled"
              clearable
              v-model="formData[key]"
              :placeholder="item.disabled ? ' ' : '请选择'">
              <el-option
                v-for="(option, index) in item.options"
                :value="option.dictValue"
                :label="option.dictName"
                :key="index"
              />
            </el-select>
            <el-radio-group
              v-else-if="item.type == 'radio'"
              v-model="formData[key]"
              :disabled="item.disabled">
              <el-radio
                v-for="(option,index) in isOrNotOptions"
                :key="index"
                :label="option.label" >{{ option.text }}</el-radio>
            </el-radio-group>
            <!-- 省市区单独拿出来 -->
            <div v-else-if="item.type == 'city'">
              <el-cascader
                :options="cityMap"
                v-model="city"
                :props="{ value: 'value' }"
                collapse-tags
                style="width: 100%"
                @change="(value) => { cityChange(value, key) }"
                :disabled="item.disabled"
                clearable
              />
            </div>
            <!-- 事故责任组件 -->
            <div v-else-if="item.type == 'duty'">
              <DutySelect v-model="formData['duty']"/>
            </div>
            <!-- 自定义组件 -->
            <div v-else>
              <slot name="other"></slot>
            </div>
          <!-- 后缀单位 -->
          <span v-show="isNotNull(item.unit)" style="margin-left: 5px;">{{ item.unit }}</span>
        </el-form-item>
      </el-col>
    </el-row>
	</el-form>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { changePlace, isNotNull } from "@/utils/validate";
import useStore from "@/store";
import { ElForm } from "element-plus";

//接收参数
const props = defineProps({
	// 表单结构配置
	data: {
		type: Object
	},
	// 校验信息
	rules: {
		type: Object
	},
  // 间隔
  span: {
    type: Number,
    default: 8
  },
  // 输入框、选择框宽度固定
  width: {
    type: String,
    default: '286px'
  },
  // 整个表单禁用
  allDisabled: {
    type: Boolean,
    default: false
  }
})

// store
const { user } = useStore()

// 表单配置
const dataList = ref(props.data)

// 表单值
const formData = ref({})

// 父组件事件
const emits = defineEmits(['inputChange', 'inputFocus'])

// 监听父组件表单配置的变化
watch(() => props.data, (newValue, oldValue) => {
	dataList.value = newValue
  fetchFromData(newValue)
}, { deep: true })

// 初始化表单项
function fetchFromData(data) {
	if (data) {
		for (let key in data) {
			let content = data[key].content
      // 如果需要省市区信息，则获取
      if (data[key].type == 'city') {
        if (!cityMap.value) {
          if (!sessionStorage.getItem('map')) {
            user.getAllMap().then((data) => {
              cityMap.value = data
            })
          } else {
            cityMap.value = JSON.parse(sessionStorage.getItem('map'))
          }
        }
        // 省市区信息赋值
        if (content) {
          city.value = content.split(',')
        }
      }
      // 事故责任单独处理
      if (key == 'baAccidentLiabilityType') {
        formData.value['duty'] = {
          radioValue: content?.baAccidentLiability || 100,
          radioName: content?.baAccidentLiabilityType || 'LP_ACCIDENT_LIABILITY_5'
        }
      } else if (key == 'ckAccidentLiabilityType') {
        formData.value[key] = {
          ckAccidentLiability: content?.ckAccidentLiability || 100,
          ckAccidentLiabilityType: content?.ckAccidentLiabilityType || 'LP_ACCIDENT_LIABILITY_5'
        }
        formData.value['duty'] = {
          radioValue: content?.ckAccidentLiability || 100,
          radioName: content?.ckAccidentLiabilityType || 'LP_ACCIDENT_LIABILITY_5'
        }
      } else if (key == 'examAccidentLiabilityType') {
        formData.value[key] = {
          examAccidentLiability: content?.examAccidentLiability || 100,
          examAccidentLiabilityType: content?.examAccidentLiabilityType || 'LP_ACCIDENT_LIABILITY_5'
        }
        formData.value['duty'] = {
          radioValue: content?.examAccidentLiability || 100,
          radioName: content?.examAccidentLiabilityType || 'LP_ACCIDENT_LIABILITY_5'
        }
      } else{
        if (data[key].type == 'select') {
          if(content) {
            formData.value[key] = content
          }
        } else {
          formData.value[key] = content
        }
      }
		}
	}
}

// 表单ref
const form = ref(ElForm)

function resetForm() {
  form.value.resetFields()
  formData.value = {}
}

// 表单校验
function validForm() {
	return new Promise((resolve, reject) => {
    form.value.validate((valid: boolean, errFields: Object) => {
      if (!valid) {
        form.value.scrollToField(Object.keys(errFields)[0])
        reject('表单校验未通过')
      } else {
        resolve(formData.value)
      }
    })
	})
}

const isOrNotOptions = [{label: 1, text: '是'}, {label: 0, text: '否'}]

// 城市
const city = ref([])
const cityMap = ref()
// 表单中城市匹配
function cityChange(value, key) {
  if (value) {
    formData.value[key] = value[0] + ',' + value[1] + ',' + value[2];
  }
}

onMounted(() => {
	// 匹配表单项
	fetchFromData(props.data)
})

defineExpose({
	validForm,
	formData,
  resetForm
})

</script>

<style lang="scss" scoped>
.el-input,
.el-select {
  width: var(--colWidth);
}
:deep(.el-input__wrapper) {
  width: var(--colWidth);
}
:deep(.el-input__wrapper) {
  width: var(--colWidth);
}
// :deep(.el-textarea__inner) {
//   width: 880px;
// }
</style>