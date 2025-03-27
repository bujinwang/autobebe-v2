const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['@ui-kitten/components']
    }
  }, argv);

  // Configure output
  config.output = {
    ...config.output,
    publicPath: '/autobebe-v2/'
  };

  // Add CSP configuration
  if (config.devServer) {
    config.devServer = {
      ...config.devServer,
      headers: {
        'Content-Security-Policy': "default-src 'self' https://bujinwang.github.io; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://bujinwang.github.io;"
      }
    };
  }

  return config;
}; 