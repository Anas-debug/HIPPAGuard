import React, { useState, useCallback, useRef, useEffect } from 'react';

interface SecureMaskedInputProps {
  name: string;
  label: string;
  mask: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  className?: string;
}

const SecureMaskedInput: React.FC<SecureMaskedInputProps> = ({
  name,
  label,
  mask,
  sensitivityLevel = 'standard',
  onEncryptedChange,
  validateFn,
  className = '',
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const applyMask = useCallback((inputValue: string) => {
    let maskedValue = '';
    let valueIndex = 0;

    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === '9' && valueIndex < inputValue.length) {
        maskedValue += inputValue[valueIndex];
        valueIndex++;
      } else if (mask[i] !== '9') {
        maskedValue += mask[i];
      }
    }

    return maskedValue;
  }, [mask]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    const maskedValue = applyMask(rawValue);
    
    setValue(maskedValue);

    // Validation
    if (validateFn) {
      const validationError = validateFn(maskedValue);
      setError(validationError);
      if (validationError) return;
    }

    // Encrypt and send
    onEncryptedChange?.(name, maskedValue);
  }, [name, onEncryptedChange, validateFn, applyMask]);

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
        ref={inputRef}
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={mask.replace(/9/g, '_')}
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

export default SecureMaskedInput;
