<template>
	<el-row class="msg_sender_wrapper">
		<el-col :span="21" class="input-area">
			<el-input
				class="msg-input"
				type="textarea"
				placeholder="请输入内容"
				v-model="message">
			</el-input>
		</el-col>
		<el-col :span="3" class="button-area">
			<el-button plain class="send-button">发送</el-button>
		</el-col>
	</el-row>
</template>

<script>
export default {
	props:['message']
};
</script>

<style>
.msg_sender_wrapper {
	width:100%;
	height:-webkit-fill-available;
}

.input-area, .button-area {
	height:-webkit-fill-available;
}

.msg-input textarea {
	height:-webkit-fill-available;
	resize:none;
	border-radius:0;
	border-right-width:.5px;
}

.send-button {
	width:-webkit-fill-available;
	height:-webkit-fill-available;
	border-radius:0;
	border-left-width:.5px;
}
</style>
