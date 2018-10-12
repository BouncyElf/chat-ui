<template>
	<el-row class="msg-sender-wrapper">
		<el-col :span="21" class="input-area">
			<el-input
				class="msg-input"
				type="textarea"
				placeholder="请输入内容"
				@keyup.enter.native="send"
				v-model="input_msg">
			</el-input>
		</el-col>
		<el-col :span="3" class="button-area">
			<el-button plain @click="send" class="send-button">发送</el-button>
		</el-col>
	</el-row>
</template>

<script>
export default {
	data() {
		return {
			input_msg: ''
		}
	},
	methods: {
		send() {
			this.$emit('send', this.input_msg);
			this.input_msg = '';
		}
	}
};
</script>

<style>
.msg-sender-wrapper {
	width:100%;
	height:-webkit-fill-available;
	height:-moz-available;
	height:-moz-fill-available;
	height:fill-available;
}

.msg-sender-wrapper * {
	background-color:transparent;
}

.input-area, .button-area {
	height:-webkit-fill-available;
	height:-moz-available;
	height:-moz-fill-available;
	height:fill-available;
}

.msg-input textarea {
	height:-webkit-fill-available;
	height:-moz-available;
	height:-moz-fill-available;
	height:fill-available;
	resize:none;
	border-radius:0;
	border-right-width:.5px;
}

.msg-input textarea:hover {
	background-color:#ffffff;
}

.send-button {
	width:-webkit-fill-available;
	width:-moz-available;
	width:-moz-fill-available;
	width:fill-available;
	height:-webkit-fill-available;
	height:-moz-available;
	height:-moz-fill-available;
	height:fill-available;
	border-radius:0;
	border-left-width:.5px;
}
</style>
