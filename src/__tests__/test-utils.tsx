import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { SecurityProvider } from '../contexts/SecurityContext';
import { FormProvider } from '../contexts/FormContext';

function render(
  ui: React.ReactElement,
  {
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SecurityProvider>
        <FormProvider>
          {children}
        </FormProvider>
      </SecurityProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
export { render };
