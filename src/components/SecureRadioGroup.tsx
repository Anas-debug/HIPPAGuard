import React, { useState, useCallback, useEffect } from 'react';
import { SecurityCore } from '../core/security-core';

interface RadioOption {
  value: string;
  label: string;
}

interface SecureRadioGroupProps {
  name: string;
  label: string;
  options: Array<string | RadioOption>;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  className?: string;
}

const SecureRadioGroup: React.FC<SecureRadioGroupProps> = ({
  name,
  label,
  options,
  sensitivityLevel = 'standard',
  initialEncryptedValue,
  onEncryptedChange,
  validateFn,
  className = ''
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

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    return <div className="animate-pulse h-20 bg-gray-100 rounded" />;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {sensitivityLevel !== 'standard' && (
          <span className={`ml-2 text-xs ${
            sensitivityLevel === 'PHI' ? 'text-red-500' : 'text-yellow-500'
          }`}>
            ({sensitivityLevel})
          </span>
        )}
      </label>

      <div className="space-y-2">
        {options.map((option, index) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          const optionId = `${name}-${optionValue}`;

          return (
            <div key={optionId} className="flex items-center">
              <input
                type="radio"
                id={optionId}
                name={name}
                value={optionValue}
                checked={value === optionValue}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={optionId}
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {optionLabel}
              </label>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecureRadioGroup;
