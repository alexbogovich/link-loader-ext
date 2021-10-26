const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  version: packageVersion,
  name,
} = require('./package.json');
//
// const PATHS = {
//   source: path.join(__dirname, 'src'),
//   build: path.join(__dirname, 'app'),
// };


const SRC_PATH = path.join(__dirname, 'src')
const OUT_PATH = path.join(__dirname, 'app')

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
      bg: `./src/background/bg.js`,
      content: `./src/content/app.js`,
      popup: `./src/popup/app.js`,
      // fonts: `${PATHS.source}/fonts.js`,
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
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader',
        },
        // {
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   exclude: /node_modules/,
        //   loader: 'eslint-loader',
        // },
        // {
        //   test: /\.js$/,
        //   exclude: /(node_modules)/,
        //   use: {
        //     loader: 'babel-loader',
        //     options: {
        //       presets: ['@babel/preset-env'],
        //       plugins: [
        //         'lodash',
        //         '@babel/plugin-proposal-class-properties',
        //         '@babel/plugin-transform-runtime',
        //       ],
        //     },
        //   },
        // },
        {
          test: /\.less$/,
          use: [
            // 'vue-style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
          ],
        },
        // {
        //   test: /\.less$/,
        //   include: [
        //     path.join(PATHS.source, 'content', 'components', 'serp', 'serp.less'),
        //     path.join(PATHS.source, 'font.less'),
        //   ],
        //   use: [
        //     'style-loader',
        //     {
        //       loader: 'css-loader',
        //       options: {
        //         modules: {
        //           localIdentName: '[local]-[hash:base64:6]',
        //         },
        //       },
        //     },
        //     'less-loader',
        //   ],
        // },
        // {
        //   test: /\.css$/,
        //   use: ['style-loader', 'css-loader'],
        // },
        // {
        //   test: /\.(png|jpg|gif|eot|svg|otf|ttf|woff|woff2)$/,
        //   resourceQuery: { not: [/raw/] },
        //   type: 'asset/inline',
        // },
        // {
        //   test: /\.(svg)$/,
        //   resourceQuery: /raw/,
        //   type: 'asset/source',
        // },
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
