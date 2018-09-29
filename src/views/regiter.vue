<template>
	<el-main id="register-view">
		<el-form ref="register" :model="register" :rules="register_rules" id="register-form">
			<el-form-item :error="username_err" label="用户名" prop="username">
				<el-input v-model="register.username"
					:placeholder="username_pl"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="register.password" type="password"
					:placeholder="password_pl"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="repassword">
				<el-input v-model="register.repassword" type="password"
					:placeholder="repassword_pl"></el-input>
			</el-form-item>
			<el-form-item label="昵称" prop="name">
				<el-input v-model="register.name"
					:placeholder="name_pl"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onRegister">立即注册</el-button>
				<el-button type="text"
					@click="goto('login')">{{ has_account }}</el-button>
			</el-form-item>
		</el-form>
	</el-main>
</template>

<script>
export default {
	data() {
		var validateRepassword = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.register.password) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		return {
			register: {
				username:'',
				password:'',
				repassword:'',
				name:''
			},
			register_rules: {
				username:[
					{required: true, message: '请输入用户名', trigger: 'blur'},
					{min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur'},
				],
				password:[
					{required: true, message: '请输入密码', trigger: 'blur'},
					{min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur'},
				],
				repassword:[
					{required: true, validator: validateRepassword, trigger: 'blur'}
				],
				name:[
					{required: true, message: '请输入昵称', trigger: 'blur'},
					{min: 1, max: 16, message: '长度在6到16个字符', trigger: 'blur'},
				]
			},
			username_pl:'不少于6个字符',
			password_pl:'不少于6个字符',
			repassword_pl:'再次输入密码',
			name_pl:'',
			username_err:'',
			has_account: '已有帐号?'
		}
	},
	methods: {
		onRegister() {
			let that = this;
			that.$refs['register'].validate((valid) => {
				if (valid) {
					let register_api = that.$url_prefix + '/api/user/register';
					that.$ajax.post(
						register_api,
						that.$qs.stringify({
							username:that.register.username,
							password:that.register.password,
							name:that.register.name
						})
					).then(res => {
						console.log(res);
						that.goto('chat');
					}).catch(err => {
						console.log(err.response);
						let code = err.response.status;
						if (code === 409) {
							that.$message({
								message:'用户名已被注册',
								type:'error'
							});
							that.username_err = '用户名已被注册';
							return false;
						}
						that.$message({
							message:'发生了一些意料之外的错误',
							type:'error'
						});
						return false;
					});
				} else {
					that.$message({
						message:'注册出错, 请先检查您输入的信息',
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
#register-view {
	width:100%;
	height:inherit;
	margin:0 auto;
}

#register-form {
	width:30%;
	margin:0 auto;
	margin-top:10rem;
}
</style>
