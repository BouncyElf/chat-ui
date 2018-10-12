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
				@click="new_group_dialog"
				icon="el-icon-plus"></el-button>
			<el-dialog
				title="新建群组"
				:visible.sync="new_group_visible">
				<el-transfer
					v-model="choosen"
					:titles="['好友列表', '添加进群组']"
					:data="all_friends">
				</el-transfer>
				<span slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="new_group">确 定</el-button>
				</span>
			</el-dialog>
		</el-row>
		<el-row class="icon">
			<el-button
				circle
				@click="add_friend_dialog"
				icon="el-icon-search"></el-button>
			<el-dialog
				title="添加好友"
				:visible.sync="add_friend_visible">
				<span>请输入对方的Display ID: </span>
				<el-input v-model="friend_display_id"
				placeholder="请输入对方的Display ID">
				</el-input>
				<span slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="add_friend">确 定</el-button>
				</span>
			</el-dialog>
		</el-row>
		<el-row class="icon">
			<el-button
				circle
				@click="update_info_dialog"
				icon="el-icon-setting"></el-button>
			<el-dialog
				title="更改信息"
				:visible.sync="update_info_visible">
				<span>请输入新的个性签名</span>
				<el-input v-model="new_bio"
					type="textarea"
					resize="none"
				placeholder="请输入新的个性签名">
				</el-input>
				<span slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="update_info">确 定</el-button>
				</span>
			</el-dialog>
		</el-row>
	</el-row>
</template>

<script>
export default {
	props:['friend_list'],
	data() {
		return {
			logout_visible:false,
			new_group_visible:false,
			add_friend_visible: false,
			update_info_visible: false,
			all_friends:[],
			choosen:[],
			friend_display_id:'',
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
		new_group() {
			if (this.choosen.length === 0) {
				this.cancel();
				return false;
			}
			this.$emit('new_group', this.choosen);
			this.hidden_dialog();
		},
		new_group_dialog() {
			let that = this;
			that.all_friends = [];
			that.choosen = [];
			for (let i = 0; i < that.friend_list.length; i ++ ) {
				that.all_friends.push({
					key:that.friend_list[i].info.uid,
					label:that.friend_list[i].info.name
				});
			}
			that.new_group_visible = true;
		},
		add_friend() {
			let display_id = this.friend_display_id.trim();
			if (display_id.length === 0) {
				this.cancel();
				return false;
			}
			this.$emit('add_friend', display_id);
			this.hidden_dialog();
		},
		add_friend_dialog() {
			this.add_friend_visible = true;
			this.friend_display_id = '';
		},
		update_info() {
			let new_bio = this.new_bio.trim();
			if (new_bio.length === 0) {
				this.cancel();
				return false;
			}
			this.$emit('update_info', new_bio);
			this.hidden_dialog();
		},
		update_info_dialog() {
			this.update_info_visible = true;
			this.new_bio = '';
		},
		cancel() {
			this.logout_visible = false;
			this.new_group_visible = false;
			this.add_friend_visible = false;
			this.update_info_visible = false;
		},
		hidden_dialog() {
			this.logout_visible = false;
			this.new_group_visible = false;
			this.add_friend_visible = false;
			this.update_info_visible = false;
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
