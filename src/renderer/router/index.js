import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home').default
    },
    {
      path: '/editor',
      name: 'editor',
      component: require('@/components/Editor').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
