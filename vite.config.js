import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/index.js',
      userscript: {
        name: 'tracker',
        version: '2.5.4',
        description: 'vite-plugin-monkey userscript',
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://www.baidu.com/']
      },
      server: {
        mountGmApi: false,
        autoGrant: false
      },
      build: {
        metaFileName: true,
        autoGrant: false
      }
    })
  ],
  build: {}
})
