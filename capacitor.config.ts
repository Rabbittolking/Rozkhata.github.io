import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rozkhata.app',
  appName: 'RozKhata',
  webDir: 'dist',
  plugins: {
    AdMob: {
      androidAppId: 'ca-app-pub-3113275088766608~8750158529'
    }
  }
};

export default config;
