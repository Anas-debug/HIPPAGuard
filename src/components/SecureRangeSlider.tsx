import React, { useState, useCallback } from 'react';
import { RangeSlider } from '@mantine/core';

interface SecureRangeSliderProps {
  name: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
}

export const SecureRangeSlider: React.FC<SecureRangeSliderProps> = ({
  name,
  label,
  min = 0,
  max = 100,
  step = 1, 
  sensitivityLevel = 'standard',
  // initialEncryptedValue,
  // onEncryptedChange,
  ...props
}) => {
  // State for range value
  const [range, setRange] = useState<[number, number]>([min, max]);

  // Handle range change
  const handleChange = useCallback((value: [number, number]) => {
    setRange(value);

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

      <RangeSlider
        id={name}
        value={range}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        {...props}
      />
    </div>
  );
};
