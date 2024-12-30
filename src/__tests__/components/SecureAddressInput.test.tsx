import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecurityProvider } from '../../contexts/SecurityContext';
import { SecureAddressInput } from '../../components/SecureAddressInput';

const renderWithSecurity = (ui: React.ReactElement) => {
  return render(
    <SecurityProvider>{ui}</SecurityProvider>
  );
};

describe('SecureAddressInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all address fields correctly', () => {
    renderWithSecurity(
      <SecureAddressInput
        name="address"
        label="Address"
        onEncryptedChange={mockOnChange}
      />
    );

    expect(screen.getByPlaceholderText('Address Line 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Address Line 2')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('State')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Zip')).toBeInTheDocument();
  });

  it('displays sensitivity level indicator correctly', () => {
    renderWithSecurity(
      <SecureAddressInput
        name="address"
        label="Address"
        sensitivityLevel="PHI"
        onEncryptedChange={mockOnChange}
      />
    );

    expect(screen.getByText('PHI')).toBeInTheDocument();
  });

  it('handles user input for all fields', async () => {
    const user = userEvent.setup();
    
    renderWithSecurity(
      <SecureAddressInput
        name="address"
        label="Address"
        onEncryptedChange={mockOnChange}
      />
    );

    await user.type(screen.getByPlaceholderText('Address Line 1'), '123 Main St');
    await user.type(screen.getByPlaceholderText('City'), 'Boston');
    await user.type(screen.getByPlaceholderText('State'), 'MA');
    await user.type(screen.getByPlaceholderText('Zip'), '02108');

    expect(screen.getByPlaceholderText('Address Line 1')).toHaveValue('123 Main St');
    expect(screen.getByPlaceholderText('City')).toHaveValue('Boston');
    expect(screen.getByPlaceholderText('State')).toHaveValue('MA');
    expect(screen.getByPlaceholderText('Zip')).toHaveValue('02108');
  });

  it('validates address fields correctly', async () => {
    const validateFn = jest.fn((value: string) => {
      if (!value.includes(',')) return 'Invalid address format';
      return null;
    });

    const user = userEvent.setup();
    
    renderWithSecurity(
      <SecureAddressInput
        name="address"
        label="Address"
        validateFn={validateFn}
        onEncryptedChange={mockOnChange}
      />
    );

    await user.type(screen.getByPlaceholderText('Address Line 1'), '123 Main St');
    await user.type(screen.getByPlaceholderText('City'), 'Boston');
    
    expect(screen.getByText('Invalid address format')).toBeInTheDocument();
  });

  it('shows loading state for encrypted values', async () => {
    renderWithSecurity(
      <SecureAddressInput
        name="address"
        label="Address"
        initialEncryptedValue="encrypted-value"
        onEncryptedChange={mockOnChange}
      />
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Address Line 1')).toBeInTheDocument();
    });
  });
});
