import {merge} from 'webpack-merge'
import common from './webpack.common.js'
import WorkboxPlugin from 'workbox-webpack-plugin'

const config = merge(common, {
    mode:'production',
    devtool: 'source-map',
    plugins: [
       new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true
       }) 
    ]
})

export default config