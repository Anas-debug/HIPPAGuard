import React, { useState, useCallback } from 'react';

interface SecureEditorProps {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  className?: string;
  rows?: number;
}

const SecureEditor: React.FC<SecureEditorProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  onEncryptedChange,
  validateFn,
  className = '',
  rows = 4,
}) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Validation
    if (validateFn) {
      const validationError = validateFn(newContent);
      setError(validationError);
      if (validationError) return;
    }

    // Encrypt and send
    onEncryptedChange?.(name, newContent);
  }, [name, onEncryptedChange, validateFn]);

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

      <textarea
        id={name}
        name={name}
        value={content}
        onChange={handleChange}
        rows={rows}
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

export default SecureEditor;
