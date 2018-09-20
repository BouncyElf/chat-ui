<template>
	<el-row>
		<h1 class="name">{{ name }}</h1>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;{{ bio }}</p>
	</el-row>
</template>

<script>
export default {
	props:['name', 'bio'],
	data() {
		return {
		}
	}
};
</script>

<style>
.name {
	font-size:1.5rem;
	margin:0;
	padding:1rem 0;
	text-align:center;
	border-bottom:1px solid #dcdfe6;
	font-weight:normal;
}
</style>
