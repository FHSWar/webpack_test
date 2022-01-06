import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/homeTest.vue'

const routes = [
	{
		path: '/',
		name: 'homeTest',
		component: Home
	},
	{
		path: '/ajvTest',
		name: 'ajvTest',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/ajvTest.vue')
	}
]

const router = createRouter({
	history: createWebHashHistory(), // process.env.BASE_URL
	routes
})

export default router
