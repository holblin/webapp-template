/* eslint-disable react/display-name */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-spectrum/s2', () => {
  const component = (tag: string) => {
    return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const renderProp = children as unknown;
      if (typeof renderProp === 'function') {
        return React.createElement(tag, props, (renderProp as (args: {
          id: 'id-1',
          name: 'Name',
          description: 'Description',
          url: 'https://example.com',
          icon: '/icon.svg',
        }) => React.ReactNode)({
          id: 'id-1',
          name: 'Name',
          description: 'Description',
          url: 'https://example.com',
          icon: '/icon.svg',
        }));
      }
      return React.createElement(tag, props, children);
    };
  };

  return {
    AssetCard: component('div'),
    Footer: component('div'),
    LinkButton: component('a'),
    CardView: component('div'),
    CardPreview: component('div'),
    Image: component('img'),
    Content: component('div'),
    Text: component('span'),
  };
});

vi.mock('src/providers/Theme', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

import { About, AboutCard } from '../About';

describe('About page', () => {
  it('renders AboutCard and About sections', () => {
    const html = renderToStaticMarkup(
      <div>
        <AboutCard
          icon="/icon.svg"
          name="React"
          description="Library"
          url="https://react.dev"
        />
        <About />
      </div>,
    );

    expect(html).toContain('React');
    expect(html).toContain('Visit webpage');
  });
});
