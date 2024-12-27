import React, { useState, useCallback } from 'react';

interface CheckboxOption {
  value: string;
  label: string;
}

interface SecureCheckboxGroupProps {
  name: string;
  label: string;
  options: CheckboxOption[];
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string[];
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string[]) => string | null;
  className?: string;
}

const SecureCheckboxGroup: React.FC<SecureCheckboxGroupProps> = ({
  name,
  label,
  options,
  sensitivityLevel = 'standard',
  onEncryptedChange,
  validateFn,
  className = '',
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleOptionToggle = useCallback((optionValue: string) => {
    const newSelectedOptions = selectedOptions.includes(optionValue)
      ? selectedOptions.filter(value => value !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(newSelectedOptions);

    // Validation
    if (validateFn) {
      const validationError = validateFn(newSelectedOptions);
      setError(validationError);
      if (validationError) return;
    }

    // Encrypt and send
    onEncryptedChange?.(name, JSON.stringify(newSelectedOptions));
  }, [name, onEncryptedChange, validateFn, selectedOptions]);

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

      <div className={`space-y-2 ${className}`}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="checkbox"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={selectedOptions.includes(option.value)}
              onChange={() => handleOptionToggle(option.value)}
              className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label 
              htmlFor={`${name}-${option.value}`}
              className="ml-2 block text-sm text-gray-900"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecureCheckboxGroup;
