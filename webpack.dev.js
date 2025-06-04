import { merge } from 'webpack-merge'
import common from './webpack.common.js'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import path from 'path'

const config = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new BundleAnalyzerPlugin({openAnalyzer: false})
    ],
    devServer: {
        port: 3000,
        hot: true,
        open: false,
        static: {
            directory: path.resolve(import.meta.dirname, 'client/public')
        },
        proxy: [
            {
                context: ['/companies',
                    '/company-types',
                    '/address-types',
                    '/fields',
                    '/api-docs',
                    '/docs',
                    '/config.js'],
                target: 'http://localhost:8080'
            }
        ]
    },
})

export default config