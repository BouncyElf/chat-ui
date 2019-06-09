<template>
	<el-row class="group-info-wrapper">
		<el-button 
	  		type="text"
			@click="change_name_dialog">{{ group.name }}</el-button>
			<el-dialog
				title="更换聊天名称"
				:visible.sync="change_name_dialog_visible">
				<el-input v-model="new_name"
				placeholder="请输入新的聊天名称">
				</el-input>
				<span slot="footer" class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="change_name">确 定</el-button>
				</span>
			</el-dialog>
	</el-row>
</template>

<script>
export default {
	props:['group'],
	data() {
		return {
			new_name:'',
			change_name_dialog_visible:false,
		}
	},
	methods:{
		change_name_dialog() {
			this.change_name_dialog_visible = true;
		},
		change_name() {
			if (this.new_name.trim() !== '') {
				this.$emit('change_chat_name', this.group, this.new_name.trim());
			}
			this.change_name_dialog_visible = false;
		},
		cancel() {
			this.change_name_dialog_visible = false;
		}
	}
};
</script>

<style>
.group-info-wrapper {
	width:100%;
	text-align:center;
	border-bottom:1px solid #dcdfe6;
}
</style>
