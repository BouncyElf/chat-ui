<template>
	<el-container id="app">
		<el-main id="main-view">
			<router-view/>
		</el-main>
	</el-container>
</template>

<script>
export default {
};
</script>

<style>
body {
	min-width:100%;
	margin:0;
	padding:0;
}

#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	min-width:100%;
	min-height:-webkit-fill-available;
	min-height:-moz-available;
	min-height:-moz-fill-available;
	min-height:fill-available;
}

#main-view {
	min-width:100%;
	min-height:inherit;
	border:0;
	margin:0;
	padding:0;
}
</style>
