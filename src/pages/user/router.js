import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter)

let routerConfig=[
    {
        path:'/',
        redirect:'/home/square'//因为home后面加了多路径，所以这里设置一个
    },{
        path:'/home/:module',
        name:'home',
        component:()=>import('./views/Home')
    },{
        path:'/editarticle',
        name:'ediarticle',
        component:()=>import('./views/Article-Edit')
    },{
        path:'/article:id',
        name:'articledetail',
        component:()=>import('./views/Article-Detail')
    },{
        path:'/bolglist:searchKey',//:searchKey把搜索的都放在连接里面
        name:'bolglist',
        component:()=>import('./views/BolgList')
    },{
        path:'/chathome',
        name:'chathome',
        component:()=>import('./views/Chathome')
    }
]
export default new VueRouter({
    routes:routerConfig
})