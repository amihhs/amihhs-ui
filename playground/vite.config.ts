import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Markdown from 'vite-plugin-md'
import Inspect from 'vite-plugin-inspect'

// import VueDevTools from 'vite-plugin-vue-devtools'
import Layouts from 'vite-plugin-vue-layouts'
import generateSitemap from 'vite-ssg-sitemap'
import globDirs from 'vite-plugin-dirs'
import FilesLoader from 'vite-plugin-files-loader'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { alias } from '../alias'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      ...alias,
    },
  },
  server: {
  },
  plugins: [
    visualizer(),
    viteCompression({
      threshold: 10240,
    }),
    Inspect(),
    Vue({
      reactivityTransform: true,
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown(),
    globDirs(),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),
    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
      ],
      dts: true,
      dirs: [
        './src/composables',
        './src/components',
        './src/logic',
        './src/types',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'amihhs-ui',
        short_name: 'amihhs-ui',
        theme_color: '#ffffff',
        icons: [
          // {
          //   src: '/pwa-192x192.png',
          //   sizes: '192x192',
          //   type: 'image/png',
          // },
          // {
          //   src: '/pwa-512x512.png',
          //   sizes: '512x512',
          //   type: 'image/png',
          // },
          // {
          //   src: '/pwa-512x512.png',
          //   sizes: '512x512',
          //   type: 'image/png',
          //   purpose: 'any maskable',
          // },
        ],
      },
    }),
    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),
    // https://github.com/webfansplz/vite-plugin-vue-devtools
    // VueDevTools(),

    FilesLoader({
      paths: '@components',
      resolveChildrenBase: 'src',
      extensions: ['.html', '.css', '.js', '.ts', '.yaml', '.vue'],
      dynamicImport: true,
    }),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi'],
    },
  },
  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: {
      reduceInlineStyles: false,
    },
    onFinished() {
      generateSitemap()
    },
  },
  ssr: {
    // TODO: workaround until they support native ESM
    noExternal: ['workbox-window', /vue-i18n/],
  },
  optimizeDeps: {
    exclude: [
      '@iconify/utils/lib/loader/fs',
      '@iconify/utils/lib/loader/install-pkg',
      '@iconify/utils/lib/loader/node-loader',
      '@iconify/utils/lib/loader/node-loaders',
    ],
  },
  build: {
    minify: 'esbuild',
    rollupOptions: {
      external: [
        '@iconify/utils/lib/loader/fs',
        '@iconify/utils/lib/loader/install-pkg',
        '@iconify/utils/lib/loader/node-loader',
        '@iconify/utils/lib/loader/node-loaders',
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name)
            return 'assets/empty/[name]-[hash][extname]'
          const info = assetInfo.name?.split('.')
          let extType = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name))
            extType = 'img'
          else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name))
            extType = 'fonts'
          return `assets/${extType}/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        manualChunks(id: string) {
          if (id.includes('highlight.js'))
            return '@highlight'
          else if (id.includes('typescript'))
            return '@typescript'
          else if (id.includes('vue-repl') || id.includes('@vue/repl'))
            return '@vue-repl'
          else if (id.includes('@unocss'))
            return '@unocss'
        },
      },
    },

  },
})
