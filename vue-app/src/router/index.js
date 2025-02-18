import VueRouter from "vue-router";
import Vue from "vue";

import Home from '../components/Home.vue'

Vue.use(VueRouter)

let router = new VueRouter({
    mode: "hash",
    routes: [
        {
            path:"/",
            //重定向
            redirect: "/home"
        },
        {
            name: "home",
            path: "/home",
            component: Home,
            children: [
                {
                    path:"/home",
                    //重定向
                    // redirect: "/home/child"()重定向到默认页面
                },
            ]
        },
        {
            name: "about",
            path: "/about",
            // 懒加载
            component: () => import('../components/About.vue')
        },
        {
            name: "notfound",
            path: "*",
            component: () => import('../components/NotFound.vue')
        },
    ]
})
// 全局路由守卫
router.beforeEach((to,from,next) => {
    // 校验未登录情况不准跳(权限控制)
    if (false) {
        next("/login")
    }
})

export default router;
