<template>
  <div class="home_container">
    <div class="head_container">
      <div class="display-flex-center">
        <img class="home_logo" src="@/assets/my.png" alt="" />
        <span class="head_text">智能风控</span>
      </div>
      <div class="display-flex-center">
        <img class="header_logo" src="@/assets/my.png" alt="" />
        <span class="header_text">{{ user?.userInfo?.userName }}</span>
      </div>
    </div>
    <div class="card_container display-flex-center">
      <div class="card_content">
        <div class="left_content">
          <div class="card_title">
            <span class="title">您好，欢迎使用智能风控</span>
            <span class="text"
              >您的智能守护专家您的智能守护专您的智能守护专家您的智能守护专家</span
            >
          </div>
          <div class="row">
            <div
              class="left_row_2 display-flex-column-center"
              v-for="(item, index) in leftRow2"
              :key="index"
              :style="'background-color: ' + item.background + ';'"
              @click="jumpTo(item.path)"
            >
              <img class="item_logo" :src="item.img" alt="" />
              <span class="item_title">{{ item.title }}</span>
            </div>
          </div>
          <div class="row">
            <div
              class="left_row_3 display-flex-column-center"
              v-for="(item, index) in leftRow3"
              :key="index"
              :style="'background-color: ' + item.background + ';'"
              @click="jumpTo(item.path)"
            >
              <img class="item_logo" :src="item.img" alt="" />
              <span class="item_title">{{ item.title }}</span>
            </div>
          </div>
        </div>
        <div class="right_content">
          <div class="row" v-for="(row, index) in rightRow" :key="index">
            <div
              class="right_row display-flex-column-center"
              v-for="(item, index) in row"
              :key="index"
              :style="'background-color: ' + item.background + ';'"
              @click="jumpTo(item.path)"
            >
              <img class="item_logo" :src="item.img" alt="" />
              <span class="item_title">{{ item.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import useStore from '@/store';
import { require_ } from '@/utils/require';

const { user } = useStore();

// 左边第二行
const leftRow2 = [
  {
    img: require_('@/assets/home/left2-1.png'),
    title: '以图搜图',
    background: '#53A5FF',
    path: '/picture'
  },
  {
    img: require_('@/assets/home/left2-2.png'),
    title: '图片验真',
    background: '#E09F3F',
    path: '/picture'
  },
  {
    img: require_('@/assets/home/left2-3.png'),
    title: '车辆风险',
    background: '#62C379',
    path: '/carRisk'
  },
  {
    img: require_('@/assets/home/left2-4.png'),
    title: '人员风险',
    background: '#859AFF',
    path: '/peopleRisk'
  },
  {
    img: require_('@/assets/home/left2-5.png'),
    title: '车险事后',
    background: '#C47FF1',
    path: '/socialRisk'
  }
];
// 左边最下部分
const leftRow3 = [
  {
    img: require_('@/assets/home/left3-1.png'),
    title: '企业信息库',
    background: '#C47FF1',
    path: '/companyInfo'
  },
  {
    img: require_('@/assets/home/left3-2.png'),
    title: '诉讼风险',
    background: '#62C379',
    path: '/companyRisk'
  }
];
// 右边
const rightRow = [
  [
    {
      img: require_('@/assets/home/right1-1.png'),
      title: '医疗图谱',
      background: '#53A5FF',
      path: '/medicinechart'
    },
    {
      img: require_('@/assets/home/right1-2.png'),
      title: '医院名录',
      background: '#E09F3F',
      path: '/medicineAtlas'
    }
  ],
  [
    {
      img: require_('@/assets/home/right2-1.png'),
      title: '药品分类与代码',
      background: '#859AFF',
      path: '/classificationOfDrugs'
    },
    {
      img: require_('@/assets/home/right2-2.png'),
      title: '医用耗材与代码',
      background: '#62C379',
      path: '/medicalSupplies'
    }
  ],
  [
    {
      img: require_('@/assets/home/right3-1.png'),
      title: '医疗服务项目分类代码',
      background: '#E09F3F',
      path: '/serviceItems'
    },
    {
      img: require_('@/assets/home/right3-2.png'),
      title: '疾病诊断、手术操作分类与代码',
      background: '#53A5FF',
      path: '/classificationCode'
    }
  ]
];

/**
 * 跳转
 * @param path
 */
function jumpTo(path: string) {
  if (path) router.push(path);
}
</script>

<style lang="scss" scoped>
.home_container {
  width: 100%;
  height: 100%;
  background: url('@/assets/home_bg.png') no-repeat center;
  background-size: cover;
  font-family: 'PingFang SC';
  letter-spacing: 1px;
  .head_container {
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .home_logo {
      width: 40px;
      height: 40px;
      border-radius: 13px;
      margin-left: 20px;
      margin-right: 12px;
    }
    .head_text {
      font-family: 'PingFang SC';
      font-size: 16px;
      color: white;
      font-weight: bold;
    }
    .header_logo {
      width: 30px;
      height: 30px;
      border-radius: 30px;
      margin-right: 12px;
    }
    .header_text {
      font-size: 14px;
      color: white;
      margin-right: 20px;
      font-family: 'Inter';
    }
  }
  .card_container {
    width: 100%;
    height: calc(100% - 60px);
    .card_content {
      display: flex;
      justify-content: space-between;
      .row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .left_content {
        height: 800px;
        width: 1150px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 53px;
        .card_title {
          width: 100%;
          height: 190px;
          background: url('@/assets/home/title_bg.png') no-repeat center;
          background-size: cover;
          border-radius: 10px;
          padding: 42px 35px;
          color: white;
          display: flex;
          flex-direction: column;
          .title {
            line-height: 50px;
            font-size: 30px;
            font-weight: 600;
          }
          .text {
            font-size: 20px;
            line-height: 32px;
            font-weight: 400;
            margin-top: 16px;
          }
        }
        .left_row_2 {
          width: 18%;
          height: 380px;
          border-radius: 10px;
          cursor: pointer;
        }
        .left_row_3 {
          width: 49%;
          height: 180px;
          border-radius: 10px;
          cursor: pointer;
        }
      }
      .right_content {
        width: 400px;
        height: 800px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .right_row {
          width: 190px;
          height: 250px;
          border-radius: 10px;
          cursor: pointer;
        }
      }
      .item_logo {
        width: 140px;
        height: 140px;
      }
      .item_title {
        text-align: center;
        font-size: 24px;
        font-weight: 400;
        color: white;
      }
    }
  }
}
</style>
