<template>
  <div class="filter_wrap">
    <div class="filter_title">筛选区域</div>
    <div class="filter_container">
      <div v-if="data.length < 5">
        <div v-for="item in data" :key="item.prop" style="display: inline-block; margin-right: 32px;">
          <FormItem v-model="params[item.prop]" :data="item" width="292px"/>
        </div>
        <div style="display: inline-block;">
          <el-button color="#2560D2" class="filter_button" @click="search"
            >搜索</el-button
          >
          <el-button class="filter_button" @click="reset">重置</el-button>
        </div>
      </div>
      <div v-else class="filter_more">
        <div class="filter_more_cols"
          :style="'height:' + (isMore ? ((Math.floor(filterData.length / rowSpanNum) + 1) * 38 +
            Math.floor(filterData.length / rowSpanNum) * 16) : 38 ) + 'px;'"
        >
          <!-- 每一列(共rowSpanNum列) -->
          <div class="filter_col"
            v-for="num in range(0, rowSpanNum)"
            :key="num"
            :style="'width: ' + (100 / rowSpanNum) + '%;'"
          >
            <!-- 取每一列的数据（取余rowSpanNum得到当前列数据） -->
            <div
              v-for="(item, index) in filterData.filter((i, index) => index % rowSpanNum == num)"
              :key="item.prop"
              :class="{'margin_more': isMore && index > 0}"
            >
              <FormItem v-model="params[item.prop]" :data="item" />
            </div>
            <!-- 最后一列添加展开收起 -->
            <div v-if="num === rowSpanNum - 1"
              class="more_btn_container"
              :class="{'no_more_btn_container': !isMore, 'margin_more': isMore}"
            >
              <el-button color="#2560D2" class="filter_button" @click="search">搜索</el-button>
              <el-button class="filter_button" @click="reset">重置</el-button>
              <span class="more" @click="clickMore">
                {{ isMore ? '收起' : '更多' }}
                <el-icon size="14px" :class="{ 'is_more': isMore }">
                  <CaretBottom />
                </el-icon>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CaretBottom } from '@element-plus/icons-vue';
import { range } from 'lodash';

const rowSpanNum = ref(5)

const props = defineProps({
  data: {
    default: () => []
  }
});

// 参数
const params = ref({});

// 更多选项的情况展示项
const filterData = ref([]);

watch(() => props.data, (newVal) => {
  resetFilterData(newVal, false)
})

/**
 * 返回给父组件筛选表单数据
 */
function getFilterData() {
  return new Promise(resolve => {
    let queryParams = JSON.parse(JSON.stringify(params.value))
    // 只传有值的项
    for (let key in params.value) {
      if (!params.value[key] && params.value[key] !== 0) {
        // 删除值不存在的项（有些code为0的通过）
        delete queryParams[key]      
      }
    }
    resolve(queryParams);
  });
}

// 搜索和重置
const emits = defineEmits(['search']);
function search() {
  emits('search');
}
/**
 * 重置筛选按钮
 */
function reset() {
  resetFilterData(props.data, false)
  emits('search');
}

/**
 * 重置筛选项
 */
function resetFilterData(newVal, isFirst) {
  filterData.value = []
  if (newVal?.length < rowSpanNum.value) {
    
    // 没有更多的情况
    newVal.forEach((item) => {
      if (item.default || item.default == 0) {
        params.value[item.prop] = item.default
      } else if (params.value[item.prop]) {
        delete params.value[item.prop]
      }
    })
  } else {
    // 更多的情况
    if (isFirst || !isMore.value) {
      // 收起状态
      props.data.forEach((item, index) => {
        // 删除节点
        if (index > rowSpanNum.value - 1 && params.value[item.prop] ) {
          delete params.value[item.prop]
        } else if (index < rowSpanNum.value - 1) {
          if (item.default || item.default == 0) {
            params.value[item.prop] = item.default
          } else params.value[item.prop] = ''
          // 更新筛选项
          filterData.value.push(item)
        }
      })
    } else {
      // 展开状态更新筛选项
      props.data.forEach(item => {
        if (item.default || item.default == 0) {
          params.value[item.prop] = item.default
        }
        filterData.value.push(item)
      })
    }
  }
}

// 更多
const isMore = ref(false)

/**
 * 展开收起
 */
function clickMore() {
  isMore.value = !isMore.value
  if (!isMore.value) {
    // 收起状态
    filterData.value = []
    props.data.forEach((item, index) => {
      // 删除节点
      if (index > rowSpanNum.value - 2 && params.value[item.prop] ) {
        delete params.value[item.prop]
      } else if (index < rowSpanNum.value - 1) {
        // 更新筛选项
        filterData.value.push(item)
      }
    })
  } else {
    // 展开状态更新筛选项
    props.data.forEach((item, index) => {
      if (index > rowSpanNum.value - 2) {
        filterData.value.push(item)
      }
    })
  }
}

onMounted(() => {
  rowSpanNum.value = window.innerWidth < 1230 ? 3 : (window.innerWidth < 1820 ? 4 : 5)
  // 首次加载
  resetFilterData(props.data, true)
})

defineExpose({
  getFilterData,
  reset
});

window.onresize = () => {
  // 适配屏幕大小，1920分辨率以下自动缩放页面
  let zoom = Math.min(
    window.innerWidth > 1920 ? 1 : window.innerWidth / 1920,
    window.innerHeight > 1080 ? 1 : window.innerHeight / 1080
  );
  document.body.style['zoom'] = Math.max(0.7, zoom);
  rowSpanNum.value = window.innerWidth < 1230 ? 3 : (window.innerWidth < 1820 ? 4 : 5)
};

watch(() => rowSpanNum.value, (newV, oldV) => {
  if (newV != oldV) {
    resetFilterData(props.data, false)
  }
})

</script>
<style lang="scss" scoped>
.filter_wrap {
  .filter_title {
    color: #000000;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.41px;
  }
  .filter_container {
    position: relative;
    margin-top: 16px;
    border-radius: 8px;
    padding: 18px 16px;
    background-color: white;
    font-size: 14px;
    .filter_more_cols {
      display: flex;
      height: 38px;
      justify-content: space-between;
      transition: 0.3s;
    }
    .filter_row_no_more {
      width: calc(100% - 300px);
    }
    .margin_more {
      margin-top: 16px;
    }
    .filter_col {
      display: flex;
      flex-direction: column;
      height: 100%;
      &:not(:last-child) {
        margin-right: 32px;
      }
    }

    .filter_button {
      height: 38px;
      letter-spacing: 4.2px;
    }
    .filter_more {
      position: relative;
      .more_btn_container {
        width: 100%;
        display: inline-block;
        text-align: right;
        .more {
          cursor: pointer;
          margin-left: 16px;
          color: #000000;
          font-size: 14px;
          font-weight: 400;
        }
        .el-icon {
          transition: transform 0.3s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .is_more {
          transform: rotate(180deg);
        }
      }
      .no_more_btn_container {
        top: 0;
      }
    }
    
    
  }
}
</style>
