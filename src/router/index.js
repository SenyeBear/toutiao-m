import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Layout from '@/views/Layout'
import Home from '@/views/Home'
import QA from '@/views/QA'
import Video from '@/views/Video'
import My from '@/views/My'
import SearchIndex from '@/views/Search'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    // nmae: Layout, // 如果父路由有子路由 它的name无意义
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home', // 为空 默认子路由 只能有一个
        name: 'home',
        component: Home,
      },
      {
        path: '/qa',
        name: 'qa',
        component: QA,
      },
      {
        path: '/video',
        name: 'video',
        component: Video,
      },
      {
        path: '/my',
        name: 'my',
        component: My,
      },
    ],
  },
  {
    path: '/search',
    name: 'search',
    component: SearchIndex
  },
  { 
    // 设置动态路由
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/Article'),
    // 开启props路由传参 把路由参数映射到组件的props
    props: true
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/UserProfile'),
  },
]

const router = new VueRouter({
  routes
})

export default router
