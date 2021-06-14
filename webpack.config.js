const path = require('path');
const SRC_DIR = path.join(__dirname, '/Client/index.js');
const OUT_DIR = path.join(__dirname, '/Public');

module.exports = {
  entry: SRC_DIR,
  output: {
    filename: 'host-info-bundle.js',
    path: OUT_DIR
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-env'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: {
          loader: 'url-loader?limit=100000' }
      }
    ]
  }
}