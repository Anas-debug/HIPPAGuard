import React, { useState, useCallback } from 'react';  
import { Rating } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

interface SecureStarRatingProps {
  name: string;
  label: string;
  max?: number;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;  
}

export const SecureStarRating: React.FC<SecureStarRatingProps> = ({
  name,
  label, 
  max = 5,
  sensitivityLevel = 'standard',
  // initialEncryptedValue,
  // onEncryptedChange,
}) => {
  // State for rating
  const [rating, setRating] = useState(0);

  // Handle rating change  
  const handleChange = useCallback((value: number) => {
    setRating(value);

    // Encryption and decryption logic would go here
  }, [name]);

  return (
    <div>  
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {sensitivityLevel !== 'standard' && (
          <span className={`ml-2 text-xs ${
            sensitivityLevel === 'PHI' ? 'text-red-500' : 'text-yellow-500'
          }`}>
            ({sensitivityLevel})
          </span>  
        )}
      </label>

      <Rating
        value={rating}
        onChange={handleChange} 
        max={max}
        emptySymbol={<IconStar size={24} fill="transparent" color="gray" stroke={1.5} />}
        fullSymbol={<IconStar size={24} fill="orange" color="orange" stroke={1.5} />}
      />
    </div>
  );
}; 
