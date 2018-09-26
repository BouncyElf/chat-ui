<template>
	<el-row class="msg-list-wrapper">
		<el-row class="flex" v-for="msg in messages">
			<el-row class="left" v-if="msg.from_name !== myname">
				<p v-popover:popover>{{ msg.from_name }}&nbsp;({{ msg.time }}):&nbsp;<span class="msg-content">&nbsp;{{ msg.content }}&nbsp;</span></p>
			</el-row>
			<el-row class="right" v-else>
				<p v-popover:popover><span class="msg-content">&nbsp;{{ msg.content }}&nbsp;</span>&nbsp;:({{ msg.time }})&nbsp;{{ msg.from_name }}</p>
			</el-row>
		</el-row>
	</el-row>
</template>

<script>
export default {
	props:['messages', 'myname']
};
</script>

<style>
.msg-list-wrapper {
	height:-webkit-fill-available;
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
</style>
