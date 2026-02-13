import type { CapacitorConfig } from '@capacitor/cli';
import dotenv from 'dotenv';

dotenv.config();

const getHostFromUrl = (url: string | undefined) => {
  if (!url) return 'localhost';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return 'localhost';
  }
};

const apiHost = getHostFromUrl(process.env.VITE_API_URL);

const config: CapacitorConfig = {
  appId: 'com.better.shoppy',
  appName: 'Shoppy',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    cleartext: true,
    allowNavigation: [
      apiHost,
      'localhost'
    ]
  }
};

export default config;
