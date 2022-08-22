// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// const webpack = require("webpack");
// const symlinked = require("symlinked");
// const rewireTypescript = require('react-app-rewire-typescript');
// config = rewireTypescript(config, env);

// module.exports = function override (config, env) {
  // config.plugins.push(new NodePolyfillPlugin(), new webpack.ProvidePlugin({ process: "process/browser.js"}))
  // config.resolve.extensions = [".ts", ".tsx", ".tsx"]
  // config.resolve.modules = config.resolve.modules.concat(symlinked.roots())
  // const fallback = config.resolve.fallback || {};
  // Object.assign(fallback, {
  //   // fs: false,
  //   // perf_hooks: false,
  //   // net: false,
  //   // tls: false,
  //   // async_hooks: false,
  //   // stream: false,
  //   // utils: false,
  //   // util: false,
  //   // module: false,
  //   // child_process: false,
  //   // url: false,
  //   // URL: false,
  //   // Url: false,
  //   // http: false,
  //   // https: false,
  //   // path: false, 
  //   // browser: false,
  // })
  // config.resolve.fallback = fallback
  // return config
// }




// const webpack = require("webpack");

// module.exports = {
//   webpack: function (config, env) {
//     config.plugins = [
//       ...config.plugins,
//       new webpack.ProvidePlugin({
//         process: "process/browser.js",
//         Buffer: ["buffer", "Buffer"],
//       }),
//     ];
//     config.resolve.fallback = {
//       crypto: require.resolve("crypto-browserify"),
//       stream: require.resolve("stream-browserify"),
//       assert: require.resolve("assert"),
//       http: require.resolve("stream-http"),
//       https: require.resolve("https-browserify"),
//       os: require.resolve("os-browserify"),
//       console: require.resolve("console-browserify"),
//       fs: false,
//       zlib: require.resolve("browserify-zlib"),
//       url: require.resolve("url"),
//       buffer: require.resolve("buffer"),
//     };
//     return config;
//   },
//   devServer: function (configFunction) {
//     return function (proxy, allowedHost) {
//       const config = configFunction(proxy, allowedHost);
//       config.headers = {
//         "X-Frame-Options": "DENY",
//         "X-XSS-Protection": "1; mode=block",
//       };

//       return config;
//     };
//   },
// };