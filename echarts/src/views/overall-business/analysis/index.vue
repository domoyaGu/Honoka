<template>
  <div style="padding: 16px">
      <FilterWrap
        ref="filterWrap"
        :queryList="queryList"
        :form-span="8"
        @resetQuery="resetQuery"
        @handleQuery="handleQuery">
      </FilterWrap>
      <ListPage
        ref="listPage"
        :tabTheadAll="tabTheadAll"
        :dataList="dataList"
        :total="dataList.length"
        tabelTitle="人员列表"
        :operationWidth="220"
      >
        <template #operation="slot">
          <div>
            <el-button
              type="primary"
              link
              :icon="Search"
              @click="() => { router.push('/analysis/detail/33') }"
            >
              查看详情
            </el-button>
          </div>
        </template>
      </ListPage>
      <reportNewDialog ref="reportNewDialogRef"/>
      <ProcessDialog ref="processDialogRef"/>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { Search, DocumentCopy, CopyDocument, Plus} from '@element-plus/icons-vue';
import ListPage from '@/components/ListPage/index.vue';
import { getPage } from '@/api/overall-business/report';

// 筛选表单
const queryList = ref({
  baSource: {title: '工号', content: "", type: 'input'},
  baStatus: {title: '姓名', content: "", type: 'input'},
  insuredName: {title: '手机号', content: "", type: 'input'},
  insuredPhone: {title: '部门', content: "研发部", type: 'select', options: []},
  test: {title: '岗位', content: "", type: 'select', options: [{dictValue: '1', dictName: '前端开发'}]},
  carNumber: {title: '项目组', content: "", type: 'select', options: []},
  carVinNo: {title: '直属领导', content: "", type: 'select', options: []}
})

// 表头字段
const tabTheadAll = ref({
  staffNo: '编号',
  name: '姓名',
  age: '年龄',
  phone: '手机号',
  dept: '部门',
  test: '岗位',
  project: '项目组',
  leader: '直属领导',
  work: '最近工作强度'
});

//————————————————————————————————————分页相关——————————————————————————————————
const dataList = ref([{
  staffNo: '34',
  name: '李一一',
  age: '25',
  phone: '***',
  dept: '研发部',
  test: '前端开发',
  project: '文物项目组',
  leader: '陆龙',
  work: 1
},{
  staffNo: '18',
  name: '陆文良',
  age: '31',
  phone: '***',
  dept: '研发部',
  test: '前端开发',
  project: '保险项目组',
  leader: '陆龙',
  work: 1
},{
  staffNo: '21',
  name: '王飞',
  age: '24',
  phone: '***',
  dept: '研发部',
  test: '前端开发',
  project: '保险项目组',
  leader: '陆龙',
  work: 1
},{
  staffNo: '19',
  name: '夏伟',
  age: '28',
  phone: '***',
  dept: '研发部',
  test: '前端开发',
  project: '保险项目组',
  leader: '陆龙',
  work: 2
},{
  staffNo: '33',
  name: '张磊',
  age: '28',
  phone: '***',
  dept: '研发部',
  test: '前端开发',
  project: '保险项目组',
  leader: '陆龙',
  work: 1
}])

</script>

<style lang="scss" scoped>
</style>
