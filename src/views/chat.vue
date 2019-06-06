<template>
	<el-container id="chat-view">
		<el-aside class="chat-list-view">
			<el-container class="chat-list-inner-wrapper">
				<el-col :span="5" class="function-icon">
					<icon-list
						@logout="logout"
						@new_chat="new_chat"
						></icon-list>
				</el-col>
				<el-col :span="19">
					<el-row class="my-info">
						<user-info :info="my_info"></user-info>
					</el-row>
					<el-row class="list-view">
						<el-row class="list-content">
							<chat-list v-if="list_mode === 'chat'"
								:chats="chat_list"
								:text_limit="limit.text_limit"
								@open_chat="open_chat"
								></chat-list>
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
					<msg-list :messages="msg_arr"
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
			msg_arr:[],
			socket:null,
			socket_url:'ws://localhost/socket',
			limit:{
				text_limit:10
			},
			list_mode:'chat',
			my_info: {
				uid:'',
				name:'',
			},
			focused_group: {
				gid:'',
				name:''
			},
			chat_list: [{
					name:'',
					gid:'',
					msg_arr:[],
					unread:false
				}
			],
			msg_send_queue: [],
			focused_sending_msg_uuid: '',
			send_state: 'close',
		}
	},
	methods: {
		S4() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		},
		get_uuid() {
			return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
		},
		restore_msg_arr() {
			if (this.chat_list.length >= 1) {
				this.chat_list[0].msg_arr = this.msg_arr;
			}
		},
		get_user_info(uid) {
			let user_api = this.$url_prefix + '/api/user/info';
			this.$ajax.post(
				user_api,
				this.$qs.stringify({
					uid:uid,
				})
			).then(res => {
				console.log('get user info api', res);
				return res.data.data;
			}).catch(err => {
				return null;
			});
			return null;
		},
		new_chat(uid) {
			let friend = this.get_user_info(uid);
			if (friend === null) {
				that.$message({
					message:'找不到指定的用户(UID: '+uid+')',
					type:'error'
				});
				return false;
			}
			this.new_group(friend.name, friend.uid);
		},
		get_chat_list() {
			this.restore_msg_arr();
			let list_api = this.$url_prefix + '/api/list/get';
			let gids = '';
			this.chat_list = [];
			this.$ajax.post(
				list_api,
				this.$qs.stringify({
				})
			).then(res => {
				console.log('get chat list api', res);
				if (res.data.data === '') {
					res.data.data = [];
				}
				this.chat_list = res.data.data;
				this.update_focused_group();
			}).catch(err => {
				console.log('get chat list api err resp', err.response);
				// TODO: handle err
				return false;
			});
		},
		update_focused_group() {
			if (this.chat_list.length >= 1) {
				this.focused_group.gid = this.chat_list[0].gid;
				this.focused_group.name = this.chat_list[0].name;
			}
		},
		sync_chat_list() {
			let list_api = this.$url_prefix + '/api/list/update';
			let gids = '';
			for (let i = 0; i < this.chat_list.length; i++) {
				gids += this.chat_list.gid;
				if (i !== this.chat_list.length - 1) {
					gids += ';';
				}
			}
			this.$ajax.post(
				list_api,
				this.$qs.stringify({
					gids:gids
				})
			).then(res => {
				console.log('update chat list api', res);
			}).catch(err => {
				console.log('update chat list api err resp', err.response);
				// TODO: handle err
				return false;
			});
		},
		logout() {
			let logout_api = this.$url_prefix + '/api/user/logout';
			this.$ajax.post(
				logout_api,
				this.$qs.stringify({
				})
			);
			this.socket.close();
			this.$message({
				message:'退出登录成功',
				type:'success'
			});
			this.goto('login');
		},
		update_unread(gid, mid) {
			let unread_api = this.$url_prefix + '/api/hasread/update';
			console.log('update unread gid', gid);
			console.log('update unread mid', mid);
			this.$ajax.post(
				unread_api,
				this.$qs.stringify({
					gid:gid,
					last_mid:mid
				})
			).then(res => {
				console.log('update unread api', res);
			}).catch(err => {
				console.log('update unread api err resp', err.response);
			});
		},
		new_group(name, tuids) {
			if (tuids.indexOf(this.my_info.uid) === -1) {
				tuids.push(this.my_info.uid);
			}
			let uids = '';
			for (let i = 0; i < tuids.length; i++) {
				uids += tuids[i];
				if (i < tuids.length - 1) {
					uids += ';';
				}
			}
			console.log('new group uids', uids);
			let group_api = this.$url_prefix + '/api/group/new';
			this.$ajax.post(
				group_api,
				this.$qs.stringify({
					name:name,
					uids:uids
				})
			).then(res => {
				console.log('new group api', res);
				this.chat_list.push({
					name:name,
					gid: res.data.data.gid,
					msg_arr:[],
					unread:false
				});
				this.chat_list_to_top(res.data.data.gid);
				this.sync_chat_list();
			}).catch(err => {
				console.log('new group api err resp', err.response);
			});
		},
		chat_list_to_top(gid) {
			this.restore_msg_arr();
			for (let i = 0; i < this.chat_list.length; i++) {
				if (this.char_list[i].gid === gid) {
					this.chat_list.splice(i, 1);
					this.chat_list.unshift(this.chat_list[i]);
					this.msg_arr = this.chat_list[i].msg_arr;
					this.update_focused_group();
					return true;
				}
			}
			return false;
		},
		handle_msg(msg) {
			msg = JSON.parse(msg);
			if (msg['type'] === 'ack') {
				if (msg['sender_mid'] === this.focused_sending_msg_uuid) {
					this.send_state = 'done';
				}
			} else {
				if (msg.to === this.focused_group.gid) {
					this.msg_arr.push(msg);
					this.chat_list_to_top(msg.to);
					this.update_unread(msg.to, msg.mid);
				} else {
					for (let i = 0; i < this.chat_list.length; i++) {
						if (msg.to === this.chat_list[i].gid) {
							this.chat_list[i].msg_arr.push(msg);
							break;
						}
					}
				}
			}
		},
		send_msg(msg) {
			// 这里用send state以防止多次触发send_msg方法时重复发送消息的错误
			msg.sender_mid = this.get_uuid();
			this.msg_send_queue.push(msg);
			if (this.send_state === 'close') {
				this.send_state = 'sending';
				for (let i = 0; i < this.msg_send_queue.length; i++) {
					let now_msg = this.msg_send_queue[i];
					this.socket.send(now_msg);
					this.focused_sending_msg_uuid = now_msg.sender_mid;
					this.send_state = 'wait_ack';
					let now = new Date().getTime();
					while (this.send_state !== 'done') {
						if (new Date().getTime() - now > 3 * 1000 ) {
							// TODO: 超时处理
						}
					}
				}
				this.msg_send_queue = [];
				this.send_state = 'close';
			}
		},
		open_chat(group) {
			for (let i = 0; i < this.chat_list.length; i++) {
				if (this.chat_list[i].gid === group.gid) {
					this.msg_arr = this.chat_list[i].msg_arr;
					if (this.msg_arr.length !== 0) {
						this.update_unread(group.gid, this.msg_arr[this.msg_arr.length-1].mid);
					}
					this.chat_list_to_top(group.gid);
					break;
				}
			}
		},
		init_socket() {
			let that = this;
			if (that.socket === null) {
				that.socket = new WebSocket(that.socket_url);

				that.socket.onopen = function(evt) {
					console.log("Connection open ...");
				};

				that.socket.onmessage = function(evt) {
					console.log("Received Message:", evt);
					that.handle_msg(evt.data);
					let msg = JSON.parse(evt.data);
					if (msg.from !== that.my_info.uid) {
						that.$notify({
							title:'通知',
							message:'您收到一条新消息'
						});
					}
				};

				that.socket.onclose = function(evt) {
					console.log("Connection closed.");
					that.$message({
						message:'您与服务器已断开连接',
						type:'info'
					});
				};

				that.socket.onerror = function(evt) {
					console.log('error evt', evt);
					that.$message({
						message:'与服务器连接出错',
						type:'error'
					});
				};
			}
		},
		init_chat_list() {
			this.get_chat_list();
		},
		login_required() {
			let islogin_api = this.$url_prefix + '/api/user/islogin';
			this.$ajax.post(
				islogin_api,
				this.$qs.stringify({
				})
			).then(res => {
				this.my_info = res.data.data;
				return false;
			}).catch(err => {
				console.log('islogin api err resp', err.response);
				this.goto('login');
				this.$message({
					message:'请先登录',
					type:'info'
				});
				return false;
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
		this.login_required();
		this.init_chat_list();
		this.init_socket();
		console.log('socket', this.socket);
	},
	watch: {
		list_mode: function() {
			this.$refs.btn_chat_list.$el.style.backgroundColor = '';
			this.$refs.btn_chat_list.$el.style.color = '';
			if (this.list_mode === 'chat') {
				this.$refs.btn_chat_list.$el.style.backgroundColor = '#409EFF';
				this.$refs.btn_chat_list.$el.style.color = '#ffffff';
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
	height:-moz-available;
	height:-moz-fill-available;
	height:fill-available;
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
	width:-moz-available;
	width:-moz-fill-available;
	width:fill-available;
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
	height:-moz-available;
	height:-moz-fill-available;
	height:fill-available;
}
</style>
