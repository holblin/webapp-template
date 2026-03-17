import { useCallback, useSyncExternalStore } from 'react';

const supportsMatchMedia = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function';

export const useIsSmallViewport = (maxWidth: number) => {
  const query = `(max-width: ${maxWidth}px)`;

  const subscribe = useCallback((onStoreChange: () => void) => {
    if (!supportsMatchMedia()) {
      return () => {};
    }

    const mediaQueryList = window.matchMedia(query);
    const onChange = () => {
      onStoreChange();
    };

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    }

    mediaQueryList.addListener(onChange);
    return () => mediaQueryList.removeListener(onChange);
  }, [query]);

  const getSnapshot = useCallback(() => (
    supportsMatchMedia()
      ? window.matchMedia(query).matches
      : false
  ), [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
