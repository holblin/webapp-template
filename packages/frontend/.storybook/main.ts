import { fileURLToPath, URL } from 'node:url';
import optimizeLocales from '@react-aria/optimize-locales-plugin';
import type { StorybookConfig } from '@storybook/react-vite';
import macros from 'unplugin-parcel-macros';
import { mergeConfig } from 'vite';

const addons = [
  '@storybook/addon-docs',
  '@storybook/addon-a11y',
  '@storybook/addon-vitest',
];

if (process.env.CHROMATIC === 'true' || process.env.CHROMATIC_PROJECT_TOKEN) {
  addons.push('@chromatic-com/storybook');
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons,
  typescript: {
    reactDocgen: false,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      server: {
        hmr: false,
      },
      resolve: {
        alias: {
          src: fileURLToPath(new URL('../src', import.meta.url)),
        },
      },
      plugins: [
        macros.vite(),
        {
          ...optimizeLocales.vite({
            locales: ['en-US', 'fr-FR'],
          }),
          enforce: 'pre',
        },
      ],
    });
  },
};

export default config;
