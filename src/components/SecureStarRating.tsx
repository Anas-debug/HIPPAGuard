import React, { useState, useCallback } from 'react';

interface SecureStarRatingProps {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  className?: string;
  maxRating?: number;
}

const SecureStarRating: React.FC<SecureStarRatingProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  onEncryptedChange,
  validateFn,
  className = '',
  maxRating = 5,
}) => {
  const [rating, setRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = useCallback((selectedRating: number) => {
    setRating(selectedRating);

    // Validation
    if (validateFn) {
      const validationError = validateFn(selectedRating.toString());
      setError(validationError);
      if (validationError) return;
    }

    // Encrypt and send
    onEncryptedChange?.(name, selectedRating.toString());
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

      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              key={index}
              type="button"
              className="focus:outline-none"
              onClick={() => handleRatingChange(ratingValue)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill={ratingValue <= rating ? '#ffc107' : 'none'}
                stroke={ratingValue <= rating ? '#ffc107' : '#e4e5e9'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecureStarRating;
