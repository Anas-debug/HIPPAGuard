import React, { useState, useCallback, useEffect } from 'react';
import { SecurityCore } from '../core/security-core';

interface Option {
  value: string;
  label: string;
}

interface SecureSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  name: string;
  label: string;
  options: Option[];
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
}

export const SecureSelect: React.FC<SecureSelectProps> = ({
  name,
  label,
  options,
  sensitivityLevel = 'standard',
  initialEncryptedValue,
  onEncryptedChange,
  validateFn,
  className = '',
  ...props
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const securityCore = new SecurityCore();

  useEffect(() => {
    const decryptInitialValue = async () => {
      if (initialEncryptedValue) {
        try {
          await securityCore.initialize('temp-key');
          const decrypted = await securityCore.decrypt(initialEncryptedValue);
          setValue(typeof decrypted === 'string' ? decrypted : '');
        } catch (err) {
          setError('Failed to decrypt initial value');
        }
      }
      setIsLoading(false);
    };

    decryptInitialValue();
  }, [initialEncryptedValue]);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (validateFn) {
      const validationError = validateFn(newValue);
      setError(validationError);
      if (validationError) return;
    }

    try {
      await securityCore.initialize('temp-key');
      const encryptedValue = await securityCore.encrypt(newValue);
      onEncryptedChange?.(name, encryptedValue);
    } catch (err) {
      setError('Failed to encrypt value');
    }
  }, [name, onEncryptedChange, validateFn]);

  if (isLoading) {
    return <div className="animate-pulse h-10 bg-gray-100 rounded" />;
  }

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

      <select
        id={name}
        value={value}
        onChange={handleChange}
        className={`block w-full rounded-md border-gray-300 shadow-sm
          focus:border-blue-500 focus:ring-blue-500 sm:text-sm
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
