import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Main from '../views/Main.vue'
import Profile from '../components/Profile.vue'
import auth from '../services/auth'
Vue.use(VueRouter)

function requireNotLoggedIn(to, from, next) {
  auth.loggedIn((isLoggedIn) => {
    if (isLoggedIn) {
      next('/')
    }
    next()
  })
}

function requireAuth(to, from, next) {
  auth.loggedIn((isLoggedIn) => {
    if (isLoggedIn) {
      next()
    } else {
      next('/login')
    }
  })
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
        component: Profile,
        beforeEnter: requireAuth,
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: requireNotLoggedIn
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: requireNotLoggedIn
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
