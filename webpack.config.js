const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const plugins = [
  new HtmlWebpackPlugin({
    template: 'client/index.html',
    filename: 'index.html',
    inject: 'body'
  })
];

module.exports = env => {
  const environment = env || 'production';
  let stylesLoaderModules = false;
  if (environment === 'production') {
    plugins.push(
      new OptimizeJsPlugin({
        sourceMap: false
      })
    );
    stylesLoaderModules = true;
  }
  return {
    mode: environment,
    entry: './client/index.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'app.bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            plugins:
              environment !== 'production' ? ['react-hot-loader/babel'] : []
          }
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName:
                  environment !== 'production'
                    ? '[local]--[hash:base64:5]'
                    : '[sha1:hash:hex:5]'
              }
            }
          ]
        }
      ]
    },
    plugins,
    devServer: {
      proxy: {
        '/socket.io': {
          target: 'http://localhost:3000',
          ws: true
        }
      }
    }
  };
};
