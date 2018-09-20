<template>
	<el-container id="index-main">
		<el-main>
			<h1>{{ name }}</h1>
			<el-button round type="primary"
				@click="goto('register')">{{ start_now }}</el-button>
			<el-button type="text"
				@click="goto('login')">{{ has_account }}</el-button>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			name: '基于websocket的聊天软件',
			start_now: '现在开始',
			has_account: '已有帐号?'
		}
	},
	methods: {
		goto(uri) {
			window.scrollTo(0,0);
			if (uri === '' || uri === undefined) {
				window.location.href="#/";
				return false;
			}
			window.location.href="#/"+uri;
		}
	}
};
</script>

<style>
#index-main {
	width:100%;
	min-height:inherit;
	padding-top:10rem;
	text-align:center;
	background-color:#f7f4e3;
}
</style>
