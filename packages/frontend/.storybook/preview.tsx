import { Provider, ToastContainer } from '@react-spectrum/s2';
import type { Preview } from '@storybook/react-vite';
import '@react-spectrum/s2/page.css';
import '../src/index.css';

type ProviderBackground = 'base' | 'layer-1' | 'layer-2';
type ProviderColorScheme = 'light' | 'dark';

const LIGHT_BACKGROUND_VALUES = new Set(['light', 'base', '#ffffff', '#fff', 'white']);

function resolveProviderBackground(backgroundValue: unknown): ProviderBackground {
  if (typeof backgroundValue !== 'string') {
    return 'base';
  }

  const normalized = backgroundValue.trim().toLowerCase();

  if (normalized.includes('layer-2')) {
    return 'layer-2';
  }

  if (normalized.includes('layer-1')) {
    return 'layer-1';
  }

  return 'base';
}

function resolveColorScheme(backgroundValue: unknown): ProviderColorScheme {
  if (typeof backgroundValue !== 'string') {
    return 'dark';
  }

  const normalized = backgroundValue.trim().toLowerCase();
  if (LIGHT_BACKGROUND_VALUES.has(normalized)) {
    return 'light';
  }

  const hexMatch = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!hexMatch) {
    return 'dark';
  }

  const hex = hexMatch[1];
  const [r, g, b] =
    hex.length === 3
      ? hex.split('').map((digit) => Number.parseInt(`${digit}${digit}`, 16))
      : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((pair) => Number.parseInt(pair, 16));
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance >= 0.6 ? 'light' : 'dark';
}

const preview: Preview = {
  globalTypes: {
    providerLocale: {
      name: 'Locale',
      description: 'React Spectrum Provider locale',
      defaultValue: 'en-US',
      toolbar: {
        icon: 'globe',
        items: ['en-US', 'fr-FR'],
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark', value: '#1f1f1f' },
      ],
    },
    controls: {
      expanded: true,
    },
  },
  decorators: [
    (Story, context) => {
      const backgroundValue = context.globals?.backgrounds?.value;
      const colorScheme = resolveColorScheme(backgroundValue);
      const providerBackground = resolveProviderBackground(backgroundValue);

      if (globalThis?.document?.documentElement?.dataset) {
        globalThis.document.documentElement.dataset.colorScheme = colorScheme;
      }

      return (
        <div style={{ minHeight: '100vh' }}>
          <Provider
            background={providerBackground}
            colorScheme={colorScheme}
            locale={String(context.globals.providerLocale ?? 'en-US')}
          >
            <Story />
            <ToastContainer />
          </Provider>
        </div>
      );
    },
  ],
};

export default preview;
