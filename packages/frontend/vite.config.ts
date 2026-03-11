import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import macros from 'unplugin-parcel-macros';
import optimizeLocales from '@react-aria/optimize-locales-plugin';
import {fileURLToPath, URL} from 'node:url';
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    macros.vite(), // Must be first!
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      generatedRouteTree: './src/__generated__/tanstack/routeTree.gen.ts',
      routeFileIgnorePattern: '(^|/)__test__/|\\.(test|spec)\\.(ts|tsx)$',
    }),
    react(),
    {
      ...optimizeLocales.vite({
        locales: ['en-US', 'fr-FR']
      }),
      enforce: 'pre'
    }
  ],
  build: {
    target: ['es2022'],
    // Lightning CSS produces a much smaller CSS bundle than the default minifier.
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        // Bundle all S2 and style-macro generated CSS into a single bundle instead of code splitting.
        // Because atomic CSS has so much overlap between components, loading all CSS up front results in
        // smaller bundles instead of producing duplication between pages.
        manualChunks(id) {
          if (/macro-(.*)\.css$/.test(id) || /@react-spectrum\/s2\/.*\.css$/.test(id)) {
            return 's2-styles';
          }
        }
      }
    }
  },
  server: {
    port: 4080,
    proxy: {
      '/graphql': 'http://localhost:4000'
    }
  }
});
