<template>
	<el-container id="chat-view">
		<el-aside class="chat-list-view">
			<el-container class="chat-list-inner-wrapper">
				<el-col :span="5" class="function-icon">
					<icon-list
						@logout="logout"
						@new_chat="new_chat"
						@new_group_chat="new_group_chat"
						@get_all_users="get_all_users"
						:all_users="all_users"
						:my_uid="my_info.uid"
						></icon-list>
				</el-col>
				<el-col :span="19">
					<el-row class="my-info">
						<user-info :info="my_info"></user-info>
					</el-row>
					<el-row class="list-view">
						<el-row class="list-content">
							<chat-list
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
					<group-info 
		 				@change_chat_name='change_chat_name'
						:group="focused_group"></group-info>
				</el-header>
				<el-main class="msg-list">
					<msg-list :messages="msg_arr"
						:myid="my_info.uid"></msg-list>
				</el-main>
				<el-footer class="msg-sender">
					<msg-sender @send="send_msg_btn"></msg-sender>
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
			all_users:[],
			socket:null,
			socket_url:'ws://localhost/socket',
			limit:{
				text_limit:10
			},
			my_info: {
				uid:'',
				name:'',
			},
			focused_group: {
				gid:'',
				name:''
			},
			chat_list: [],
			msg_send_queue: [],
			send_state: '0',
			send_once_lock: 'unlock'
		}
	},
	methods: {
		S4() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		},
		get_uuid() {
			return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
		},
		append_arr(origin_arr, values) {
			try {
				for (let i = 0; i < values.length; i++) {
					origin_arr.push(values[i]);
				}
				return origin_arr;
			} catch(err) {
				console.log('append error', err);
				return [];
			}
		},
		async get_all_users() {
			let user_api = this.$url_prefix + '/api/user/all';
			try {
				let res = await this.$ajax.post(
					user_api,
					this.$qs.stringify({
					})
				);
				console.log('get all users', res.data.data);
				this.all_users = res.data.data;
			} catch(err) {
				console.log('get all user error', err);
				return null;
			}
		},
		change_chat_name(group, new_name) {
			try{
				let group_api = this.$url_prefix + '/api/group/new/name';
				this.$ajax.post(
					group_api,
					this.$qs.stringify({
						gid:group.gid,
						name:new_name
					})
				);
				this.change_chat_name_local(group.gid, new_name);
				this.send_msg(this.new_action_msg(this.my_info.name+'更改群名为'+'"'+new_name+'"', {
					action:'change_chat_name',
					gid:group.gid,
					name:new_name
				}));
			} catch(err) {
				console.log('change chat name', err);
			}
		},
		change_chat_name_local(gid, name) {
			if (this.focused_group.gid === gid) {
				this.focused_group.name = name;
			}
			for (let i = 0; i < this.chat_list.length; i++) {
				if (this.chat_list[i].gid == gid) {
					this.chat_list[i].name = name;
					break;
				}
			}
		},
		new_group_chat(name, uid_arr) {
			return this.new_group(name, uid_arr);
		},
		restore_msg_arr() {
			if (this.msg_arr.length !== 0 && this.chat_list.length >= 1) {
				this.chat_list[0].msg_arr = this.append_arr([], this.msg_arr);
			}
		},
		async get_user_info(uid) {
			let user_api = this.$url_prefix + '/api/user/info';
			try {
				let res = await this.$ajax.post(
					user_api,
					this.$qs.stringify({
						uid:uid
					})
				);
				return res.data.data;
			} catch(err) {
				return null;
			}
			return null;
		},
		async new_chat(uid) {
			let friend = await this.get_user_info(uid);
			console.log(friend);
			if (friend === null) {
				this.$message({
					message:'找不到指定的用户(UID: '+uid+')',
					type:'error'
				});
				return false;
			}
			await this.new_group(friend.name+' & '+this.my_info.name, [friend.uid]);
		},
		get_chat_list() {
			try {
				this.restore_msg_arr();
				let list_api = this.$url_prefix + '/api/list/get';
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
					console.log('get chat list api err resp', err);
				});
			} catch(err) {
				console.log('get_chat_list error', err);
			}
		},
		update_focused_group() {
			if (this.chat_list.length >= 1) {
				this.focused_group.gid = this.chat_list[0].gid;
				this.focused_group.name = this.chat_list[0].name;
				this.msg_arr = this.append_arr([], this.chat_list[0].msg_arr);
			}
		},
		async sync_chat_list() {
			try {
				let list_api = this.$url_prefix + '/api/list/update';
				let gids = '';
				for (let i = 0; i < this.chat_list.length; i++) {
					gids += this.chat_list[i].gid;
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
					console.log('update chat list api err', err);
				});
			} catch(err) {
				console.log('sync_chat_list error', err);
			}
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
		async new_group(name, tuids) {
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
					name:res.data.data.name,
					gid: res.data.data.gid,
					msg_arr:[],
					unread:false
				});
				this.chat_list_to_top(res.data.data.gid);
				this.sync_chat_list();
			}).catch(err => {
				console.log('new group api err resp', err);
			});
		},
		chat_list_to_top(gid) {
			if (this.focused_group.gid === gid) {
				return;
			}
			for (let i = 0; i < this.chat_list.length; i++) {
				if (this.chat_list[i].gid === gid) {
					// 存储当前消息再更新消息
					this.restore_msg_arr();
					this.msg_arr = this.append_arr([], this.chat_list[i].msg_arr);

					// 将当前的聊天组放到第一个
					let temp = this.chat_list[i];
					this.chat_list.splice(i, 1);
					this.chat_list.unshift(temp);

					// 更新焦点聊天组
					this.update_focused_group();
					return true;
				}
			}
			return false;
		},
		async get_group_info(gid) {
			let group_api = this.$url_prefix + '/api/group/info';
			try {
				let res = await this.$ajax.post(
					group_api,
					this.$qs.stringify({
						gid:gid
					})
				);
				return res.data.data;
			} catch(err) {
				return null;
			}
			return null;
		},
		async handle_msg(msg) {
			console.log(msg, new Date().getTime());
			if (msg['type'] === 1) {
				this.send_once();
			} else if (msg['type'] === 3 && msg.from !== this.my_info.uid) {
				let extra = JSON.parse(msg.extra);
				if (extra.params.action === 'change_chat_name') {
					this.change_chat_name_local(extra.params.gid, extra.params.name);
					this.push_msg(msg);
				}
			} else {
				this.push_msg(msg);
			}
		},
		async push_msg(msg) {
			if (msg.to === this.focused_group.gid) {
				this.msg_arr.push(msg);
				this.update_unread(msg.to, msg.mid);
			} else {
				let handled = false;
				for (let i = 0; i < this.chat_list.length; i++) {
					if (msg.to === this.chat_list[i].gid) {
						handled = true;
						this.chat_list[i].msg_arr.push(msg);
						this.chat_list[i].unread = true;
						break;
					}
				}
				if (!handled) {
					let group = await this.get_group_info(msg.to);
					if (group === null) {
						this.$message({
							message:'收到了一条无法解析的消息',
							type:'error'
						});
					}
					this.chat_list.push({
						name:group.name,
						gid:group.gid,
						msg_arr:[msg],
						unread:true
					});
					this.sync_chat_list();
				}
			}
			this.socket.send(this.new_ack_msg(msg.mid));
		},
		new_ack_msg(mid) {
			return JSON.stringify({
				mid:mid,
				content:mid,
				type:2,
				from:this.my_info.uid
			});
		},
		new_action_msg(action, params) {
			return {
				sender_mid:this.get_uuid(),
				content:action,
				type:3,
				from:this.my_info.uid,
				to:this.focused_group.gid,
				extra:JSON.stringify({
					params:params,
					from_name:this.my_info.name,
					time:Date.parse(new Date())
				})
			};
		},
		new_msg(content) {
			return {
				sender_mid:this.get_uuid(),
				content:content,
				type:0,
				from:this.my_info.uid,
				to:this.focused_group.gid,
				extra:JSON.stringify({
					from_name:this.my_info.name,
					time:Date.parse(new Date())
				})
			};
		},
		send_msg_btn(content) {
			let msg = this.new_msg(content);
			console.log('new_msg', msg);
			this.send_msg(msg);
		},
		send_msg(msg) {
			console.log('sending msg', msg);
			this.msg_send_queue.push(msg);
			if (this.send_state === '0') {
				this.send_once();
			}
		},
		send_once() {
			if (this.send_once_lock === 'unlock') {
				this.send_once_lock = 'lock';
				this.send_state = '1';
				if (this.msg_send_queue.length >= 1) {
					let now_msg = this.msg_send_queue.shift();
					this.socket.send(JSON.stringify(now_msg));
				} else {
					this.send_state = '0';
				}
			}
			this.send_once_lock = 'unlock';
		},
		open_chat(group) {
			if (group.gid === this.focused_group.gid) {
				return;
			}
			for (let i = 0; i < this.chat_list.length; i++) {
				if (this.chat_list[i].gid === group.gid) {
					this.chat_list[i].unread = false;
					this.chat_list_to_top(group.gid);
					if (this.msg_arr.length !== 0) {
						this.update_unread(group.gid, this.msg_arr[this.msg_arr.length-1].mid);
					}
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
					let msg = JSON.parse(evt.data);
					that.handle_msg(msg);
					if (msg.type === 0 && msg.from !== that.my_info.uid) {
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
		this.get_all_users();
		console.log('socket', this.socket);
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
