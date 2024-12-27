import React, { useState, useCallback } from 'react';

interface SecureRangeSliderProps {
  name: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: number;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: number) => string | null;
  className?: string;
}

const SecureRangeSlider: React.FC<SecureRangeSliderProps> = ({
  name,
  label,
  min = 0,
  max = 100,
  step = 1,
  sensitivityLevel = 'standard',
  onEncryptedChange,
  validateFn,
  className = '',
}) => {
  const [value, setValue] = useState(min);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);

    // Validation
    if (validateFn) {
      const validationError = validateFn(newValue);
      setError(validationError);
      if (validationError) return;
    }

    // Encrypt and send
    onEncryptedChange?.(name, newValue.toString());
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

      <div className="flex items-center space-x-4">
        <input
          type="range"
          id={name}
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer
            bg-gray-200 
            ${error ? 'bg-red-200' : 'bg-gray-200'}
            ${className}`}
          style={{
            background: `linear-gradient(to right, 
              #3b82f6 0%, 
              #3b82f6 ${((value - min) / (max - min)) * 100}%, 
              #e5e7eb ${((value - min) / (max - min)) * 100}%, 
              #e5e7eb 100%)`
          }}
        />
        <span className="text-sm text-gray-700 w-16 text-right">
          {value}
        </span>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecureRangeSlider;
