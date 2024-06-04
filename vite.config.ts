import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
// import { Proxy } from '@domoinc/ryuu-proxy';
// import manifest from './public/manifest.json';
// import { ProxyOptions } from '@domoinc/ryuu-proxy/dist/lib/models';

// const config: ProxyOptions = {
//   manifest,
// };
// const proxy = new Proxy(config);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // {
    //   name: 'proxy-domo',
    //   configureServer(server: ViteDevServer) {
    //     server.middlewares.use(proxy.express());
    //   },
    // },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
