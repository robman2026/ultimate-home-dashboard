import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/main.js',
      name: 'SmarthomeDashboardCard',
      fileName: 'smarthome-dashboard-card',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        banner: `/**
 * SmartHome Dashboard
 * Author: robman2026
 * GitHub: https://github.com/robman2026/ultimate-home-dashboard
 * Version: 1.4.1
 * License: MIT
 */`,
      },
    },
  },
});