import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      // 首页
      path: '/home',
      name: 'home',
      component:()=>import('@/pages/home/home')
    },
    {
      // 地图
      path: '/',
      name: 'map',
      component:  () => import('@/pages/map/map'),
    },
  ]
})
