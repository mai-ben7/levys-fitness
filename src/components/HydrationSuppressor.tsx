'use client';

import { useEffect } from 'react';

export default function HydrationSuppressor() {
  useEffect(() => {
    // Suppress hydration warnings for browser extension attributes
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        (message.includes('fdprocessedid') ||
         message.includes('hydration') ||
         message.includes('server rendered HTML'))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
} 