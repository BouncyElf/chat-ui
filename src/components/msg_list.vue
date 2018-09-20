<template>
	<el-row>
		<el-row v-for="msg in messages">
			<p>{{ msg.content }}</p>
		</el-row>
	</el-row>
</template>

<script>
export default {
	props:['messages']
};
</script>

<style>
</style>
