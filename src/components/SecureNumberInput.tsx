import React, { useState, useCallback } from 'react';

interface SecureNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  min?: number;
  max?: number;
  step?: number;
}

export const SecureNumberInput: React.FC<SecureNumberInputProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  // initialEncryptedValue,
  // onEncryptedChange,
  validateFn,
  min,
  max,
  step,
  className = '',
  ...props
}) => {
  // State for number value and validation
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Handle value changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Validate if validation function provided
    if (validateFn) {
      const validationError = validateFn(newValue);
      setError(validationError);
      if (validationError) return;
    }

    // Encryption and decryption logic would go here
  }, [name, validateFn]);

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {sensitivityLevel !== 'standard' && (
          <span className={`ml-2 text-xs ${
            sensitivityLevel === 'PHI' ? 'text-red-500' : 'text-yellow-500'
          }`}>
            ({sensitivityLevel})
          </span>
        )}
      </label>

      <input
        type="number"
        id={name}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className={`block w-full rounded-md border-gray-300 shadow-sm
          focus:border-blue-500 focus:ring-blue-500 sm:text-sm
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};