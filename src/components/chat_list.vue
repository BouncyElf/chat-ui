<template>
	<el-row class="chat-list-wrapper">
		<el-button v-for="c in chats" class="chat" @click="open_chat(c)">
			<el-card class="chat-card" shadow="hover">
				<el-row class="chat-title">
					<el-col class="chat-name">{{ c.name }}</el-col>
					<el-badge v-if="c.unread" is-dot>
					</el-badge>
				</el-row>
			</el-card>
		</el-button>
	</el-row>
</template>

<script>
export default {
	props: ['chats', 'text_limit'],
	methods: {
		shorter(content) {
			let res = content;
			if (res.length >= this.text_limit) {
				res = res.substring(0, this.text_limit - 3) + '...';
			}
			return res;
		},
		open_chat(group) {
			this.$emit('open_chat', group);
		}
	}
};
</script>

<style>
.chat-list-wrapper {
	width:100%;
	height:100%;
	overflow-y:scroll;
}

.chat-list-wrapper .el-button+.el-button {
	margin-left:auto;
}

.chat {
	display:block;
	width:80%;
	margin:.5rem auto;
	margin-bottom:0;
	padding:0;
	border:0;
	border-radius:0;
	text-align:justify;
}

.chat-card {
	width:100%;
	height:100%;
}

.chat-name {
	font-size:1rem;
	font-weight:300;
}

.chat-last-msg {
	margin-top:.3rem;
	font-size:.8rem;
}
</style>
