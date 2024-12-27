import React, { useState, useCallback, useEffect } from 'react';
import { useSecurity } from '../contexts/SecurityContext';

interface SecureCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: boolean) => string | null;
}

export const SecureCheckbox: React.FC<SecureCheckboxProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  initialEncryptedValue,
  onEncryptedChange,
  validateFn,
  className = '',
  ...props
}) => {
  const { encrypt, decrypt, isInitialized } = useSecurity();
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const decryptInitialValue = async () => {
      if (initialEncryptedValue && isInitialized) {
        try {
          const decrypted = await decrypt(initialEncryptedValue);
          setChecked(decrypted === 'true');
        } catch (err) {
          setError('Failed to decrypt initial value');
          console.error('Decryption error:', err);
        }
      }
      setIsLoading(false);
    };

    decryptInitialValue();
  }, [initialEncryptedValue, decrypt, isInitialized]);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setChecked(newValue);

    if (validateFn) {
      const validationError = validateFn(newValue);
      setError(validationError);
      if (validationError) return;
    }

    try {
      if (isInitialized && onEncryptedChange) {
        const encryptedValue = await encrypt(String(newValue));
        onEncryptedChange(name, encryptedValue);
      }
    } catch (err) {
      setError('Failed to encrypt value');
      console.error('Encryption error:', err);
    }
  }, [name, onEncryptedChange, validateFn, encrypt, isInitialized]);

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
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
      </div>
      <div className="ml-3">
        <label htmlFor={name} className="text-sm text-gray-900">
          {label}
          {sensitivityLevel !== 'standard' && (
            <span className={`ml-2 text-xs px-2 py-1 rounded-full inline-block ${
              sensitivityLevel === 'PHI' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {sensitivityLevel}
            </span>
          )}
        </label>
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${name}-error`} role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default SecureCheckbox;
