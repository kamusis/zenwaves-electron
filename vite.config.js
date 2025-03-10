import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), electron({
    entry: 'main/main.js'
  })],
})
