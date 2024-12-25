import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecureField } from '../../components/SecureField';
import { act } from 'react-dom/test-utils';

describe('SecureField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label and input', () => {
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

  it('handles user input', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup({ delay: null }); // Disable delay

    render(
      <SecureField
        name="testField"
        label="Test Input"
        onChange={handleChange}
      />
    );

    await act(async () => {
      const input = screen.getByLabelText('Test Input');
      await user.type(input, 'test value');
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it('shows sensitivity level indicator', () => {
    render(
      <SecureField
        name="testField"
        label="Test Input"
        sensitivityLevel="PHI"
      />
    );

    // Use getAllByText and check for presence of PHI
    const elements = screen.getAllByText(/PHI/);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('validates input', async () => {
    const validateFn = jest.fn(value => value.length < 3 ? 'Too short' : null);
    const user = userEvent.setup({ delay: null }); // Disable delay

    render(
      <SecureField
        name="testField"
        label="Test Input"
        validateFn={validateFn}
      />
    );

    await act(async () => {
      const input = screen.getByLabelText('Test Input');
      await user.type(input, 'ab');
    });

    expect(await screen.findByText('Too short')).toBeInTheDocument();
  });
});
