<template>
	<el-row class="icon-wrapper">
		<el-row>
			<el-button
				circle
				@click="new_group_dialog"
				icon="el-icon-plus"></el-button>
			<el-dialog
				title="新建群组"
				:visible.sync="new_group_visible">
				<el-transfer
					v-model="choosen"
					:data="all_friends">
				</el-transfer>
				<span slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="new_group">确 定</el-button>
				</span>
			</el-dialog>
		</el-row>
		<el-row>
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
		<el-row>
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
	data() {
		return {
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
		new_group() {
			this.$emit('new_group');
		},
		new_group_dialog() {
			this.new_group_visible = true;
		},
		add_friend() {
			this.$emit('add_friend');
		},
		add_friend_dialog() {
			this.add_friend_visible = true;
		},
		update_info() {
			this.$emit('update_info');
		},
		update_info_dialog() {
			this.update_info_visible = true;
		},
		cancel() {
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
	text-align:center;
	border-right:1px solid #dcdfe6;
}

.icon-wrapper .el-row {
	width:100%;
	text-align:center;
	margin:0 auto;
	margin-top:1rem;
}

.el-dialog .el-input {
	width:30%;
}
</style>
