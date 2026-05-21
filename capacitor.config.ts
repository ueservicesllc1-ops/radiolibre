import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.radiolibre.app',
  appName: 'Radio Libre',
  webDir: 'out',
  android: {
    allowMixedContent: true
  }
};

export default config;
