import { useState, useCallback, useRef, useEffect } from 'react';
import { copyToClipboard } from '../utils/clipboard';

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setErrorMessage(null);
      const success = await copyToClipboard(text);

      if (success) {
        setCopied(true);
        timerRef.current = window.setTimeout(() => {
          setCopied(false);
        }, timeout);
        return true;
      } else {
        setCopied(false);
        setErrorMessage('Unable to access clipboard. Please copy the password manually.');
        timerRef.current = window.setTimeout(() => {
          setErrorMessage(null);
        }, 4000);
        return false;
      }
    },
    [timeout]
  );

  return { copied, errorMessage, copy };
}
