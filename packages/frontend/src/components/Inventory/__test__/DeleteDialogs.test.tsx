/* eslint-disable react/display-name */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-spectrum/s2/style', () => ({
  style: () => '',
  iconStyle: () => '',
}));

vi.mock('@react-spectrum/s2', () => {
  const component = (tag: string) => {
    return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const renderProp = children as unknown;
      if (typeof renderProp === 'function') {
        return React.createElement(tag, props, (renderProp as (args: { close: () => void }) => React.ReactNode)({ close: () => {} }));
      }
      return React.createElement(tag, props, children);
    };
  };

  return {
    Button: component('button'),
    ButtonGroup: component('div'),
    Content: component('div'),
    Dialog: component('div'),
    Heading: component('h2'),
  };
});

import { BlockedDeleteDialog, ConfirmDeleteDialog } from '../DeleteDialogs';

describe('DeleteDialogs', () => {
  it('renders confirm dialog content', () => {
    const html = renderToStaticMarkup(
      <ConfirmDeleteDialog
        nounName="author"
        onCancel={() => {}}
        onConfirm={() => {}}
      />,
    );

    expect(html).toContain('Delete author');
    expect(html).toContain('This action cannot be undone.');
  });

  it('renders blocked dialog references', () => {
    const html = renderToStaticMarkup(
      <BlockedDeleteDialog
        nounName="tag"
        references={['book-1', 'book-2']}
        onClose={() => {}}
      />,
    );

    expect(html).toContain('Cannot delete tag');
    expect(html).toContain('book-1');
    expect(html).toContain('book-2');
  });
});
