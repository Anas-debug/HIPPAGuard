import React, { useState, useCallback } from 'react';

interface SecureCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
}

export const SecureCheckbox: React.FC<SecureCheckboxProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  // initialEncryptedValue,
  // onEncryptedChange,
  className = '',
  ...props
}) => {
  // State for checkbox value
  const [checked, setChecked] = useState(false);

  // Handle value changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);

    // Encryption and decryption logic would go here
  }, [name]);

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={name}
        checked={checked}
        onChange={handleChange}
        className={`form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out
          ${className}`}
        {...props}
      />
      <label
        htmlFor={name}
        className="ml-2 block text-sm text-gray-900"
      >
        {label}
        {sensitivityLevel !== 'standard' && (
          <span className={`ml-1 text-xs ${
            sensitivityLevel === 'PHI' ? 'text-red-500' : 'text-yellow-500'
          }`}>
            ({sensitivityLevel})
          </span>
        )}
      </label>
    </div>
  );
};
