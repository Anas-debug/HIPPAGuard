import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecureForm } from '../../components/SecureForm';
import { SecureField } from '../../components/SecureField';
import { act } from 'react-dom/test-utils';

describe('SecureForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form and children', () => {
    render(
      <SecureForm onSubmit={() => {}}>
        <SecureField
          name="testField"
          label="Test Field"
        />
        <button type="submit">Submit</button>
      </SecureForm>
    );

    // Look for specific elements instead of roles
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const handleSubmit = jest.fn();
    const user = userEvent.setup({ delay: null }); // Disable delay

    render(
      <SecureForm onSubmit={handleSubmit}>
        <SecureField
          name="testField"
          label="Test Field"
        />
        <button type="submit">Submit</button>
      </SecureForm>
    );

    await act(async () => {
      const input = screen.getByLabelText('Test Field');
      await user.type(input, 'test value');
      await user.click(screen.getByText('Submit'));
    });

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('handles validation before submission', async () => {
    const handleSubmit = jest.fn();
    const validateFn = jest.fn(value => value.length < 3 ? 'Too short' : null);
    const user = userEvent.setup({ delay: null }); // Disable delay

    render(
      <SecureForm onSubmit={handleSubmit}>
        <SecureField
          name="testField"
          label="Test Field"
          validateFn={validateFn}
        />
        <button type="submit">Submit</button>
      </SecureForm>
    );

    await act(async () => {
      const input = screen.getByLabelText('Test Field');
      await user.type(input, 'ab');
      await user.click(screen.getByText('Submit'));
    });

    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
