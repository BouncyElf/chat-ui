<template>
	<el-row class="msg-list-wrapper">
		<el-row class="flex" v-for="msg in messages">
			<el-row class="right" v-if="msg.type === 0 && msg.from === myid">
				<p v-popover:popover><span class="msg-content">&nbsp;{{ msg.content }}&nbsp;</span>&nbsp;:({{ JSON.parse(msg.extra).time }})&nbsp;{{ JSON.parse(msg.extra).from_name }}</p>
			</el-row>
			<el-row class="left" v-else-if="msg.type === 0">
				<p v-popover:popover>{{ JSON.parse(msg.extra).from_name }}&nbsp;({{ JSON.parse(msg.extra).time }}):&nbsp;<span class="msg-content">&nbsp;{{ msg.content }}&nbsp;</span></p>
			</el-row>
			<el-row class="mid" v-else-if="msg.type === 3">
				<p v-popover:popover><span class="msg-content">&nbsp;{{ msg.content }}&nbsp;</span></p>
			</el-row>
		</el-row>
	</el-row>
</template>

<script>
export default {
	props:['messages', 'myid'],
	methods: {
		add_friend_request(tuid) {
			this.$emit('add_friend_request', tuid);
		}
	}
};
</script>

<style>
.msg-list-wrapper {
	height:-webkit-fill-available;
	height:-moz-available;
	height:-moz-fill-available;
	height:fill-available;
}

.flex {
	display:flex;
	flex-direction:column;
}
.msg-content {
	color:#000000;
	border-radius:.3rem;
	background-color:#d5eeff;
}
.left {
	align-self:flex-start;
}
.right {
	align-self:flex-end;
}
.mid {
	align-self:center;
}
.cursor-pointer {
	cursor:pointer;
}
</style>
