<template>
	<el-container id="chat-view">
		<el-aside class="chat-list-view">
			<el-container class="chat-list-inner-wrapper">
				<el-col :span="5" class="function-icon">
					<icon-list
						:friend_list="friends"
						@new_group="new_group"
						@add_friend="add_friend"
						@update_info="update_info"
						></icon-list>
				</el-col>
				<el-col :span="19">
					<el-row class="my-info">
						<user-info :info="my_info"></user-info>
					</el-row>
					<el-row class="list-view">
						<el-row class="button-wrapper">
							<el-col :span="12" class="list-button-wrapper no-left-border no-right-border">
								<el-button
									plain
									type="primary"
									class="list-button"
									@click="changeListMode('chat')"
									ref="btn_chat_list"
									>聊天列表</el-button>
							</el-col>
							<el-col :span="12" class="list-button-wrapper no-right-border">
								<el-button
									plain
									type="primary"
									class="list-button"
									@click="changeListMode('friend')"
									ref="btn_friend_list"
									>好友列表</el-button>
							</el-col>
						</el-row>
						<el-row class="list-content">
							<chat-list v-if="list_mode === 'chat'"
								:chats="chat_list"
								:text_limit="limit.text_limit"
								@open_chat="init_chat"
								></chat-list>
							<friend-list v-else
								:friends="friends"
								:text_limit="limit.text_limit"
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
					<group-info :name="focused_group.name"></group-info>
				</el-header>
				<el-main class="msg-list">
					<msg-list :messages="focused_group.msg"
						:myname="my_info.name"></msg-list>
				</el-main>
				<el-footer class="msg-sender">
					<msg-sender @send="send_msg"></msg-sender>
				</el-footer>
			</el-container>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			arr:[],
			socket:null,
			socket_url:'ws://localhost:1212/socket',
			limit:{
				text_limit:10
			},
			list_mode:'chat',
			my_info: {
				uid:'123123123123123',
				name:'雷布斯',
				bio:'个性签名',
				display_id:'123321123'
			},
			focused_group: {
				gid:'',
				name:'',
				msg: this.arr
			},
			friends:[
				{
					info:{
						uid:'3213123321123',
						name:'张益达',
						display_id:'321123321',
						bio:'我心里有一个秘密, 不打算告诉任何人'
					},
					gid:'1233211232'
				},
				{
					info:{
						uid:'123321123',
						name:'小红',
						display_id:'321123321',
						bio:'真正的装逼，敢于直面本身没有厚度的脸皮。'
					},
					gid:'1233211231'
				}
			],
			chat_list: [
				{
					name:'开心群聊',
					gid:'123321123',
					unread:true,
					show_msg: {
						mid: '1233211232',
						from_name:'张益达',
						content:'zz',
						time:'2018-06-06 14:12:23'
					},
					msg:[]
				},
				{
					name:'小红',
					gid:'1233211231',
					unread:false,
					show_msg: {
						mid: '123321121',
						from_name:'小红',
						content:'一直勉强相处,总会累垮',
						time:'2018-06-06 14:12:23'
					},
					msg:[]
				}
			]
		}
	},
	methods: {
		update_unread(gid, mid) {
			console.log(gid);
			console.log(mid);
		},
		new_group(tuids) {
			let that = this;
			if (tuids.indexOf(that.my_info.uid) === -1) {
				tuids.push(that.my_info.uid);
			}
			console.log(tuids);
		},
		add_friend(display_id) {
			console.log(display_id);
		},
		update_info(new_bio) {
			console.log(new_bio);
		},
		chat_with(friend) {
			let that = this;
			let isInList = false;
			let this_group = {};
			that.changeListMode('chat');
			for (let i = 0; i < that.chat_list.length; i++) {
				if (that.chat_list[i].gid !== undefined &&
					that.chat_list[i].gid === friend.gid) {
					this_group = that.chat_list[i];
					that.chat_list.splice(i, 1);
					that.chat_list.unshift(this_group);
					isInList = true;
				}
			}

			console.log(isInList);

			if (!isInList) {
				// TODO: axios to get last msg
				this_group = {
					name:friend.info.name,
					gid:friend.gid,
					unread:false,
					show_msg: {
						// NOTICE: get from backend
						mid: '12309123',
						from_name:friend.info.name,
						content:'ok',
						time:'2018-06-06 14:12:23'
					}
				};
				that.chat_list.unshift(this_group);
			}

			that.init_chat(this_group);
		},
		changeListMode(mode) {
			this.list_mode = mode;
		},
		init_chat(group) {
			console.log(group);
			let that = this;
			that.focused_group = group;
			if (that.focused_group.msg === undefined || that.focused_group.msg === []) {
				if (that.focused_group.show_msg !== undefined) {
					that.arr = [];
					that.arr.push(that.focused_group.show_msg);
					that.focused_group.msg = that.arr;
				}
			}
			console.log(that.focused_group);
			that.chat_list[that.chat_list.indexOf(group)].unread = false;
			that.update_unread(group.gid, group.msg.mid);
		},
		send_msg(msg) {
			this.focused_group.msg.push({
				from_name:this.my_info.name,
				time:'2018-09-20 16:18:24',
				content:msg
			});
			console.log(this.focused_group.msg);
			return false;
		},
		init_socket() {
			let that = this;
			if (that.socket === null) {
				that.socket = new WebSocket(that.socket_url);

				that.socket.onopen = function(evt) {
					console.log("Connection open ...");
				};

				that.socket.onmessage = function(evt) {
					console.log("Received Message: ");
					console.log(evt);
				};

				that.socket.onclose = function(evt) {
					console.log("Connection closed.");
				};

				that.socket.onerror = function(evt) {
					console.log(evt);
				};
			}
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
			// TODO: get last msg
			// TODO: get system notify message
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
		// this.init_socket();
		this.changeListMode('chat');
		console.log(this.socket);
	},
	watch: {
		list_mode: function() {
			this.$refs.btn_chat_list.$el.style.backgroundColor = '';
			this.$refs.btn_chat_list.$el.style.color = '';
			this.$refs.btn_friend_list.$el.style.backgroundColor = '';
			this.$refs.btn_friend_list.$el.style.color = '';
			if (this.list_mode === 'chat') {
				this.$refs.btn_chat_list.$el.style.backgroundColor = '#409EFF';
				this.$refs.btn_chat_list.$el.style.color = '#ffffff';
			} else {
				this.$refs.btn_friend_list.$el.style.backgroundColor = '#409EFF';
				this.$refs.btn_friend_list.$el.style.color = '#ffffff';
			}
		}
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
	height:20%;
}

.list-view {
	height:70%;
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
