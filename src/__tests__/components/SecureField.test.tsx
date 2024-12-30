import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import { SecureField } from '../../components/SecureField';

describe('SecureField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label and input', async () => {
    render(
      <SecureField
        name="testField"
        label="Test Input"
        sensitivityLevel="PHI"
      />
    );

    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Input')).toHaveAttribute('type', 'text');
  });

  it('handles user input and encryption', async () => {
    const handleEncryptedChange = jest.fn();
    const user = userEvent.setup();

    render(
      <SecureField
        name="testField"
        label="Test Input"
        onEncryptedChange={handleEncryptedChange}
      />
    );

    await user.type(screen.getByLabelText('Test Input'), 'test value');

    await waitFor(() => {
      expect(handleEncryptedChange).toHaveBeenCalledWith('testField', expect.any(String));
    });
  });

  it('shows sensitivity level indicator', () => {
    render(
      <SecureField
        name="testField"
        label="Test Input"
        sensitivityLevel="PHI"
      />
    );

    expect(screen.getByText('PHI')).toBeInTheDocument();
    expect(screen.getByText('PHI')).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('validates input', async () => {
    const validateFn = jest.fn(value => value.length < 3 ? 'Too short' : null);
    const user = userEvent.setup();

    render(
      <SecureField
        name="testField"
        label="Test Input"
        validateFn={validateFn}
      />
    );

    await user.type(screen.getByLabelText('Test Input'), 'ab');

    await waitFor(() => {
      expect(screen.getByText('Too short')).toBeInTheDocument();
    });
  });
});
