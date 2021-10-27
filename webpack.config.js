/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  version: packageVersion,
} = require('./package.json');

const SRC_PATH = path.join(__dirname, 'src');
const OUT_PATH = path.join(__dirname, 'app');

module.exports = ({
  version,
  mode = 'production',
} = {}) => {
  if (!version) {
    console.warn(`env.version is not set, fallback to version=${packageVersion} from the package.json`);
    // eslint-disable-next-line no-param-reassign
    version = packageVersion;
  }

  console.log(`start build with mode=${mode} version=${version}`);

  return {
    mode,
    watch: mode === 'development',
    devtool: mode === 'production' ? undefined : 'inline-source-map',
    stats: 'minimal',
    entry: {
      bg: './src/background/bg.ts',
      content: './src/content/app.ts',
      popup: './src/popup/app.ts',
    },
    output: {
      path: OUT_PATH,
      filename: '[name]/bundle.js',
    },
    resolve: {
      alias: {
        '~': SRC_PATH,
        '@': SRC_PATH,
      },
      extensions: ['.vue', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|vue|ts)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
          exclude: /node_modules/,
        },
        {
          test: /\.vue$/,
          use: 'vue-loader',
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
          ],
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [{
          from: 'static',
          transform(content, absoluteFrom) {
            if (!/.*\/manifest.json/.test(absoluteFrom)) {
              return content;
            }
            const manifest = JSON.parse(content.toString());

            // we need to apply sanity parsing for a version value
            // in order to prevent invalid value in a manifest version
            const sanitizedVersionNumber = /\d+(\.\d+){2,}/.exec(version)[0];
            console.log(`Set version=${sanitizedVersionNumber} for the manifest.json`);
            manifest.version = sanitizedVersionNumber;

            return JSON.stringify(manifest, null, 2);
          },
        }],
      }),
      new MiniCssExtractPlugin({ filename: '[name]/styles.css' }),
    ],
  };
};
