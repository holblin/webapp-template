import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  negativeToast: vi.fn(),
  refValue: { current: null as string | null },
}));

vi.mock('react', () => ({
  useRef: () => mocks.refValue,
  useEffect: (effect: () => void) => {
    effect();
  },
}));

vi.mock('@react-spectrum/s2', () => ({
  ToastQueue: {
    negative: mocks.negativeToast,
  },
}));

import { useErrorToast } from '../useErrorToast';

describe('useErrorToast', () => {
  it('pushes toast once per unique error message', () => {
    mocks.refValue.current = null;

    useErrorToast(null);
    useErrorToast('Boom');
    useErrorToast('Boom');
    useErrorToast('Boom 2');

    expect(mocks.negativeToast).toHaveBeenCalledTimes(2);
    expect(mocks.negativeToast).toHaveBeenNthCalledWith(1, 'Boom');
    expect(mocks.negativeToast).toHaveBeenNthCalledWith(2, 'Boom 2');
  });
});
