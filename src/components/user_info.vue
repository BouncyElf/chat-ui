<template>
	<el-row class="user-info-wrapper">
		<h1 class="name">{{ name }}</h1>
		<p class="bio"><el-button>&nbsp;&nbsp;&nbsp;&nbsp;{{ bio }}</el-button></p>
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
.user-info-wrapper {
	height:fit-content;
}

.name {
	font-size:1.5rem;
	margin:0;
	padding:1rem 0;
	text-align:center;
	border-bottom:1px solid #dcdfe6;
	font-weight:normal;
}

.bio .el-button {
	width:100%;
	height:100%;
	padding:0;
	margin:0;
	border:0;
	background-color:transparent;
	text-align:justify;
}

</style>
