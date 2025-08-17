export default {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!react-native|expo|expo-blur|react-native-mmkv)'
  ]
};