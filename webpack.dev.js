import { merge } from 'webpack-merge'
import common from './webpack.common.js'

const config = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 3000,
        hot: true,
        open: false,
        proxy: [
            {
                context: ['/companies', '/companytypes'],
                target: 'http://localhost:8080'
            }
        ]
    },
})

export default config