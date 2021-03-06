import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home.vue'

Vue.use(Router)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/about.vue')
	}
]

const router = new Router({
	mode: 'history',
	// base: process.env.BASE_URL,
	routes
})

export default router
