import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecureCheckbox } from '../../components/SecureCheckbox';
import { SecurityProvider } from '../../contexts/SecurityContext';

const renderWithSecurity = (ui: React.ReactElement) => {
  return render(
    <SecurityProvider>
      {ui}
    </SecurityProvider>
  );
};

describe('SecureCheckbox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label', () => {
    renderWithSecurity(
      <SecureCheckbox
        name="testCheckbox"
        label="Test Checkbox"
      />
    );

    expect(screen.getByLabelText('Test Checkbox')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('handles initial encrypted value', async () => {
    renderWithSecurity(
      <SecureCheckbox
        name="testCheckbox"
        label="Test Checkbox"
        initialEncryptedValue="encrypted-true"
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  it('displays PHI sensitivity level correctly', () => {
    renderWithSecurity(
      <SecureCheckbox
        name="testCheckbox"
        label="Test Checkbox"
        sensitivityLevel="PHI"
      />
    );

    const phiIndicator = screen.getByText('PHI');
    expect(phiIndicator).toBeInTheDocument();
    expect(phiIndicator).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('displays PII sensitivity level correctly', () => {
    renderWithSecurity(
      <SecureCheckbox
        name="testCheckbox"
        label="Test Checkbox"
        sensitivityLevel="PII"
      />
    );

    const piiIndicator = screen.getByText('PII');
    expect(piiIndicator).toBeInTheDocument();
    expect(piiIndicator).toHaveClass('bg-yellow-100', 'text-yellow-700');
  });

  it('calls onEncryptedChange when toggled', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    renderWithSecurity(
      <SecureCheckbox
        name="testCheckbox"
        label="Test Checkbox"
        onEncryptedChange={handleChange}
      />
    );

    await user.click(screen.getByRole('checkbox'));
    
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('testCheckbox', expect.any(String));
    });
  });

  it('validates changes correctly', async () => {
    const validateFn = jest.fn((value: boolean) => 
      value ? null : 'This must be checked'
    );
    const user = userEvent.setup();

    renderWithSecurity(
      <SecureCheckbox
        name="testCheckbox"
        label="Test Checkbox"
        validateFn={validateFn}
      />
    );

    expect(screen.getByText('This must be checked')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox'));
    
    await waitFor(() => {
      expect(screen.queryByText('This must be checked')).not.toBeInTheDocument();
    });
  });
});
