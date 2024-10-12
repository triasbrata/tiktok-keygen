const { resolve } = require("path");
const { inspect } = require("util");

const webpack = require("webpack");
module.exports = {
  // specify an alternate main src directory, defaults to 'main'
  mainSrcDir: "main",
  // specify an alternate renderer src directory, defaults to 'renderer'
  rendererSrcDir: "renderer",

  // main process' webpack config
  webpack: (config, env) => {
    const o = {
      ...config,
      externals: [...config.externals, "playwright-core"],
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
    };
    console.log(inspect(o, false, 5));
    return o;
    config.externals.push();
    config.ignoreWarnings = [{ module: /@opentelemetry\/instrumentation/ }];
    // You can also add additional rules for file loaders, etc.
    config.module.rules = [
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
            presets: [
              "nextron/babel",
              "@babel/preset-env",
              "@babel/preset-typescript",
            ],
          },
        },
        exclude: [/node_modules/, resolve("renderer")],
      },
      {
        enforce: "pre",
        test: /\.js$/, // Load source maps for JavaScript files
        use: "source-map-loader",
      },
    ];
    config.devtool = "source-map";
    return config;
  },
};
