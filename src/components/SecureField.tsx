import React, { useState, useCallback } from 'react';

interface SecureFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
}

export const SecureField: React.FC<SecureFieldProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  // initialEncryptedValue,
  // onEncryptedChange,
  validateFn,
  type = 'text',
  className = '',
  ...props
}) => {
  // State for field value and validation
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  // Initialize security core
  // const securityCore = new SecurityCore();

  // Handle initial encrypted value
  // useEffect(() => {
  //   const decryptInitialValue = async () => {
  //     if (initialEncryptedValue) {
  //       try {
  //         await securityCore.initialize('temp-key'); // In real app, get from context
  //         const decrypted = await securityCore.decrypt(initialEncryptedValue);
  //         setValue(typeof decrypted === 'string' ? decrypted : '');
  //       } catch (err) {
  //         setError('Failed to decrypt initial value');
  //       }
  //     }
  //     setIsLoading(false);
  //   };

  //   decryptInitialValue();
  // }, [initialEncryptedValue]);

  // Handle value changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Validate if validation function provided
    if (validateFn) {
      const validationError = validateFn(newValue);
      setError(validationError);
      if (validationError) return;
    }

    // try {
    //   // Encrypt the new value
    //   await securityCore.initialize('temp-key'); // In real app, get from context
    //   const encryptedValue = await securityCore.encrypt(newValue);
    //   onEncryptedChange?.(name, encryptedValue);
    // } catch (err) {
    //   setError('Failed to encrypt value');
    // }
  }, [name, validateFn]);

  // Render loading state
  // if (isLoading) {
  //   return <div className="animate-pulse h-10 bg-gray-100 rounded" />;
  // }

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
        id={name}
        type={type}
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
