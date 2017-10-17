/**
 * Created by Administrator on 2017/10/9.
 */
const path = require('path');
var webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');//清理dist目录文件
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html导出
const ExtractTextPlugin = require('extract-text-webpack-plugin');//分离样式表
const extractCSS = new ExtractTextPlugin(process.env.NODE_ENV === 'production' ? 'css/[name]-css.min.css' : 'css/[name]-css.css');//导出css
const extractSass = new ExtractTextPlugin(process.env.NODE_ENV === 'production' ? 'css/[name]-less.min.css' : 'css/[name]-less.css')//导出sass
const balili = require('babili-webpack-plugin');//压缩代码
const autoprefixer = require('autoprefixer'); //补全css各种hack
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css
module.exports = {
    //devtool: 'source-map',
    /*devServer: {
        historyApiFallback: false,
        inline: true,//注意：不写hot: true，否则浏览器无法自动更新；也不要写colors:true，progress:true等，webpack2.x已不支持这些
    },*/
    entry: {
        'index': ['./src/index.js'],
        'tmpl': ['./src/tmpl.js']
    },
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            //使用babel加载.js文件
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            },
            //加载css
            {
                test: /\.css$/,
                exclude: /(node_modules|bower_components)/,
                use: extractCSS.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader'],
                    publicPath: '../'
                })
            },
            {
                test: /\.less$/,
                use: extractSass.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader', 'postcss-loader'],
                    publicPath: '../'
                })
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            gifsicle: {
                                interlaced: false
                            },
                            optipng: {
                                optimizationLevel: 1
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        //全局挂载
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new CleanWebpackPlugin(['dist/js', 'dist/css', 'dist/img']),
        new HtmlWebpackPlugin({
            filename: 'tmpl.html',
            inject: 'body',
            chunks: ['tmpl'],
            hash: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: 'body',
            chunks: ['index', 'tmpl'],
            hash: true
        }),
        extractCSS,
        extractSass,
        (process.env.NODE_ENV === 'production') ? new balili() : function () {
        },//区分生产环境与开发环境，压缩js
        (process.env.NODE_ENV === 'production') ? new OptimizeCssAssetsPlugin() : function () {
        }//区分生产环境与开发环境,压缩css
        //new webpack.HotModuleReplacementPlugin()

    ]
}