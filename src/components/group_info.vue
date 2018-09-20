<template>
	<el-row class="group-info-wrapper">
		<p>{{ name }}</p>
	</el-row>
</template>

<script>
export default {
	props:['name'],
	data() {
		return {
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
