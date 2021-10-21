module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.js'],
        root: ['./'],
        alias: {
          components: './components/',
          assets: './assets/',
          layouts: './layouts/',
          models: './models/',
          repository: './repository/',
          router: './router/',
          screen: './screen/',
          store: './store/',
          utils: './utils/',
        },
      },
    ],
  ],
};
