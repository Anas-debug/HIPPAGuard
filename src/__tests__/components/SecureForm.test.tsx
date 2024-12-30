import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import { SecureForm } from '../../components/SecureForm';
import { SecureField } from '../../components/SecureField';

describe('SecureForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form and children', async () => {
    render(
      <SecureForm onSubmit={() => {}}>
        <SecureField
          name="testField"
          label="Test Field"
        />
        <button type="submit">Submit</button>
      </SecureForm>
    );

    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const handleSubmit = jest.fn();
    const user = userEvent.setup();

    render(
      <SecureForm onSubmit={handleSubmit}>
        <SecureField
          name="testField"
          label="Test Field"
        />
        <button type="submit">Submit</button>
      </SecureForm>
    );

    await user.type(screen.getByLabelText('Test Field'), 'test value');
    await user.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it('handles validation before submission', async () => {
    const handleSubmit = jest.fn();
    const validateFn = jest.fn(value => value.length < 3 ? 'Too short' : null);
    const user = userEvent.setup();

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

    await user.type(screen.getByLabelText('Test Field'), 'ab');
    await user.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Too short')).toBeInTheDocument();
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });
});
