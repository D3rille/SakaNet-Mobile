module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for expo-router
      'expo-router/babel',
      //React native paper
      'react-native-paper/babel',
      //React native reanimated
      'react-native-reanimated/plugin',
    ],
    
  };
};
