import React, { useState, useCallback, useEffect } from 'react';
import { SecurityCore } from '../core/security-core';

interface SecureCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: boolean) => string | null;
}

const SecureCheckbox: React.FC<SecureCheckboxProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  initialEncryptedValue,
  onEncryptedChange,
  validateFn,
  className = '',
  ...props
}) => {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const securityCore = new SecurityCore();

  useEffect(() => {
    const decryptInitialValue = async () => {
      if (initialEncryptedValue) {
        try {
          await securityCore.initialize('temp-key');
          const decrypted = await securityCore.decrypt(initialEncryptedValue);
          setChecked(decrypted === 'true');
        } catch (err) {
          setError('Failed to decrypt initial value');
        }
      }
      setIsLoading(false);
    };

    decryptInitialValue();
  }, [initialEncryptedValue]);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setChecked(newValue);

    if (validateFn) {
      const validationError = validateFn(newValue);
      setError(validationError);
      if (validationError) return;
    }

    try {
      await securityCore.initialize('temp-key');
      const encryptedValue = await securityCore.encrypt(String(newValue));
      onEncryptedChange?.(name, encryptedValue);
    } catch (err) {
      setError('Failed to encrypt value');
    }
  }, [name, onEncryptedChange, validateFn]);

  if (isLoading) {
    return <div className="animate-pulse h-5 w-5 bg-gray-100 rounded" />;
  }

  return (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={name}
          checked={checked}
          onChange={handleChange}
          className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={name}
          className="font-medium text-gray-700"
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
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default SecureCheckbox;
