import { merge } from 'webpack-merge'
import common from './webpack.common.js'

const config = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 3000,
        hot: true,
    },
})

export default config