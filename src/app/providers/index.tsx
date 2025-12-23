import { ThemeProvider } from '@/app/providers/theme-provider';
import React from 'react';
import { HashRouter } from 'react-router-dom';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="dark">
      <HashRouter>
        {children}
      </HashRouter>
    </ThemeProvider>
  );
};
