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
				icon="el-icon-plus"></el-button>
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
	</el-row>
</template>

<script>
export default {
	data() {
		return {
			logout_visible:false,
			new_chat_visible: false,
			all_friends:[],
			choosen:[],
			to_id:'',
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
			this.logout_visible = false;
			this.new_chat_visible = false;
		},
		hidden_dialog() {
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
