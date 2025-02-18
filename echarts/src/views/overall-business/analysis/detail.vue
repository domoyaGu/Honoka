<template>
  <div style="margin: 20px;">
      <Collapse>
        <template #title><h1 style="margin-right: 10px;">基本信息</h1>
        <el-button type="primary" size="small" @click="showModel">胜任力模型</el-button>
        </template>
        <el-row>
          <el-col v-for="(item, key) in dataList" :key="key"
            :lg="{ span: 8 }" :md="{ span: 12 }" :sm="{ span: 24 }">
            <div class="detail-title">
              {{ item?.title }}
            </div>
            <div class="detail-content">
              {{ item?.content }}
            </div>
          </el-col>
        </el-row>
      </Collapse>
      <Collapse>
        <template #title><h1>个人属性</h1></template>
        <div style="display: flex; justify-content: space-around;">
          <div id="chartContainer1" style="width:600px;height: 400px;display: inline-block; margin: 20px;"/>
          <div id="chartContainer3" style="width:600px;height: 400px;display: inline-block; margin: 20px;"/>
        </div>
      </Collapse>
      <!-- <Collapse>
        <template #title><h1>特征关联</h1></template>
       <div id="chartContainer3" style="width:800px;height: 500px;display: inline-block; margin: 20px;"/>
      </Collapse> -->
      <el-dialog v-model="show" title="胜任力模型">
        <div id="chartContainer2" style="width:800px;height: 600px; margin: 20px;"/>
      </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';

const show =ref(false)

// 表单配置
const dataList = ref({
  staffNo: {title: '工号', content: "33", type: 'input'},
  name: {title: '姓名', content: "张磊", type: 'input'},
  age: {title: '年龄', content: "28", type: 'input'},
  phone: {title: '手机号', content: "15862463336", type: 'input'},
  dept: {title: '部门', content: "研发部", type: 'input'},
  test: {title: '岗位', content: "前端开发", type: 'input'},
  project: {title: '项目组', content: "文物项目组", type: 'input'},
  leader: {title: '直属领导', content: "陆*文龙", type: 'input'},
})
const comps = [
  "专业技术水平",
  "解决问题能力",
  "沟通能力",
  "积极性",
  "责任感",
  "抗压能力",
  "挑战能力",
  "专业基础知识",
  "专业外语",
  "影响力"
  ];

const compsPie = {
  legend: {
    top: 'bottom'
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      radius: [50, 250],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 3
      },
      data: [
        { value: 26.7, name: '专业技术水平' },
        { value: 18.8, name: '解决问题能力' },
        { value: 12.2, name: '沟通能力' },
        { value: 12.2, name: '积极性' },
        { value: 11.6, name: '责任感' },
        { value: 7.5, name: '其他' },
        { value: 6.1, name: '抗压能力' },
        { value: 4.5, name: '挑战能力' },
      ]
    }
  ]
};

const compsBar = {
  title: {
    text: '专业技术水平关联度'
  },
  xAxis: {
    type: 'category',
    data: comps.filter((item, index) => index != 0)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [
        0.70,
        0.65,
        0.77,
        0.63,
        0.74,
        0.64,
        {
          value: 0.90,
          itemStyle: {
            color: '#a90000'
          }
        },
        0.60,
        0.64
      ],
      type: 'bar'
    }
  ]
};


const scoreLine = {
  title: [
    {
      left: '10',
      text: '绩效评分曲线'
    },
    {
      right: '10',
      text: '今年预估≈85',
      textStyle: {
        lineHeight: '45',
      }
    }
  ],
    xAxis: {
      type: 'category',
      data: ['2017', '2018', '2019', '2020', '2021', '2022']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [75,80,85,80,80,85,85],
        type: 'line'
      }
    ]
  }

nextTick(() => {
  setTimeout(() => {
    const dom1 = document.getElementById("chartContainer1")
    const dom3 = document.getElementById("chartContainer3")
    if (dom1 && dom3) {
      const chart1 = echarts.init(dom1, 'dark') 
      chart1.setOption(scoreLine)
      const chart3 = echarts.init(dom3, 'dark') 
      chart3.setOption(compsBar)
    }
  }, 1000);
})

function showModel() {
  show.value = true
  nextTick(() => {
    setTimeout(() => {
    const dom2 = document.getElementById("chartContainer2")
      const chart2 = echarts.init(dom2) 
      chart2.setOption(compsPie)
    }, 1000);
  })
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
