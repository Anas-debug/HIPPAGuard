import React, { useState, useCallback } from 'react';
import { Checkbox } from '@mantine/core';

interface SecureCheckboxGroupProps {
  name: string;
  label: string;
  options: string[];
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;  
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
}

export const SecureCheckboxGroup: React.FC<SecureCheckboxGroupProps> = ({
  name,
  label,
  options,
  sensitivityLevel = 'standard', 
  // initialEncryptedValue,
  // onEncryptedChange,
}) => {
  // State for checked options
  const [checkedOptions, setCheckedOptions] = useState<string[]>([]);

  // Handle option change
  const handleChange = useCallback((option: string) => {
    setCheckedOptions((prevChecked) =>
      prevChecked.includes(option)
        ? prevChecked.filter((o) => o !== option)
        : [...prevChecked, option]  
    );

    // Encryption and decryption logic would go here
  }, [name]);

  return (
    <div>
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

      <div className="mt-2 space-y-2">
        {options.map((option) => (
          <Checkbox
            key={option}
            label={option}
            checked={checkedOptions.includes(option)}
            onChange={() => handleChange(option)}
          />
        ))}
      </div>
    </div>
  );
};
