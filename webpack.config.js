const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'gaugeChart.min.js', // Output bundled file
    path: path.resolve(__dirname, 'dist'), // Output folder
    library: 'GaugeChart',  // This is the global variable your library will be accessible by
    libraryTarget: 'umd',  // Universal module definition (works in various environments)
    // globalObject: 'this'  // Ensures compatibility with both browser and Node.js
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // Babel loader for JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'] // Convert modern JS to compatible code
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']  // Resolving JavaScript file extensions
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Folder to serve static files from
      publicPath: '/', // Ensure the public path is set correctly
    },
    compress: true,
    port: 5000,  // Port for the dev server
    open: true,  // Open the browser on start
    hot: true,   // Enable hot module replacement (HMR) if needed
    historyApiFallback: true, // Fix issues with client-side routing (if applicable)
  },
//   plugins: [
//     new (class {
//       apply(compiler) {
//         compiler.hooks.done.tap('Expose GaugeChart to window', (stats) => {
//           const distFilePath = path.resolve(__dirname, 'dist', 'gaugeChart.min.js');
//           let content = fs.readFileSync(distFilePath, 'utf-8');
          
//           // Append code to expose GaugeChart.default to window.GaugeChart
//           content = `
//             (function() {
//               if (typeof window !== 'undefined') {
//                 window.GaugeChart = ${content}.default || ${content};  // Expose the default export directly
//               }
//             })();
//           `;

//           // Write the modified content back to the dist file
//           fs.writeFileSync(distFilePath, content, 'utf-8');
//         });
//       }
//     })(),
//   ],
  mode: 'development', // Development mode (can switch to 'production' for minified build)
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
