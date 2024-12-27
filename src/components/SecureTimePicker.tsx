import React, { useState, useCallback } from 'react';

interface SecureTimePickerProps {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  className?: string;
}

const SecureTimePicker: React.FC<SecureTimePickerProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  onEncryptedChange,
  validateFn,
  className = '',
}) => {
  const [time, setTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);

    // Validation
    if (validateFn) {
      const validationError = validateFn(newTime);
      setError(validationError);
      if (validationError) return;
    }

    // Encrypt and send
    onEncryptedChange?.(name, newTime);
  }, [name, onEncryptedChange, validateFn]);

  return (
    <div className="space-y-2">
      <label
        htmlFor={`${name}-time`}
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
        type="time"
        id={`${name}-time`}
        name={name}
        value={time}
        onChange={handleTimeChange}
        className={`block w-full rounded-md border-gray-300 shadow-sm
          focus:border-blue-500 focus:ring-blue-500 sm:text-sm
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}`}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecureTimePicker;
