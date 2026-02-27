// This replaces `const { getDefaultConfig } = require('expo/metro-config');`
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const path = require('path');

// This replaces `const config = getDefaultConfig(__dirname);`
const config = getSentryExpoConfig(__dirname);
config.resolver.unstable_enablePackageExports = true;

// Web shims: redirect native-only Stream packages to no-op stubs on web
const WEB_SHIMS = {
  '@stream-io/react-native-webrtc': path.resolve(
    __dirname,
    'shims/webrtc.web.js',
  ),
  '@stream-io/video-react-native-sdk': path.resolve(
    __dirname,
    'shims/video-sdk.web.js',
  ),
  'stream-chat-expo': path.resolve(__dirname, 'shims/stream-chat-expo.web.js'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && WEB_SHIMS[moduleName]) {
    return { filePath: WEB_SHIMS[moduleName], type: 'sourceFile' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
