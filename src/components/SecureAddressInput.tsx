import React, { useState, useCallback } from 'react';

interface SecureAddressInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
}

export const SecureAddressInput: React.FC<SecureAddressInputProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  // initialEncryptedValue,
  // onEncryptedChange,
  validateFn,
  className = '',
  ...props
}) => {
  // State for address fields and validation
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Handle field changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const newValue = e.target.value;
    switch (field) {
      case 'address1':
        setAddress1(newValue);
        break;
      case 'address2':
        setAddress2(newValue);
        break;
      case 'city':
        setCity(newValue);
        break;
      case 'state':
        setState(newValue);
        break;
      case 'zip':
        setZip(newValue);
        break;
    }

    // Validate if validation function provided
    if (validateFn) {
      const fullAddress = `${address1}, ${address2}, ${city}, ${state} ${zip}`;
      const validationError = validateFn(fullAddress);
      setError(validationError);
      if (validationError) return;
    }

    // Encryption and decryption logic would go here
  }, [address1, address2, city, state, zip, validateFn]);

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

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-6">
          <input
            type="text"
            id={`${name}-address1`}
            value={address1}
            onChange={(e) => handleChange(e, 'address1')}
            placeholder="Address Line 1"
            className={`block w-full rounded-md border-gray-300 shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${error ? 'border-red-300' : 'border-gray-300'}
              ${className}`}
            {...props}
          />
        </div>

        <div className="col-span-6">
          <input
            type="text"
            id={`${name}-address2`}
            value={address2}
            onChange={(e) => handleChange(e, 'address2')}
            placeholder="Address Line 2"
            className={`block w-full rounded-md border-gray-300 shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${error ? 'border-red-300' : 'border-gray-300'}
              ${className}`}
            {...props}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <input
            type="text"
            id={`${name}-city`}
            value={city}
            onChange={(e) => handleChange(e, 'city')}
            placeholder="City"
            className={`block w-full rounded-md border-gray-300 shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${error ? 'border-red-300' : 'border-gray-300'}
              ${className}`}
            {...props}
          />
        </div>

        <div className="col-span-6 sm:col-span-2">
          <input
            type="text"
            id={`${name}-state`}
            value={state}
            onChange={(e) => handleChange(e, 'state')}
            placeholder="State"
            className={`block w-full rounded-md border-gray-300 shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${error ? 'border-red-300' : 'border-gray-300'}
              ${className}`}
            {...props}
          />
        </div>

        <div className="col-span-6 sm:col-span-1">
          <input
            type="text"
            id={`${name}-zip`}
            value={zip}
            onChange={(e) => handleChange(e, 'zip')}
            placeholder="Zip"
            className={`block w-full rounded-md border-gray-300 shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${error ? 'border-red-300' : 'border-gray-300'}
              ${className}`}
            {...props}
          />
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
