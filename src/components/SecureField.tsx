import React, { useState, useCallback } from 'react';

interface SecureFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  validateFn?: (value: string) => string | null;
}

const SecureField: React.FC<SecureFieldProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  validateFn,
  className = '',
  ...props
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (validateFn) {
        const validationError = validateFn(newValue);
        setError(validationError);
      }
    },
    [validateFn]
  );

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {sensitivityLevel !== 'standard' && (
          <span
            className={`ml-2 text-xs ${
              sensitivityLevel === 'PHI' ? 'text-red-500' : 'text-yellow-500'
            }`}
          >
            ({sensitivityLevel})
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        className={`block w-full rounded-md border-gray-300 shadow-sm
          focus:border-blue-500 focus:ring-blue-500 sm:text-sm
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecureField;
