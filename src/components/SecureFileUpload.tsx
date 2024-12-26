import React, { useCallback } from 'react';

interface SecureFileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
}

export const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  // onEncryptedChange,
  className = '',
  ...props
}) => {
  // Handle file changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Encryption logic would go here
    }
  }, [name]);

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
        type="file"
        id={name}
        onChange={handleChange}
        className={`block w-full text-sm text-gray-900
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          ${className}`}
        {...props}
      />
    </div>
  );
};
