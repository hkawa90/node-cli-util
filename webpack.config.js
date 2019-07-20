const path = require('path');
const webpack = require('webpack');
var enabledSourceMap;
// ソースマップの利用有無(productionのときはソースマップを利用しない)
if (process.env.NODE_ENV === 'production') {
    enabledSourceMap = false;
}else{
    enabledSourceMap = true;
}

module.exports = (env, argv) => {
  const enabledSourceMap = (argv.mode === "production") ? false : true;
  return {
    target: "node",
    entry: {
      "index" : "./src/index.js",
      "child_rotation_bar" : "./src/child_rotation_bar.js",
    },
    output: {
          //  出力ファイルのディレクトリ名
    path: path.resolve(__dirname, 'dist'),
    // 出力ファイル名
    filename: '[name].js',
    libraryTarget: 'commonjs2' // See Authoring Libraries(https://webpack.js.org/guides/author-libraries/)
    },
    resolve: {
          modules: [
      'node_modules',
       path.join(__dirname, 'src'),
    ],

    },
    node : {
      __dirname : false
    }
  }
}
