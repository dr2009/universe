const { registerPluginTSTranspiler } = require('nx/src/utils/nx-plugin.js');
registerPluginTSTranspiler();

const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

const path = require('path');
// const { withModuleFederation } = require('@nx/react/module-federation');
const {
  ModuleFederationPlugin,
} = require('@module-federation/enhanced/webpack');

module.exports = composePlugins(
  withNx(),
  withReact(),
  async (config, context) => {
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/@mf-types/**'],
    };
    // const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;
    config.plugins.push(
      new ModuleFederationPlugin({
        name: 'runtime_remote1',
        // library: { type: 'var', name: 'runtime_remote' },
        filename: 'remoteEntry.js',
        exposes: {
          './useCustomRemoteHook': './src/components/useCustomRemoteHook',
          './WebpackSvg': './src/components/WebpackSvg',
          './WebpackPng': './src/components/WebpackPng',
        },
        shared: {
          lodash: {},
          antd: {},
          react: {},
          'react/': {},
          'react-dom': {},
          'react-dom/': {},
        },
      }),
    );
    // config.externals={
    //   'react':'React',
    //   'react-dom':'ReactDom'
    // }
    config.optimization.runtimeChunk = false;
    config.plugins.forEach((p) => {
      if (p.constructor.name === 'ModuleFederationPlugin') {
        //Temporary workaround - https://github.com/nrwl/nx/issues/16983
        p._options.library = undefined;
      }
    });

    //Temporary workaround - https://github.com/nrwl/nx/issues/16983
    config.experiments = { outputModule: false };

    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`
    config.output = {
      ...config.output,
      scriptType: 'text/javascript',
    };
    config.optimization = {
      ...config.optimization,
      runtimeChunk: false,
      minimize: false,
    };
    // const mf = await withModuleFederation(defaultConfig);
    return config;
    /** @type {import('webpack').Configuration} */
    // const parsedConfig = mf(config, context);

    // parsedConfig.plugins.forEach((p) => {
    //   if (p.constructor.name === 'ModuleFederationPlugin') {
    //     //Temporary workaround - https://github.com/nrwl/nx/issues/16983
    //     p._options.library = undefined;
    //   }
    // });

    // parsedConfig.devServer = {
    //   ...(parsedConfig.devServer || {}),
    //   //Needs to resolve static files from the dist folder (@mf-types)
    //   static: path.resolve(__dirname, '../../dist/apps/runtime-demo/remote'),
    // };

    // //Temporary workaround - https://github.com/nrwl/nx/issues/16983
    // parsedConfig.experiments = { outputModule: false };

    // // Update the webpack config as needed here.
    // // e.g. `config.plugins.push(new MyPlugin())`
    // parsedConfig.output = {
    //   ...parsedConfig.output,
    //   scriptType: 'text/javascript',
    // };

    // return parsedConfig;
  },
);
