import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.radiolibre.app',
  appName: 'Radio Libre',
  webDir: 'out',
  server: {
    url: 'https://radiolibre-production.up.railway.app/app',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
