import React, { useState, useCallback, useEffect } from 'react';
import { useSecurity } from '../contexts/SecurityContext';

interface SelectOption {
  value: string;
  label: string;
}

interface SecureSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  name: string;
  label: string;
  options: Array<string | SelectOption>;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  className?: string;
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
  const { encrypt, decrypt, isInitialized } = useSecurity();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const decryptInitialValue = async () => {
      if (initialEncryptedValue && isInitialized) {
        try {
          const decrypted = await decrypt(initialEncryptedValue);
          setValue(typeof decrypted === 'string' ? decrypted : '');
        } catch (err) {
          setError('Failed to decrypt initial value');
        }
      }
      setIsLoading(false);
    };

    decryptInitialValue();
  }, [initialEncryptedValue, decrypt, isInitialized]);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (validateFn) {
      const validationError = validateFn(newValue);
      setError(validationError);
      if (validationError) return;
    }

    try {
      if (isInitialized && onEncryptedChange) {
        const encryptedValue = await encrypt(newValue);
        onEncryptedChange(name, encryptedValue);
      }
    } catch (err) {
      setError('Failed to encrypt value');
      console.error('Encryption error:', err);
    }
  }, [name, onEncryptedChange, validateFn, encrypt, isInitialized]);

  const renderOptions = () => {
    return options.map((option, index) => {
      if (typeof option === 'string') {
        return (
          <option key={index} value={option}>
            {option}
          </option>
        );
      }
      return (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      );
    });
  };

  if (isLoading) {
    return <div className="animate-pulse h-10 bg-gray-100 rounded" />;
  }

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-900"
      >
        {label}
        {sensitivityLevel !== 'standard' && (
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
            sensitivityLevel === 'PHI' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {sensitivityLevel}
          </span>
        )}
      </label>

      <select
        id={name}
        value={value}
        onChange={handleChange}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      >
        {renderOptions()}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecureSelect;
