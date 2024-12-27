import React, { useState, useCallback, useRef, useEffect } from 'react';

interface SecureOTPInputProps {
  name: string;
  label: string;
  length?: number;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  className?: string;
}

const SecureOTPInput: React.FC<SecureOTPInputProps> = ({
  name,
  label,
  length = 6,
  sensitivityLevel = 'standard',
  onEncryptedChange,
  validateFn,
  className = '',
}) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback((index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all inputs are filled
    const completeOtp = newOtp.join('');
    if (completeOtp.length === length) {
      // Validation
      if (validateFn) {
        const validationError = validateFn(completeOtp);
        setError(validationError);
        if (validationError) return;
      }

      // Encrypt and send
      onEncryptedChange?.(name, completeOtp);
    }
  }, [name, onEncryptedChange, validateFn, length, otp]);

  const handleKeyDown = useCallback((
    index: number, 
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

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

      <div className="flex space-x-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-12 text-center text-xl 
              rounded-md border 
              focus:border-blue-500 focus:ring-blue-500
              ${error ? 'border-red-300' : 'border-gray-300'}
              ${className}`}
          />
        ))}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecureOTPInput;
