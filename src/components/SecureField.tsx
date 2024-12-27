import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSecurity } from '../contexts/SecurityContext';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SecureFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  hint?: string;
  mask?: string;
  showStrength?: boolean;
  allowReveal?: boolean;
  required?: boolean;
  successMessage?: string;
}

export const SecureField: React.FC<SecureFieldProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  initialEncryptedValue,
  onEncryptedChange,
  validateFn,
  type = 'text',
  className = '',
  hint,
  mask,
  showStrength = false,
  allowReveal = false,
  required = false,
  successMessage,
  placeholder,
  disabled,
  ...props
}) => {
  const { encrypt, decrypt, isInitialized } = useSecurity();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  // Handle initial value decryption
  useEffect(() => {
    const decryptInitialValue = async () => {
      if (initialEncryptedValue && isInitialized) {
        try {
          const decrypted = await decrypt(initialEncryptedValue);
          setValue(decrypted);
          if (showStrength) calculateStrength(decrypted);
        } catch (err) {
          setError('Failed to decrypt initial value');
          console.error('Decryption error:', err);
        }
      }
      setIsLoading(false);
    };

    decryptInitialValue();
  }, [initialEncryptedValue, decrypt, isInitialized]);

  // Password strength calculation
  const calculateStrength = (password: string) => {
    let score = 0;
    if (password.length > 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setStrength(score);
  };

  // Handle masked input
  const applyMask = (value: string, mask: string) => {
    let output = '';
    let valueIndex = 0;

    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      if (mask[i] === '#') {
        output += value[valueIndex];
        valueIndex++;
      } else {
        output += mask[i];
        if (value[valueIndex] === mask[i]) valueIndex++;
      }
    }

    return output;
  };

  // Handle value changes
  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Apply mask if provided
    if (mask) {
      const digits = newValue.replace(/\D/g, '');
      newValue = applyMask(digits, mask);
    }

    setValue(newValue);

    // Calculate password strength
    if (showStrength) {
      calculateStrength(newValue);
    }

    // Validate if validation function provided
    if (validateFn) {
      const validationError = validateFn(newValue);
      setError(validationError);
      if (validationError) return;
    } else {
      setError(null);
    }

    try {
      if (isInitialized && onEncryptedChange) {
        const encryptedValue = await encrypt(newValue);
        onEncryptedChange(name, encryptedValue);
      }
    } catch (err) {
      setError('Failed to encrypt value');
      console.error('Encryption error:', err);
    }
  }, [name, onEncryptedChange, validateFn, encrypt, isInitialized, mask]);

  // Handle caps lock detection
  const handleKeyPress = (e: KeyboardEvent) => {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, []);

  const getInputType = () => {
    if (type === 'password' && showPassword && allowReveal) {
      return 'text';
    }
    return type;
  };

  if (isLoading) {
    return <div className="animate-pulse h-10 bg-gray-100 rounded" />;
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-900"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {sensitivityLevel !== 'standard' && (
            <span className={`ml-2 text-xs px-2 py-1 rounded-full inline-block ${
              sensitivityLevel === 'PHI' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {sensitivityLevel}
            </span>
          )}
        </label>
        {hint && (
          <span className="text-xs text-gray-500">{hint}</span>
        )}
      </div>

      <div className="relative rounded-md shadow-sm">
        <input
          ref={inputRef}
          id={name}
          type={getInputType()}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full rounded-md shadow-sm pr-10
            focus:ring-blue-500 focus:border-blue-500 sm:text-sm
            ${error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'}
            ${disabled ? 'bg-gray-50 text-gray-500' : ''}
            ${className}`}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
          disabled={disabled}
          {...props}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
          {type === 'password' && allowReveal && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {error && <AlertCircle className="h-5 w-5 text-red-500" />}
          {!error && value && successMessage && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </div>
      </div>

      {showStrength && type === 'password' && value && (
        <div className="mt-1">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-1 w-1/5 rounded-full ${
                  level <= strength
                    ? strength <= 2
                      ? 'bg-red-500'
                      : strength <= 3
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {strength <= 2 && 'Weak'}
            {strength === 3 && 'Medium'}
            {strength === 4 && 'Strong'}
            {strength === 5 && 'Very Strong'}
          </p>
        </div>
      )}

      {isCapsLockOn && type === 'password' && (
        <p className="mt-1 text-sm text-yellow-600">Caps Lock is on</p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}

      {!error && value && successMessage && (
        <p className="mt-1 text-sm text-green-600">{successMessage}</p>
      )}
    </div>
  );
};

export default SecureField;
