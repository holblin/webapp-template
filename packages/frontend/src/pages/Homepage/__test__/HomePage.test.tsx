/* eslint-disable react/display-name */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-spectrum/s2', () => {
  const component = (tag: string) => {
    return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      return React.createElement(tag, props, children);
    };
  };

  return {
    ButtonGroup: component('div'),
    Divider: component('hr'),
    LinkButton: component('a'),
  };
});

import { HomePage } from '../Homepage';

describe('HomePage', () => {
  it('renders landing content', () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain('Build production-ready web apps faster');
    expect(html).toContain('React + React Spectrum + GraphQL template');
    expect(html).toContain('Quick start path');
  });
});
