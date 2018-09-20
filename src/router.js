import Vue from 'vue'
import Router from 'vue-router'
import IndexView from './views/index'
import RegisterView from './views/regiter.vue'
import LoginView from './views/login.vue'
import ChatView from './views/chat.vue'

Vue.use(Router)

const router = new Router({
	routes: [
		{
			path: '/',
			name: 'index',
			component: IndexView,
			meta: {
			}
		},
		{
			path: '/register',
			name: 'register',
			component: RegisterView,
			meta: {
			}
		},
		{
			path: '/login',
			name: 'login',
			component: LoginView,
			meta: {
			}
		},
		{
			path: '/chat',
			name: 'chat',
			component: ChatView,
			meta: {
			}
		},
	]
})

var init_route = false;

router.beforeEach((to, from, next) => {
	if (!init_route) {
		init_route = true;
	}
	next()
})

export default router;

