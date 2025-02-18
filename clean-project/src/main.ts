import { createApp, Directive } from 'vue';
import App from './App.vue';
import router from '@/router';

// 状态存储
import { createPinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist';

import ElementPlus from 'element-plus';
// element组件中文版本
import locale from 'element-plus/lib/locale/lang/zh-cn';
import 'element-plus/theme-chalk/index.css';
import '@/permission';

import 'default-passive-events';

// 引入svg注册脚本
import 'virtual:svg-icons-register';

// 国际化
// import i18n from '@/lang/index';

// 自定义样式
import '@/styles/index.scss';

// 根据字典编码获取字典列表全局方法
// import { getDictItemsByTypeCode } from '@/api/system/dict';

const app = createApp(App);

// 自定义指令
// import * as directive from '@/directive';

// Object.keys(directive).forEach((key) => {
//   app.directive(key, (directive as { [key: string]: Directive })[key]);
// });

// 状态存储开启持久化
const pinia = createPinia();
pinia.use(piniaPluginPersist)

// 注册全局组件
app
  .use(pinia)
  .use(router)
  .use(ElementPlus, {locale})
  // .use(i18n)
  .mount('#app');


