import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SecureForm } from '../../components/SecureForm';
import { SecureField } from '../../components/SecureField';

describe('SecureForm', () => {
  it('renders form with children', () => {
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

  it('handles form submission with encrypted data', async () => {
    const handleSubmit = jest.fn();
    
    render(
      <SecureForm onSubmit={handleSubmit}>
        <SecureField
          name="testField"
          label="Test Field"
        />
        <button type="submit">Submit</button>
      </SecureForm>
    );
    
    const input = screen.getByLabelText('Test Field');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it('collects multiple encrypted fields', async () => {
    const handleSubmit = jest.fn();
    
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
    
    const field1 = screen.getByLabelText('Field 1');
    const field2 = screen.getByLabelText('Field 2');
    
    fireEvent.change(field1, { target: { value: 'value 1' } });
    fireEvent.change(field2, { target: { value: 'value 2' } });
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
      const submittedData = handleSubmit.mock.calls[0][0];
      expect(Object.keys(submittedData)).toContain('field1');
      expect(Object.keys(submittedData)).toContain('field2');
    });
  });
});