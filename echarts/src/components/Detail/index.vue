<template>
    <el-row>
      <el-col v-for="(item, key) in dataList" :key="key"
        :lg="{ span: item?.span || span }" :md="{ span: 12 }" :sm="{ span: 24 }">
        <div class="detail-title">
          {{ item?.title }}
        </div>
        <div class="detail-content">
          {{ getContent(item) }}
          <!-- 后缀单位 -->
          <span v-show="isNotNull(item?.unit)" style="margin-left: 5px;">{{ item?.unit }}</span>
        </div>
      </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { isNotNull } from "@/utils/validate";
import useStore from "@/store";

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
})

// 表单配置
const dataList = ref(props.data)

// 监听父组件表单配置的变化
watch(() => props.data, (newValue, oldValue) => {
	dataList.value = newValue
}, { deep: true });

function getContent(item) {
  let res = ''
  if (item) {
    switch(item.type) {
      case 'input':
      case 'date':
        return item.content || '--'
      case 'select':
        const obj = item.options?.find(i => i.dictValue == item.content)
        res = obj?.dictName || '--'
        break;
      case 'radio':
        if (item.options == 'isOrNot') {
          res = item.content == 0 || item.content == 1 ? ['否', '是'][item.content] : '--'
        } else {
          const obj = item.options?.find(i => i.dictValue == item.content)
          res = obj?.dictName || '--'
        }
        break;
      case 'city':
        let content = item.content ? item.content.split(',') : []
        if (content.length == 3) {
          let cityMap = null
          if (!sessionStorage.getItem('map')) {
            const { user } = useStore()
            user.getAllMap().then((data) => {
              cityMap = data
            })
          } else {
            cityMap = JSON.parse(sessionStorage.getItem('map'))
          }
          // 找到城市
          for (let i = 0; i < cityMap.length; i++) {
            if (cityMap[i].value == content[0]) {
              res += cityMap[i].label + ' / '
              for (let j = 0; j < cityMap[i].children.length; j++) {
                if (cityMap[i].children[j].value == content[1]) {
                  res += cityMap[i].children[j].label + ' / '
                  for (let k = 0; k < cityMap[i].children[j].children.length; k++) {
                    if (cityMap[i].children[j].children[k].value == content[2]) {
                      res += cityMap[i].children[j].children[k].label
                      break;
                    }
                  }
                  break;
                }
              }
              break;
            }
          }
        }
        break;
      case 'duty':
        if (item.content.baAccidentLiability) {
          res = item.content.baAccidentLiability ? item.content.baAccidentLiability + '%': '--'
        } else if (item.content.ckAccidentLiability) {
          res = item.content.ckAccidentLiability ? item.content.ckAccidentLiability + '%': '--'
        } else if (item.content.examAccidentLiability) {
          res = item.content.examAccidentLiability ? item.content.examAccidentLiability + '%': '--'
        }
        break;
      case 'tcItem':
        // 保项拼装
        if(item.content && item.content.length > 0) {
          item.content.forEach((tc, index) => {
            res += tc.tcItemName + (index < item.content.length - 1 ? '/' : '')
          })
        }
        break;
      default:
        res = ''
        break;
    }
  }
  return res
}

</script>

<style lang="scss" scoped>

.detail-title {
  font-size: 14px;
  color: #909399;
  padding-bottom: 10px;
  box-sizing: border-box;
}

.detail-content {
  font-size: 14px;
  padding-bottom: 18px;
  box-sizing: border-box;
}
</style>