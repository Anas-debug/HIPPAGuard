import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { SecurityCore } from '../core/security-core';

// Create a wrapper with security context
const SecurityContext = React.createContext<SecurityCore | null>(null);

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const securityCore = new SecurityCore('test-key');
  return (
    <SecurityContext.Provider value={securityCore}>
      {children}
    </SecurityContext.Provider>
  );
};

const render = (ui: React.ReactElement, options = {}) =>
  rtlRender(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { render };
