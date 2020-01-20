const authority = ['admin', 'user'];

export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },

  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority,
    routes: [
      {
        path: '/',
        redirect: '/list/resumes',
      },
      {
        path: '/list/resumes',
        icon: 'table',
        name: 'app.menu.list.resume',
        component: './List/Resumes',
      },
      {
        component: '404',
      },
    ],
  },
];
