/* eslint-disable react/display-name */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../Homepage.css', () => ({}));

vi.mock('@react-spectrum/s2/style', () => ({
  style: () => '',
}));

vi.mock('@react-spectrum/s2', () => {
  const component = (tag: string) => {
    return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      return React.createElement(tag, props, children);
    };
  };

  return {
    ActionButton: component('button'),
    Checkbox: component('label'),
    CheckboxGroup: component('div'),
  };
});

import { HomePage } from '../Homepage';

describe('HomePage', () => {
  it('renders landing content', () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain('Vite + React');
    expect(html).toContain('count is 0');
    expect(html).toContain('Configure Apollo Client');
  });
});
