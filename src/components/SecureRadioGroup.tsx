import React, { useState, useCallback, useEffect } from 'react';
import { useSecurity } from '../contexts/SecurityContext';

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

export const SecureRadioGroup: React.FC<SecureRadioGroupProps> = ({
  name,
  label,
  options,
  sensitivityLevel = 'standard',
  initialEncryptedValue,
  onEncryptedChange,
  validateFn,
  className = ''
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
          console.error('Decryption error:', err);
        }
      }
      setIsLoading(false);
    };

    decryptInitialValue();
  }, [initialEncryptedValue, decrypt, isInitialized]);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  if (isLoading) {
    return <div className="animate-pulse h-20 bg-gray-100 rounded" />;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-900">
        {label}
        {sensitivityLevel !== 'standard' && (
          <span className={`ml-2 text-xs px-2 py-1 rounded-full inline-block ${
            sensitivityLevel === 'PHI' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {sensitivityLevel}
          </span>
        )}
      </label>

      <div className="bg-white rounded-md -space-y-px">
        {options.map((option, index) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          const optionId = `${name}-${optionValue}`;

          return (
            <div 
              key={optionId} 
              className={`relative flex p-4 cursor-pointer focus:outline-none
                ${index === 0 ? 'rounded-tl-md rounded-tr-md' : ''} 
                ${index === options.length - 1 ? 'rounded-bl-md rounded-br-md' : ''}
                ${value === optionValue ? 'bg-blue-50 border-blue-200 z-10' : 'border-gray-200'}
                ${index !== 0 ? '-mt-px' : ''}
                border hover:bg-gray-50`}
            >
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  id={optionId}
                  name={name}
                  value={optionValue}
                  checked={value === optionValue}
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <label
                htmlFor={optionId}
                className="ml-3 flex flex-col cursor-pointer"
              >
                <span className="block text-sm font-medium text-gray-900">
                  {optionLabel}
                </span>
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
