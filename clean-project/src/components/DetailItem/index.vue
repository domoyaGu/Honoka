<template>
  <div>
    <div class="detail-title" :style="'display: ' + (position == 'left' ? 'inline-block;' : 'block;')">
      {{ item?.title + (position == 'left' ? '：' : '') }}
    </div>
    <div class="detail-content" :style="'display: ' + (position == 'left' ? 'inline-block;' : 'block;')">
      <p v-if="item.category === 'mark'">
        <span v-for="(mark, index) in getContent(item)" :key="index" class="single_mark">
          {{ mark }}
        </span>
      </p>
      <span v-else :style="item.style">{{ getContent(item) }}</span>
      <!-- 后缀单位 -->
      <span v-show="isNotNull(item?.unit)" style="margin-left: 5px;">{{ item?.unit }}</span>
      <!-- 插槽 -->
      <slot name="suffix"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isNotNull } from "@/utils/validate";
import useStore from "@/store";

defineProps({
  item: {
    type: Object
  },
  position: {
    type: String,
    default: 'top'
  }
})

function getContent(item) {
  let res = ''
  if (item) {
    switch(item.type) {
      case 'input':
        return item.content || '--'
      case 'number':
      return item.content ? item.content + '%' : '--'
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
      // case 'city':
      //   let content = item.content ? item.content.split(',') : []
      //   if (content.length == 3) {
      //     let cityMap = null
      //     if (!sessionStorage.getItem('map')) {
      //       const { user } = useStore()
      //       user.getAllMap().then((data) => {
      //         cityMap = data
      //         // 找到城市
      //         res = getCity(cityMap, content)
      //       })
      //     } else {
      //       cityMap = JSON.parse(sessionStorage.getItem('map'))
      //       // 找到城市
      //       res = getCity(cityMap, content)
      //     }
      //   }
      //   break;
      default:
        res = ''
        break;
    }
  }
  return res
}
/**
 * 根据城市列表获取城市
 * @param cityMap 
 * @param content 
 */
function getCity(cityMap, content) {
  let res = ''
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
  return res;
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
.single_mark {
  display: inline-block;
  padding: 10px;
  border: 1px solid #afb6bd54;
  border-radius: 5px;
  & + .single_mark {
    margin-left: 20px;
  }
}
</style>
