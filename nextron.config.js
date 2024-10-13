const { resolve } = require("path");
const { inspect } = require("util");
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");
module.exports = {
  // specify an alternate main src directory, defaults to 'main'
  mainSrcDir: "main",
  // specify an alternate renderer src directory, defaults to 'renderer'
  rendererSrcDir: "renderer",

  // main process' webpack config
  webpack: (config, env) => {
    return {
      ...config,
      externals: [...config.externals],
      ignoreWarnings: [{ module: /@opentelemetry\/instrumentation/ }],
      module: {
        ...config.module,
        rules: [
          // ...config.module.rules,
          {
            test: /\.(png|svg)$/i,
            type: "asset/resource",
            generator: {
              filename: "assets/images/[hash][ext][query]",
            },
          },
          // Rule for loading CSS files
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
          // Rule for loading font files (eot, ttf, woff, woff2)
          {
            test: /\.(eot|ttf|woff|woff2)$/i,
            type: "asset/resource",
            generator: {
              filename: "assets/fonts/[hash][ext][query]",
            },
          },
          // Rule for loading HTML files
          {
            test: /\.html$/i,
            loader: "html-loader",
          },
          {
            test: /\.proto$/,
            loader: "protobufjs-loader",
            options: {
              // Options for protobuf loader (optional)
              // Specify any configurations for protobufjs if needed
            },
          },
          {
            test: /\.ts$/,
            use: {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
                sourceMaps: true, // Ensure source maps are enabled,
                presets: ["nextron/babel"],
              },
            },
            exclude: [/node_modules/, resolve("renderer")],
          },
          {
            enforce: "pre",
            test: /\.js$/, // Load source maps for JavaScript files
            use: "source-map-loader",
          },
        ],
      },
      plugins: [
        ...config.plugins,
        // Put the Sentry Webpack plugin after all other plugins
        sentryWebpackPlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: "tbm-vn",
          project: "electron",
        }),
      ],
    };
  },
};
