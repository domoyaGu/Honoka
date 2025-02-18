const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')

const htmlPlugin = new HtmlPlugin({
    template: "./src/index.html",
    filename: './index.html'
})

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const cleanWebpackPlugin = new CleanWebpackPlugin()


module.exports = {
    mode: "development", // production
    // 入口
    entry: path.join(__dirname, "./src/index.js"),
    // 出口
    output: {
        path: path.join(__dirname, "./dist"),
        // 表示输出文件名称
        filename: 'js/bundle.js'
    },

    // 开发模式下debug行数对应（避免打包后报错行数有问题）
    devtool: 'eval-source-map', // 设置成nosources-source-map 可以再生产环境下报对应行数错，但不能直接找到，保证安全性

    // 热部署webpack-dev-server

    // html-webpack-plugin挂载到插件节点
    plugins: [
        htmlPlugin,
        // dist清理挂载
        cleanWebpackPlugin
    ],

    // devServer
    devServer: {
        open: true, // 部署完后自动打开
        host: "127.0.0.1",
        port: 8080
    },

    // loader 加载非js模块的文件模块，如css,less
    module: {
        rules: [
            // // 这边loader顺序是固定的，不能相反，运行时从后往前
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
            // // 图片有匹配规则 limit:大小限制，<=limit的会变成base64
            // {test: /\.jpg|png|gif$/, use: ['url-loader?limit=100000']},
            // 上述写法二
            {
                test: /\.jpg|png|gif$/, 
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        // 导出目录，变成base64的不会打包进去
                        outputPath: 'images'
                    }
                }
            },

            // babel 高级js语法，若不配置走webpack默认配置
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            }
        ]
    }

}