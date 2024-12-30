import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecurityProvider } from '../../contexts/SecurityContext';
import { SecureTimePicker } from '../../components/SecureTimePicker';

const renderWithSecurity = (ui: React.ReactElement) => {
  return render(
    <SecurityProvider>{ui}</SecurityProvider>
  );
};

describe('SecureTimePicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label', () => {
    renderWithSecurity(
      <SecureTimePicker
        name="appointmentTime"
        label="Appointment Time"
        onEncryptedChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Appointment Time')).toBeInTheDocument();
  });

  it('displays sensitivity level indicator for PHI data', () => {
    renderWithSecurity(
      <SecureTimePicker
        name="appointmentTime"
        label="Appointment Time"
        sensitivityLevel="PHI"
        onEncryptedChange={mockOnChange}
      />
    );

    expect(screen.getByText('PHI')).toBeInTheDocument();
  });

  it('handles time selection', async () => {
    const user = userEvent.setup();
    
    renderWithSecurity(
      <SecureTimePicker
        name="appointmentTime"
        label="Appointment Time"
        onEncryptedChange={mockOnChange}
      />
    );

    await user.type(screen.getByLabelText('Appointment Time'), '14:30');

    expect(screen.getByLabelText('Appointment Time')).toHaveValue('14:30');
  });

  it('validates time selection', async () => {
    const validateFn = jest.fn((value: string) => {
      const hour = parseInt(value.split(':')[0]);
      if (hour < 9 || hour > 17) return 'Time must be between 9 AM and 5 PM';
      return null;
    });

    const user = userEvent.setup();
    
    renderWithSecurity(
      <SecureTimePicker
        name="appointmentTime"
        label="Appointment Time"
        validateFn={validateFn}
        onEncryptedChange={mockOnChange}
      />
    );

    await user.type(screen.getByLabelText('Appointment Time'), '20:00');
    
    expect(screen.getByText('Time must be between 9 AM and 5 PM')).toBeInTheDocument();
  });
});
