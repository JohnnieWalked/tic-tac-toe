'use client';

import { useRef } from 'react';

import { ThemeProvider } from '@/providers/ThemeProvider';

/* rtk */
import { makeStore, AppStore } from '@/store';
import { Provider } from 'react-redux';

type ProviderProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProviderProps) {
  /* redux-toolkit guide for next.js applications */
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </Provider>
  );
}
