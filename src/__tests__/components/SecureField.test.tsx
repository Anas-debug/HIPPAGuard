import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { SecureField } from '../../components/SecureField';

describe('SecureField', () => {
  it('renders with label and input', async () => {
    await act(async () => {
      render(
        <SecureField
          name="testField"
          label="Test Input"
        />
      );
    });
    
    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
  });

  it('shows PHI indicator for PHI fields', async () => {
    await act(async () => {
      render(
        <SecureField
          name="medicalRecord"
          label="Medical Record"
          sensitivityLevel="PHI"
        />
      );
    });
    
    expect(screen.getByText('(PHI)')).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const onEncryptedChange = jest.fn();
    
    await act(async () => {
      render(
        <SecureField
          name="testField"
          label="Test Input"
          onEncryptedChange={onEncryptedChange}
        />
      );
    });
    
    const input = screen.getByLabelText('Test Input');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test value' } });
    });
    
    await waitFor(() => {
      expect(onEncryptedChange).toHaveBeenCalled();
    });
  });

  it('displays validation error', async () => {
    const validateFn = (value: string) => 
      value.length < 3 ? 'Value too short' : null;
    
    await act(async () => {
      render(
        <SecureField
          name="testField"
          label="Test Input"
          validateFn={validateFn}
        />
      );
    });
    
    const input = screen.getByLabelText('Test Input');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'ab' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText('Value too short')).toBeInTheDocument();
    });
  });
});
