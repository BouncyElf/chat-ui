<template>
	<el-row class="user-info-wrapper">
		<h1 class="name">{{ info.name }}</h1>
		<h5 class="display_id">{{ 'ID: ' + info.uid }}</h5>
	</el-row>
</template>

<script>
export default {
	props:['info']
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
	padding-bottom:0;
	text-align:center;
	font-weight:normal;
}

.display_id {
	text-align:center;
	padding-top:.3rem;
	padding-bottom:1rem;
	border-bottom:1px solid #dcdfe6;
	margin:.3rem auto;
}
</style>
