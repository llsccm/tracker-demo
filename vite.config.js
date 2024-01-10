import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/index.js',
      userscript: {
        name: '三国杀打小抄',
        version: '2.5.5',
        author: '小麦+霜迟',
        'run-at': 'document-start',
        description: '打小抄支持网页版和微端，微端文件请加群562224095',
        icon: 'https://i0.hdslb.com/bfs/new_dyn/17ec41a0ca79633b77399065ab80da3f2138912.png',
        namespace: 'https://greasyfork.org/scripts/448004',
        match: ['*://game.iwan4399.com/yxsgs/*', '*://*.sanguosha.com/*'],
        grant : 'none'
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
