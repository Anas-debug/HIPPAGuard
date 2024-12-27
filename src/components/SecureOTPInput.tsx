import React, { useState, useCallback } from 'react';
import OtpInput from 'react-otp-input';

interface SecureOTPInputProps {
  name: string;
  label: string;
  length?: number;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
}

export const SecureOTPInput: React.FC<SecureOTPInputProps> = ({
  name,
  label,
  length = 6,
  sensitivityLevel = 'standard',
  // initialEncryptedValue,
  // onEncryptedChange,
}) => {
  // State for OTP value
  const [otp, setOTP] = useState('');

  // Handle OTP change
  const handleChange = useCallback((value: string) => {
    setOTP(value);

    // Encryption and decryption logic would go here
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

      <OtpInput
        id={name}
        value={otp}
        onChange={handleChange}
        numInputs={length}
        separator={<span className="w-2"></span>}
        inputStyle={{
          width: '3rem',
          height: '3rem',
          fontSize: '1.5rem',
          borderRadius: '0.375rem',
          border: '1px solid #D1D5DB',
        }}
      />
    </div>
  );
};
