<template>
  <div style="padding: 16px">
    <div style="background: #fff;padding: 20px 0;border-radius: 8px;">
      <div class="title"><div style="display: flex"><div class="borde-div" />今日</div></div>
      <div style="display: flex;justify-content: space-around;flex-wrap: wrap">
        <div class="card bgclass">
          <p style="display: flex;align-items: center"><img style="width: 28px;height: 28px;" src="../../assets/bgimg/book.png" alt=""> &nbsp;&nbsp;新建报价单</p>
          <h4>{{ todayData.newBj }}</h4>
        </div>
        <div class="card bgclass1">
          <p style="display: flex;align-items: center"><img style="width: 28px;height: 28px;" src="../../assets/bgimg/yes.png" alt=""> &nbsp;&nbsp;投统成功</p>
          <h4>{{ todayData.newTc }}</h4>
        </div>
        <div class="card bgclass2">
          <p style="display: flex;align-items: center"><img style="width: 28px;height: 28px;" src="../../assets/bgimg/mony.png" alt=""> &nbsp;&nbsp;支付金额</p>
          <h4>¥{{ todayData.totalReceipts }}</h4>
        </div>
      </div>
    </div>
    <div style="display: flex;justify-content: space-between;flex-wrap: wrap">
      <div class="more-data">
        <div class="title"><div style="display: flex"><div class="borde-div" />本周</div><img style="width: 24px;height: 24px;margin-right: 20px" src="../../assets/bgimg/data-right.png" alt=""></div>
        <div style="margin-left: 20px;margin-top: 20px"><span>支付金额</span><h5>¥{{ weekData.totalReceipts }}</h5></div>
        <div style="display: flex;margin-left: 20px">
          <p style="width: 50%"><span>新建报价单</span><br><b>{{ weekData.newBj }}</b></p>
          <p style="width: 50%"><span>投统成功</span><br><b>{{ weekData.newTc }}</b></p>
        </div>
      </div>
      <div class="more-data">
        <div class="title"><div style="display: flex"><div class="borde-div" />本月</div><img style="width: 24px;height: 24px;margin-right: 20px" src="../../assets/bgimg/data-right.png" alt=""></div>
        <div style="margin-left: 20px;margin-top: 20px"><span>支付金额</span><h5>¥{{ monthData.totalReceipts }}</h5></div>
        <div style="display: flex;margin-left: 20px">
          <p style="width: 50%"><span>新建报价单</span><br><b>{{ monthData.newBj }}</b></p>
          <p style="width: 50%"><span>投统成功</span><br><b>{{ monthData.newTc }}</b></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
//接口
import { getStatistical } from '@/api/data-overview';
import { onMounted } from 'vue';

const todayData = reactive({
  newBj: '',
  newTc: '',
  totalReceipts: '',
  targetLicenseNo: ''
});
const weekData = reactive({
  newBj: '',
  newTc: '',
  totalReceipts: '',
  targetLicenseNo: ''
});
const monthData = reactive({
  newBj: '',
  newTc: '',
  totalReceipts: '',
  targetLicenseNo: ''
});

function getData() {
  getStatistical().then((response: any) => {
    if (response.code == 0) {
      const data = { ...response.data }
      const today = { ...data.today }
      const week = { ...data.week }
      const month = { ...data.month }
      todayData.newBj = today.newBj
      todayData.newTc = today.newTc
      todayData.totalReceipts = today.totalReceipts
      weekData.newBj = week.newBj
      weekData.newTc = week.newTc
      weekData.totalReceipts = week.totalReceipts
      monthData.newBj = month.newBj
      monthData.newTc = month.newTc
      monthData.totalReceipts = month.totalReceipts
    }
  })
    .catch((err) => {
      console.log(err)
    })
}

onMounted(() => {
  // getData();
});
</script>
<style scoped lang="scss">
.title{

  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #131414;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;

  .borde-div{
    width: 6px;
    height: 20px;
    border-radius: 0px 5px 5px 0px;
    background: #1891FF;
    margin-right: 15px;
  }

}
.bgclass1{
  background-image: url('../../assets/bgimg/green.png');
}
.bgclass{
  background-image: url('../../assets/bgimg/bolu.png');
}
.bgclass2{
  background-image: url('../../assets/bgimg/orang.png');
}
.card{
  //background-image: url('../../assets/bgimg/bolu.png');
  background-size: 120% 150%;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 20px;
  width: 25%;
  min-width: 350px;
  height: 180px;
  border-radius: 8px;
  padding: 0 22px;
  color: #fff;
  p{
    margin-top: 40px;
    margin-bottom: 22px;
    font-size: 18px;
    padding: 0;
  }
  h4{
    font-size: 48px;
    padding: 0;
    margin: 0;
  }
}
.more-data{
  background: #fff;
  width: 49.5%;
  min-width: 596px;
  height: 220px;
  margin-top: 20px;
  padding: 20px 0;
  border-radius: 8px;
  span{
    color: #909399;
    font-size: 14px;
  }
  b{
    font-size: 32px;
  }
  h5{
    color: #E43524;
    font-size: 32px;
    margin: 0;
    padding: 0;
  }
  .title{
    width: 100%;
  }
}

</style>
