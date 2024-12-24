import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { SecureForm } from '../../components/SecureForm';
import { SecureField } from '../../components/SecureField';

describe('SecureForm', () => {
  it('renders form with children', async () => {
    await act(async () => {
      render(
        <SecureForm onSubmit={() => {}}>
          <SecureField
            name="testField"
            label="Test Field"
          />
          <button type="submit">Submit</button>
        </SecureForm>
      );
    });
    
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const handleSubmit = jest.fn();
    
    await act(async () => {
      render(
        <SecureForm onSubmit={handleSubmit}>
          <SecureField
            name="testField"
            label="Test Field"
          />
          <button type="submit">Submit</button>
        </SecureForm>
      );
    });

    const input = screen.getByLabelText('Test Field');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test value' } });
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button'));
    });
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it('collects multiple encrypted fields', async () => {
    const handleSubmit = jest.fn();
    
    await act(async () => {
      render(
        <SecureForm onSubmit={handleSubmit}>
          <SecureField
            name="field1"
            label="Field 1"
          />
          <SecureField
            name="field2"
            label="Field 2"
          />
          <button type="submit">Submit</button>
        </SecureForm>
      );
    });

    const field1 = screen.getByLabelText('Field 1');
    const field2 = screen.getByLabelText('Field 2');
    
    await act(async () => {
      fireEvent.change(field1, { target: { value: 'value 1' } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      fireEvent.change(field2, { target: { value: 'value 2' } });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button'));
    });
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
      const submittedData = handleSubmit.mock.calls[0][0];
      expect(submittedData).toHaveProperty('field1');
      expect(submittedData).toHaveProperty('field2');
    });
  });
});
