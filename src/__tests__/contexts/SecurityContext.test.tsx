import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SecurityProvider, useSecurity } from '../../contexts/SecurityContext';
import { act } from 'react-dom/test-utils';

const TestComponent = () => {
  const { isInitialized, initialize } = useSecurity();

  React.useEffect(() => {
    const init = async () => {
      await initialize('test-key');
    };
    init();
  }, [initialize]);

  return (
    <div>
      <div data-testid="status">{isInitialized ? 'initialized' : 'not-initialized'}</div>
    </div>
  );
};

describe('SecurityContext', () => {
  it('initializes security core', async () => {
    await act(async () => {
      render(
        <SecurityProvider>
          <TestComponent />
        </SecurityProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('initialized');
    });
  });
});
