import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: { 
        name: 'myOnlyLove' 
      },
      name: 'home',
      component: Home,
      children: [
        // {
        //   path: '/',
        //   name: 'user',
        //   component: () => import('./views/secPage/user.vue')
        // },
        {
          path: 'myOnlyLove',
          name: 'myOnlyLove',
          component: () => import('./views/secPage/myOnlyLove.vue')
        },
        {
          path: 'cdPage',
          name: 'cdPage',
          component: () => import('./views/secPage/cdPage.vue')
        },
        {
          path: 'addCd',
          name: 'addCd',
          component: () => import('./views/secPage/addCd.vue')
        },
        {
          path: 'addSong',
          name: 'addSong',
          component: () => import('./views/secPage/addSong.vue')
        },
        {
          path: 'putCd',
          name: 'putCd',
          component: () => import('./views/secPage/putCd.vue')
        },
        {
          path: 'workBGM',
          name: 'workBGM',
          component: () => import('./views/secPage/workBGM.vue')
        },
        {
          path: 'addWorkBGM',
          name: 'addWorkBGM',
          component: () => import('./views/secPage/addWorkBGM.vue')
        },
        {
          path: 'ddPlayPage',
          name: 'ddPlayPage',
          component: () => import('./views/secPage/ddPlayPage.vue')
        },
        {
          path: 'userAdd',
          name: 'userAdd',
          component: () => import('./views/secPage/userAdd.vue')
        },
        {
          path: 'userPut',
          name: 'userPut',
          component: () => import('./views/secPage/userPut.vue')
        }
      ]
    }
  ]
})
