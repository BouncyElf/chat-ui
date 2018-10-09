import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import ChatList from './components/chat_list.vue';
import FriendList from './components/friend_list.vue';
import UserInfo from './components/user_info.vue';
import IconList from './components/icon_list.vue';
import GroupInfo from './components/group_info.vue';
import MsgList from './components/msg_list.vue';
import MsgSender from './components/msg_sender.vue';
import Qs from 'qs';

Vue.config.productionTip = false;

Vue.use(ElementUI, axios, VueAxios);
Vue.component('chat-list', ChatList);
Vue.component('friend-list', FriendList);
Vue.component('user-info', UserInfo);
Vue.component('icon-list', IconList);
Vue.component('group-info', GroupInfo);
Vue.component('msg-list', MsgList);
Vue.component('msg-sender', MsgSender);
Vue.prototype.$ajax = axios;
Vue.prototype.$qs = Qs;

// var debugMode = 'debug';
var debugMode = '';

Vue.prototype.$debugMode = debugMode;

if (debugMode === 'debug') {
	Vue.prototype.$url_prefix = '/debug';
} else {
	Vue.prototype.$url_prefix = '';
}

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');

