import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'items-view',
      component: require('@/components/ItemsView').default
    },
    {
      path: '/analyze',
      name: 'analyze-view',
      component: require('@/components/AnalyzeView').default
    },
    // {
    //   path: '/',
    //   name: 'welcome-view',
    //   component: require('@/components/WelcomeView').default
    // },
    {
      path: '/inspire',
      name: 'inspire',
      component: require('@/components/InspireView').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
