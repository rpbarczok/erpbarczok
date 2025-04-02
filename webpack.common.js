import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const config = {
    entry: {
        app: './client/index.tsx',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/public/index.html'
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(import.meta.dirname, 'server/public'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)x?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
              }
        ]
    },
    resolve: {
        modules: [import.meta.dirname, 'client', 'node_modules'],
        extensionAlias: {
            '.js': ['.ts', '.js', '.tsx', '.jsx'],
            '.jsx': ['.tsx', '.jsx']
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css']
    }
}

export default config