<template>
	<el-main id="login-view">
		<el-form ref="login" :model="login" :rules="login_rules" id="login-form">
			<el-form-item :error="username_err" label="用户名" prop="username">
				<el-input v-model="login.username"
					:placeholder="username_pl"></el-input>
			</el-form-item>
			<el-form-item :error="password_err" label="密码" prop="password">
				<el-input v-model="login.password" type="password"
					:placeholder="password_pl"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onLogin">登录</el-button>
				<el-button type="text"
					@click="goto('register')">{{ no_account }}</el-button>
			</el-form-item>
		</el-form>
	</el-main>
</template>

<script>
export default {
	data() {
		return {
			login: {
				username:'',
				password:''
			},
			login_rules: {
				username:[
					{required: true, message: '请输入用户名', trigger: 'blur'},
					{min: 6, max: 16, message: '用户名有误', trigger: 'blur'},
				],
				password:[
					{required: true, message: '请输入密码', trigger: 'blur'},
					{min: 6, max: 16, message: '密码错误', trigger: 'blur'},
				]
			},
			username_err:'',
			password_err:'',
			username_pl:'请输入您的用户名',
			password_pl:'请输入您的密码',
			no_account: '尚未注册?'
		}
	},
	methods: {
		onLogin() {
			let that = this;
			that.$refs['login'].validate((valid) => {
				if (valid) {
					let login_api = that.$url_prefix + '/api/user/login';
					that.$ajax.post(
						login_api,
						that.$qs.stringify({
							username:that.login.username,
							password:that.login.password
						})
					).then(res => {
						console.log(res);
						that.goto('chat');
					}).catch(err => {
						console.log(err.response);
						let code = err.response.status;
						if (code === 404) {
							that.$message({
								message:'用户名不存在',
								type:'error'
							});
							that.username_err = '用户名不存在';
							return false;
						} else if (code === 400) {
							that.$message({
								message:'密码错误',
								type:'error'
							});
							that.username_err = '密码错误';
							return false;
						}
						that.$message({
							message:'发生了一些意料之外的错误',
							type:'error'
						});
					});
				} else {
					that.$message({
						message:'登录出错, 请先检查您输入的信息',
						type:'error'
					});
					return false;
				}
			});
		},
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
#login-view {
	width:100%;
	height:inherit;
	margin:0 auto;
}

#login-form {
	width:30%;
	margin:0 auto;
	margin-top:10rem;
}
</style>
