const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        alias: '/search',
        component: () => import('pages/Search.vue')
      },
      {
        name: 'searchResults',
        path: '/search/results',
        component: () => import('pages/FlightResults.vue'),
        props: (route) => ({ ...route.params, ...route.query }) // converts query strings and params to props
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
