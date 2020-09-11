import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Main from '../views/Main.vue'
import Profile from '../components/Profile.vue'
import auth from '../services/auth'
Vue.use(VueRouter)

function requireAuth(to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    beforeEnter: requireAuth,
    children: [
      {
        path: 'profile',
        component: Profile
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (auth.loggedIn()) {
        // Don't let logged in users access the login page
        next('/')
      }
      next()
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: (to, from, next) => {
      if (auth.loggedIn()) {
        // Don't let logged in users access the register page
        next('/')
      }
      next()
    }
  },
  {
    path: '/logout',
    beforeEnter(to, from, next) {
      auth.logout(() => {
        next('/login')
      })

    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
