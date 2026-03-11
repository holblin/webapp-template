import { ToastQueue } from '@react-spectrum/s2';
import { useEffect, useRef } from 'react';

export const useErrorToast = (errorMessage: string | undefined | null) => {
  const lastToastErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    if (lastToastErrorRef.current === errorMessage) {
      return;
    }

    lastToastErrorRef.current = errorMessage;
    ToastQueue.negative(errorMessage);
  }, [errorMessage]);
};
