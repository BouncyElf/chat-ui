<template>
	<el-row class="friend-list-wrapper">
		<el-button v-for="f in friends" class="friend" @click="chat_with(f)">
			<el-card class="friend-card" shadow="hover">
				<div class="friend-name">{{ f.info.name }}</div>
				<div class="friend-display_id">{{ 'display id: ' + f.info.display_id }}</div>
				<div class="friend-bio">{{ shorter(f.info.bio) }}</div>
			</el-card>
		</el-button>
	</el-row>
</template>

<script>
export default {
	props: ['friends'],
	methods: {
		shorter(content) {
			let res = content;
			if (res.length >= this.text_limit) {
				res = res.substring(0, this.text_limit - 3) + '...';
			}
			return res;
		},
		chat_with(friend) {
			this.$emit('chat_with', friend);
		}
	}
};
</script>

<style>
.friend-list-wrapper {
	width:100%;
	height:100%;
	overflow-y:scroll;
}

.friend-list-wrapper .el-button+.el-button {
	margin-left:auto;
}

.friend {
	width:80%;
	margin:.5rem auto;
	margin-bottom:0;
	padding:0;
	display:block;
	border:0;
	border-radius:0;
	text-align:justify;
}

.friend-card {
	width:100%;
	height:100%;
}

.friend-name {
	font-size:1rem;
	font-weight:300;
}

.friend-display_id {
	padding:.4rem 0;
}

.friend-bio {
	font-size:.8rem;
}
</style>
