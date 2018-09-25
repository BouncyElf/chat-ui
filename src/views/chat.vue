<template>
	<el-container id="chat-view">
		<el-aside class="chat-list-view">
			<el-container class="chat-list-inner-wrapper">
				<el-col :span="5" class="function-icon">
					<icon-list
						@new_group="new_group"
						@add_friend="add_friend"
						@update_info="update_info"
						></icon-list>
				</el-col>
				<el-col :span="19">
					<el-row class="my-info">
						<user-info :name="name" :bio="bio"></user-info>
					</el-row>
					<el-row class="list-view">
						<el-row class="button-wrapper">
							<el-col :span="12" class="list-button-wrapper no-left-border no-right-border">
								<el-button plain type="primary" class="list-button" @click="changeListMode('chat')">聊天列表</el-button>
							</el-col>
							<el-col :span="12" class="list-button-wrapper no-right-border">
								<el-button plain type="primary" class="list-button" @click="changeListMode('friend')">好友列表</el-button>
							</el-col>
						</el-row>
						<el-row class="list-content">
							<chat-list v-if="list_mode === 'chat'"
								:chats="chat_list"
								:text_limit="limit.text_limit"
								@open_chat="get_chat"
								></chat-list>
							<friend-list v-else
								:friends="friends"
								@chat_with="chat_with"
								></friend-list>
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
					<msg-list :messages="focused_messages"
						:myname="name"></msg-list>
				</el-main>
				<el-footer class="msg-sender">
					<msg-sender :message="input_message" @send="send_msg"></msg-sender>
				</el-footer>
			</el-container>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			limit:{
				text_limit:10
			},
			list_mode:'chat',
			name:'左手的泥,右手的你',
			bio:'个性签名',
			group_name:'风雨无阻',
			input_message:'',
			focused_messages: [
				{
					from:'风雨无阻',
					time:'2018-09-20 16:12:24',
					content:'在吗'
				}
			],
			friends:[
				{
					info:{
						name:'第一个名称',
						bio:'这里是我的个人简介阿三卡里的就;'
					},
					gid:'123321123'
				},
				{
					info:{
						name:'最后一个名称',
						bio:'这里是我的个人简介阿三卡里的就;'
					},
					gid:'123321123'
				}
			],
			chat_list: [
				{
					name:'第一个聊天名称',
					gid:'123321123',
					unread:true,
					msg: {
						content:'哈哈哈哈哈哈哈哈哈哈哈',
						time:'2018-06-06 14:12:23'
					}
				},
				{
					name:'最后一个聊天名称',
					gid:'123321123',
					unread:false,
					msg: {
						content:'哈哈哈哈哈哈哈哈哈哈哈',
						time:'2018-06-06 14:12:23'
					}
				}
			]
		}
	},
	methods: {
		new_group() {
			console.log('new_group');
		},
		add_friend() {
			console.log('add_friend');
		},
		update_info() {
			console.log('update_info');
		},
		chat_with(friend) {
			console.log(friend);
		},
		changeListMode(mode) {
			this.list_mode = mode;
		},
		get_chat(group) {
			console.log(group);
		},
		send_msg(msg) {
			let that = this;
			console.log(msg);
			that.focused_messages.push({
				from:that.name,
				time:'2018-09-20 16:18:24',
				content:msg
			});
			return false;
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
	background-color:#f7f7f7;
}

.el-container, .el-main, .el-footer, .el-header {
	margin:0;
	padding:0;
}

.chat-list-view {
	width:30% !important;
	height:inherit;
}

*::-webkit-scrollbar {
	display:none;
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

.my-info {
	height:13%;
}

.list-view {
	height:85%;
}

.button-wrapper {
	height:5%;
}

.list-button-wrapper {
	text-align:center;
	border:1px solid #dcdfe6;
}

.list-content {
	height:95%;
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
