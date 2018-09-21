<template>
	<el-row class="friend-list-wrapper">
		<el-row class="friend" v-for="f in friends">
			<el-card class="friend-card" shadow="hover">
				<div class="friend-name">{{ f.info.name }}</div>
				<div class="friend-bio">{{ f.info.bio }}</div>
			</el-card>
		</el-row>
	</el-row>
</template>

<script>
export default {
	props: ['friends']
};
</script>

<style>
.friend-list-wrapper {
	width:100%;
	height:100%;
	overflow-y:scroll;
}

.friend {
	width:80%;
	margin:.5rem auto;
	margin-bottom:0;
	padding-bottom:.8rem;
}

.friend-name {
	font-size:1rem;
	font-weight:300;
}

.friend-bio {
	font-size:.8rem;
}
</style>
