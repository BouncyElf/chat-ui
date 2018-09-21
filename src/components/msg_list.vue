<template>
	<el-row>
		<el-row class="flex" v-for="msg in messages">
			<el-row class="left" v-if="msg.from !== myname">
				<p v-popover:popover>{{ msg.from }}&nbsp;({{ msg.time }}):&nbsp;<span class="msg-content">&nbsp;{{ msg.content }}&nbsp;</span></p>
			</el-row>
			<el-row class="right" v-else>
				<p v-popover:popover><span class="msg-content">&nbsp;{{ msg.content }}&nbsp;</span>&nbsp;:({{ msg.time }})&nbsp;{{ msg.from }}</p>
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
.flex {
	display:flex;
	flex-direction:column;
}
.msg-content {
	color:#474a56;
	border-radius:.3rem;
	background-color:#ecf4f3;
}
.left {
	align-self:flex-start;
}
.right {
	align-self:flex-end;
}
</style>
