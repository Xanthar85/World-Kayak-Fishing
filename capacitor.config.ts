// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig & { orientation?: string; version?: string } = {
  appId: 'com.wkf.app',
  appName: 'World Kayak Fishing',
  version: '2.0.1',
  webDir: 'dist',
  orientation: 'portrait',
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 0
    }
  }
};

export default config;
// capacitor.config.ts