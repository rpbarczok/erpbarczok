import {merge} from 'webpack-merge'
import common from './webpack.common.js'

const config = merge(common, {
    mode:'production',
    devtool: 'source-map'
})

export default config