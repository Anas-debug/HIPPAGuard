import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecureRadioGroup } from '../../components/SecureRadioGroup';
import { SecurityProvider } from '../../contexts/SecurityContext';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const renderWithSecurity = (ui: React.ReactElement) => {
  return render(
    <SecurityProvider>
      {ui}
    </SecurityProvider>
  );
};

describe('SecureRadioGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all options', () => {
    renderWithSecurity(
      <SecureRadioGroup
        name="testRadio"
        label="Test Radio"
        options={options}
      />
    );

    options.forEach(option => {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument();
    });
  });

  it('handles initial encrypted value', async () => {
    renderWithSecurity(
      <SecureRadioGroup
        name="testRadio"
        label="Test Radio"
        options={options}
        initialEncryptedValue="encrypted-option1"
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Option 1')).toBeChecked();
    });
  });

  it('calls onEncryptedChange when option selected', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    renderWithSecurity(
      <SecureRadioGroup
        name="testRadio"
        label="Test Radio"
        options={options}
        onEncryptedChange={handleChange}
      />
    );

    await user.click(screen.getByLabelText('Option 1'));

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('testRadio', expect.any(String));
    });
  });

  it('displays sensitivity level correctly', () => {
    renderWithSecurity(
      <SecureRadioGroup
        name="testRadio"
        label="Test Radio"
        options={options}
        sensitivityLevel="PHI"
      />
    );

    const phiIndicator = screen.getByText('PHI');
    expect(phiIndicator).toBeInTheDocument();
    expect(phiIndicator).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('validates selection correctly', async () => {
    const validateFn = jest.fn((value: string) =>
      value === 'option2' ? 'Option 2 is not allowed' : null
    );
    const user = userEvent.setup();

    renderWithSecurity(
      <SecureRadioGroup
        name="testRadio"
        label="Test Radio"
        options={options}
        validateFn={validateFn}
      />
    );

    await user.click(screen.getByLabelText('Option 2'));

    await waitFor(() => {
      expect(screen.getByText('Option 2 is not allowed')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('Option 1'));

    await waitFor(() => {
      expect(screen.queryByText('Option 2 is not allowed')).not.toBeInTheDocument();
    });
  });
});
