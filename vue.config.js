module.exports = {
	baseUrl: '/',

	outputDir: 'dist',

	lintOnSave: false,

	chainWebpack: () => {},
	configureWebpack: () => {},

	productionSourceMap: true,

	css: {
		extract: true,

		sourceMap: false,

		loaderOptions: {},

		modules: false
	},

	parallel: require('os').cpus().length > 1,

	pwa: {},

	devServer: {
		open: process.platform === 'darwin',
		host: '0.0.0.0',
		port: 8089,
		https: false,
		hotOnly: false,
		proxy: {
			'/debug/*': {
				target: 'http://localhost:1212',
				changeOrigin: true,
				pathRewrite: {
					'^/debug':''
				}
			}

		},
		before: app => {}
	},

	pluginOptions: {
	}
}
