require('dotenv').config()

const webpack = require('webpack')
const path = require('path');
const cwd = process.cwd();

module.exports = {
  webpack: (defaultConfig) =>
    Object.assign(defaultConfig, {
      optimization: {
        minimize: false
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: ['@babel/preset-typescript'],
                plugins: [
                  'babel-plugin-transform-typescript-metadata',
                  ['@babel/plugin-proposal-decorators', { legacy: true }],
                  ['@babel/plugin-proposal-class-properties', { loose: true }],
                ],
              },
            },
            exclude: [/node_modules/, path.join(cwd, 'renderer')],
          },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.BASE_API_URL': JSON.stringify(process.env.BASE_API_URL)
        }),
        ...defaultConfig.plugins,
      ]
    }),
};
