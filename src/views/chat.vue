<template>
	<el-container id="chat-view">
		<el-aside class="chat-list-view">
			<el-container class="chat-list-inner-wrapper">
				<el-col :span="5" class="function-icon">
					<icon-list
						:friend_list="friends"
						@logout="logout"
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
								@open_chat="open_chat"
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
					<msg-list :messages="msg_arr"
						@add_friend_request="friend_request"
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
			socket_url:'ws://localhost:1212/socket',
			limit:{
				text_limit:10
			},
			list_mode:'chat',
			my_info: {
				uid:'',
				name:'',
				bio:'',
				display_id:''
			},
			focused_group: {
				gid:'',
				name:''
			},
			friends:[
				{
					info:{
						uid:'',
						name:'',
						display_id:'',
						bio:''
					},
					gid:''
				}
			],
			chat_list: [
				{
					name:'',
					gid:'',
					unread:false
				}
			]
		}
	},
	methods: {
		update_chat_list() {
			let that = this;
			let list_api = that.$url_prefix + '/api/list/get';
			let gids = '';
			that.chat_list = [];
			that.$ajax.post(
				list_api,
				that.$qs.stringify({
				})
			).then(res => {
				console.log('update chat list api', res);
				if (res.data.data === '') {
					res.data.data = [];
				}
				that.chat_list = res.data.data;
			}).catch(err => {
				console.log('update chat list api err resp', err.response);
				// TODO: handle err
				return false;
			});

			let system_msg_api = that.$url_prefix + '/api/message/system';
			that.$ajax.post(
				system_msg_api,
				that.$qs.stringify({
				})
			).then(res => {
				console.log('system msg api', res);
				that.chat_list.unshift({
					name:'系统消息',
					gid:that.my_info.uid,
					uids:that.my_info.uid,
					unread:res.data.data.unread
				});
				console.log('chat list in system msg api', that.chat_list);
			}).catch(err => {
				console.log('system msg api err', err);
				console.log('system msg api err resp', err.response);
			});
		},
		logout() {
			let that = this;
			let logout_api = that.$url_prefix + '/api/user/logout';
			that.$ajax.post(
				logout_api,
				that.$qs.stringify({
				})
			);
			that.socket.close();
			that.$message({
				message:'退出登录成功',
				type:'success'
			});
			that.goto('login');
		},
		friend_request(tuid) {
			let that = this;
			that.$confirm('是否同意该好友请求?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info'
			}).then(() => {
				let friend_api = that.$url_prefix + '/api/friend/confirm/friend';
				that.$ajax.post(
					friend_api,
					that.$qs.stringify({
						tuid: tuid
					})
				).then(res => {
					console.log('confirm friend res', res);
					that.$message({
						message:'已将其添加为好友',
						type:'success'
					});
					that.update_friend_list();
				}).catch(err => {
					console.log('confirm friend err resp', err.response);
					that.$message({
						message:'出了一些错误',
						type:'error'
					});
				});
			}).catch(() => {
			});
		},
		update_friend_list() {
			let that = this;
			let friend_api = that.$url_prefix + '/api/friend/list';
			that.$ajax.post(
				friend_api,
				that.$qs.stringify({
				})
			).then(res => {
				console.log('friend list api', res);
				if (res.data.data === '') {
					res.data.data = [];
				}
				that.friends = res.data.data;
			}).catch(err => {
				console.log('friend list api err resp', err.response);
				// TODO: handle err
				return false;
			});
		},
		update_unread(gid, mid) {
			let that = this;
			let unread_api = that.$url_prefix + '/api/unread/update';
			console.log('update unread gid', gid);
			console.log('update unread mid', mid);
			that.$ajax.post(
				unread_api,
				that.$qs.stringify({
					gid:gid,
					last_mid:mid
				})
			).then(res => {
				console.log('update unread api', res);
			}).catch(err => {
				console.log('update unread api err resp', err.response);
			});
		},
		new_group(tuids) {
			let that = this;
			if (tuids.indexOf(that.my_info.uid) === -1) {
				tuids.push(that.my_info.uid);
			}
			let uids = '';
			for (let i = 0; i < tuids.length; i++) {
				uids += tuids[i];
				if (i < tuids.length - 1) {
					uids += ';';
				}
			}
			console.log('new group uids', uids);
			let group_api = that.$url_prefix + '/api/group/new';
			that.$ajax.post(
				group_api,
				that.$qs.stringify({
					tuids:uids
				})
			).then(res => {
				console.log('new group api', res);
				that.$message({
					message:'创建群聊成功',
					type:'success'
				});
				that.update_chat_list();
			}).catch(err => {
				console.log('new group api err resp', err.response);
			});
		},
		add_friend(display_id) {
			console.log('add friend display_id', display_id);
			let that = this;
			let friend_api = that.$url_prefix + '/api/friend/add';
			that.$ajax.post(
				friend_api,
				that.$qs.stringify({
					display_id:display_id
				})
			).then(res => {
				console.log('add friend api', res);
				that.$message({
					message:'已发送好友请求',
					type:'success'
				});
			}).catch(err => {
				console.log('add friend api err resp', err.response);
			});
		},
		update_info(new_bio) {
			console.log('update info new bio', new_bio);
			let that = this;
			let info_api = that.$url_prefix + '/api/user/bio/update';
			that.$ajax.post(
				info_api,
				that.$qs.stringify({
					bio:new_bio
				})
			).then(res => {
				console.log('update bio res', res);
				that.my_info.bio = new_bio;
			}).catch(err => {
				console.log('update bio err resp', err.response);
			});
		},
		chat_list_to_top(gid) {
			let that = this;
			for (let i = 0; i < that.chat_list.length; i++) {
				let tgroup = that.chat_list[i];
				if (tgroup.gid === gid) {
					that.chat_list.splice(i, 1);
					that.chat_list.unshift(tgroup);
					return true;
				}
			}
			return false;
		},
		handle_msg(msg) {
			msg = JSON.parse(msg);
			let that = this;
			if (msg['type'] === 'plain') {
				if (msg.to === that.focused_group.gid) {
					that.msg_arr.push(msg);
					that.chat_list_to_top(msg.to);
					that.update_unread(msg.to, msg.mid);
				} else {
					that.update_chat_list();
				}
			} else if (msg['type'].indexOf('system') !== -1) {
				let inChatList = false;
				for (let i = 0; i < that.chat_list.length; i++) {
					let tChat = that.chat_list[i];
					if (tChat.gid === that.my_info.uid) {
						inChatList = true;
						that.chat_list.splice(i, 1);
						if (tChat.unread === false && that.focused_group.gid !== tChat.gid) {
							tChat.unread = true;
						}
						if (that.focused_group.gid === that.my_info.uid) {
							that.update_unread(that.my_info.uid, msg.mid);
						}
						that.chat_list.unshift(tChat);
						break;
					}
				}
				if (!inChatList) {
					that.chat_list.unshift({
						name:'系统消息',
						gid:msg.to,
						unread:true
					});
				}
			} else {
				// TODO: other
			}
		},
		chat_with(friend) {
			let that = this;
			let isInList = false;
			let this_group = {};
			that.changeListMode('chat');
			console.log('chat with friend', friend);
			console.log('chat with friend chat list', that.chat_list);
			for (let i = 0; i < that.chat_list.length; i++) {
				if (that.chat_list[i].gid !== undefined &&
					that.chat_list[i].gid === friend.gid) {
					this_group = that.chat_list[i];
					that.chat_list.splice(i, 1);
					that.chat_list.unshift(this_group);
					isInList = true;
					break;
				}
			}

			if (!isInList) {
				this_group = {
					name:friend.info.name,
					gid:friend.gid,
					unread:false
				};
				that.chat_list.unshift(this_group);
			}

			that.open_chat(this_group);
		},
		changeListMode(mode) {
			this.list_mode = mode;
		},
		open_chat(group) {
			console.log('group', group);
			let that = this;
			let msg_api = that.$url_prefix + '/api/message/recent';
			that.focused_group = group;
			that.$ajax.post(
				msg_api,
				that.$qs.stringify({
					gid:group.gid
				})
			).then(res => {
				console.log('recent msg api res', res);
				that.msg_arr = res.data.data;
				that.chat_list[that.chat_list.indexOf(group)].unread = false;
				if (that.msg_arr.length !== 0) {
					that.update_unread(group.gid, that.msg_arr[that.msg_arr.length-1].mid);
				}
			}).catch(err => {
				console.log('recent msg api err', err);
				console.log('recent msg api err resp', err.response);
			});
		},
		send_msg(msg) {
			let that = this;
			if (that.focused_group === undefined) {
				that.$message({
					message:'未指定聊天',
					type:'error'
				});
				return false;
			}
			console.log('focused_group', that.focused_group);
			that.socket.send(JSON.stringify({
				to:that.focused_group.gid,
				type:'plain',
				content:msg
			}));
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
		init_info() {
			let that = this;
			let info_api = that.$url_prefix + '/api/user/info';
			that.$ajax.post(
				info_api,
				that.$qs.stringify({
				})
			).then(res => {
				console.log('user info api res', res);
				that.my_info = res.data.data;
			}).catch(err => {
				console.log('user info api err resp', err.response);
				return false;
			});
		},
		init_chat_list() {
			this.update_chat_list();
		},
		init_friend_list() {
			this.update_friend_list();
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
				console.log('islogin api err resp', err.response);
				that.goto('login');
				that.$message({
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
		this.init_info();
		this.init_chat_list();
		this.init_friend_list();
		this.init_socket();
		this.changeListMode('chat');
		console.log('socket', this.socket);
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
