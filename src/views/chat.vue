<template>
	<el-container id="chat-view">
		<el-aside class="chat-list-view">
			<el-container class="chat-list-inner-wrapper">
				<el-col :span="5" class="function-icon">
					<icon-list></icon-list>
				</el-col>
				<el-col :span="19">
					<el-row class="my-info">
						<user-info :name="name" :bio="bio"></user-info>
					</el-row>
					<el-row class="list-view">
						<el-row class="list-button-wrapper">
							<el-col :span="12" class="list-button-wrapper no-left-border no-right-border">
								<el-button plain type="primary" class="list-button" @click="changeListMode('chat')">聊天列表</el-button>
							</el-col>
							<el-col :span="12" class="list-button-wrapper no-right-border">
								<el-button plain type="primary" class="list-button" @click="changeListMode('friend')">好友列表</el-button>
							</el-col>
						</el-row>
						<el-row class="list-content">
							<chat-list v-if="list_mode === 'chat'"></chat-list>
							<friend-list v-else></friend-list>
						</el-row>
					</el-row>
				</el-col>
			</el-container>
		</el-aside>
		<el-main class="chat-main-view">
			<el-container class="chat-space">
				<el-header class="group-info">
					<group-info :name="group_name"></group-info>
				</el-header>
				<el-main class="msg-list">
					<msg-list :messages="focused_messages"></msg-list>
				</el-main>
				<el-footer class="msg-sender">
					<msg-sender :message="input_message"></msg-sender>
				</el-footer>
			</el-container>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			list_mode:'chat',
			name:'姓名',
			bio:'的技术性南昌市看阿斯顿框架阿三达到oasas',
			group_name:'group name here',
			input_message:'',
			focused_messages: [
				{
					from:'a',
					time:'2018-09-20 16:12:24',
					content:'123'
				},
				{
					from:'a',
					time:'2018-09-20 16:12:27',
					content:'113'
				},
				{
					from:'b',
					time:'2018-09-20 16:13:24',
					content:'223'
				},
				{
					from:'b',
					time:'2018-09-20 16:18:24',
					content:'121'
				}
			]
		}
	},
	methods: {
		changeListMode(mode) {
			this.list_mode = mode;
		},
		init_info() {
			let that = this;
			let info_api = that.$url_prefix + '/api/user/info';
			that.$ajax.post(
				info_api,
				that.$qs.stringify({
				})
			).then(res => {
				console.log(res);
				// TODO: ui update
			}).catch(err => {
				console.log(err.response);
				// TODO: handle err
			});
		},
		init_chat_list() {
			let that = this;
			let list_api = that.$url_prefix + '/api/list/get';
			that.$ajax.post(
				list_api,
				that.$qs.stringify({
				})
			).then(res => {
				console.log(res);
				// TODO: ui update
			}).catch(err => {
				console.log(err.response);
				// TODO: handle err
			});
		},
		init_friend_list() {
			let that = this;
			let friend_api = that.$url_prefix + '/api/friend/list';
			that.$ajax.post(
				friend_api,
				that.$qs.stringify({
				})
			).then(res => {
				console.log(res);
				// TODO: ui update
			}).catch(err => {
				console.log(err.response);
				// TODO: handle err
			});
		},
		login_required() {
			let that = this;
			let islogin_api = that.$url_prefix + '/api/user/islogin';
			that.$ajax.post(
				islogin_api,
				that.$qs.stringify({
				})
			).then(res => {
				return false;
			}).catch(err => {
				console.log(err.response);
				that.goto('login');
			});
		},
		goto(uri) {
			window.scrollTo(0,0);
			if (uri === '' || uri === undefined) {
				window.location.href="#/";
				return false;
			}
			window.location.href="#/"+uri;
		}
	},
	mounted: function() {
		// this.login_required();
		// this.init_info();
		// this.init_chat_list();
		// this.init_friend_list();
	}
};
</script>

<style>
#chat-view {
	width:100%;
	min-height:inherit;
}

.el-container, .el-main, .el-footer, .el-header {
	margin:0;
	padding:0;
}

.chat-list-view {
	width:30% !important;
	height:inherit;
}

.chat-main-view {
	width:70%;
	height:inherit;
	border-left:1px solid #dcdfe6;
	padding:0;
}

.chat-list-inner-wrapper {
	height:-webkit-fill-available;
}

.list-button-wrapper {
	text-align:center;
	border:1px solid #dcdfe6;
	border-top:.5px solid #dcdfe6;
	border-bottom:.5px solid #dcdfe6;
}

.list-button {
	width:-webkit-fill-available;
	border-radius:0;
	border:0;
	box-shadow:none;
	font-size:1rem;
}

.msg-sender {
	height:10rem !important;
}

.no-left-border {
	border-left:0;
}

.no-right-border {
	border-right:0;
}

.chat-space {
	padding:1rem;
	height:-webkit-fill-available;
}
</style>
