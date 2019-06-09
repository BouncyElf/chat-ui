<template>
	<el-row class="icon-wrapper">
		<el-row class="icon">
			<el-button
				circle
				@click="logout_dialog"
				icon="el-icon-close"></el-button>
			<el-dialog
				title="退出登录"
				:visible.sync="logout_visible">
				<span>是否退出当前帐号?</span>
				<span slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="logout">确 定</el-button>
				</span>
			</el-dialog>
		</el-row>
		<el-row class="icon">
			<el-button
				circle
				@click="new_chat_dialog"
				icon="el-icon-search"></el-button>
			<el-dialog
				title="发起聊天"
				:visible.sync="new_chat_visible">
				<span>请输入对方的ID: </span>
				<el-input v-model="to_id"
				placeholder="请输入对方的ID">
				</el-input>
				<span slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="new_chat">确 定</el-button>
				</span>
			</el-dialog>
		</el-row>
		<el-row class="icon">
			<el-button
				circle
				@click="new_group_dialog"
				icon="el-icon-plus"></el-button>
			<el-dialog
				title="新建群聊"
				:visible.sync="new_group_visible">
				<span>群聊名称: </span>
				<el-input v-model="group_chat_name"
				placeholder="群聊名称">
				</el-input>
				<el-transfer
					v-model="choosen"
					:titles="['用户列表', '添加进群组']"
					:data="show_users">
				</el-transfer>
				<span slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="new_group_chat">确 定</el-button>
				</span>
			</el-dialog>
		</el-row>
	</el-row>
</template>

<script>
export default {
	props:['all_users', 'my_uid'],
	data() {
		return {
			logout_visible:false,
			new_chat_visible: false,
			new_group_visible: false,
			show_users:[],
			choosen:[],
			to_id:'',
			group_chat_name:'',
			new_bio:''
		}
	},
	methods: {
		logout() {
			this.$emit('logout');
			this.hidden_dialog();
		},
		logout_dialog() {
			this.logout_visible = true;
		},
		new_group_chat() {
			if (this.choosen.length === 0 || this.group_chat_name.trim() === '') {
				this.cancel();
				return false;
			}
			this.$emit('new_group_chat', this.group_chat_name.trim(), this.choosen);
			this.hidden_dialog();
		},
		new_group_dialog() {
			this.$emit('get_all_users');
			this.choosen = [];
			this.show_users = [];
			for (let i = 0; i < this.all_users.length; i ++ ) {
				let disabled = false;
				if (this.all_users[i].uid === this.my_uid) {
					disabled = true;
				}
				this.show_users.push({
					key:this.all_users[i].uid,
					label:this.all_users[i].name,
					disabled:disabled
				});
			}
			this.new_group_visible = true;
		},
		new_chat() {
			let display_id = this.to_id.trim();
			if (display_id.length === 0) {
				this.cancel();
				return false;
			}
			this.$emit('new_chat', display_id);
			this.hidden_dialog();
		},
		new_chat_dialog() {
			this.new_chat_visible = true;
			this.to_id = '';
		},
		cancel() {
			this.new_group_visible = false;
			this.logout_visible = false;
			this.new_chat_visible = false;
		},
		hidden_dialog() {
			this.new_group_visible = false;
			this.logout_visible = false;
			this.new_chat_visible = false;
		}
	}
};
</script>

<style>
.icon-wrapper {
	width:100%;
	height:-webkit-fill-available;
	height:-moz-available;
	height:-moz-fill-available;
	height:fill-available;
	border-right:1px solid #dcdfe6;
}

.icon-wrapper .icon {
	width:100%;
	text-align:center;
	margin:0 auto;
	margin-top:1rem;
}

.el-dialog .el-input {
	width:30%;
}

.el-dialog .el-transfer {
	text-align:justify;
	width:fit-content;
	margin:0 auto;
}
</style>
