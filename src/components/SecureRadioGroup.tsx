import React, { useState, useCallback } from 'react';

interface SecureRadioGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  name: string;
  label: string;
  options: string[];
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
}

export const SecureRadioGroup: React.FC<SecureRadioGroupProps> = ({
  name,
  label,
  options,
  sensitivityLevel = 'standard',
  // initialEncryptedValue,
  // onEncryptedChange,
  className = '',
  ...props
}) => {
  // State for selected option
  const [selectedOption, setSelectedOption] = useState('');

  // Handle option changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newOption = e.target.value;
    setSelectedOption(newOption);

    // Encryption and decryption logic would go here
  }, [name]);

  return (
    <div>
      <div className="text-sm font-medium text-gray-900 mb-2">
        {label}
        {sensitivityLevel !== 'standard' && (
          <span className={`ml-1 text-xs ${
            sensitivityLevel === 'PHI' ? 'text-red-500' : 'text-yellow-500'
          }`}>
            ({sensitivityLevel})
          </span>
        )}
      </div>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option}`}
              name={name}
              value={option}
              checked={selectedOption === option}
              onChange={handleChange}
              className={`form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out
                ${className}`}
              {...props}
            />
            <label
              htmlFor={`${name}-${option}`}
              className="ml-2 block text-sm text-gray-900"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
