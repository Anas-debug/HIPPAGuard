import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSecurity } from '../contexts/SecurityContext';

interface SecureTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  maxLength?: number;
  showCharacterCount?: boolean;
  autoResize?: boolean;
  hint?: string;
  required?: boolean;
  successMessage?: string;
  showClearButton?: boolean;
}

export const SecureTextArea: React.FC<SecureTextAreaProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  initialEncryptedValue,
  onEncryptedChange,
  validateFn,
  className = '',
  rows = 4,
  maxLength,
  showCharacterCount = false,
  autoResize = false,
  hint,
  required = false,
  successMessage,
  disabled,
  showClearButton = false,
  placeholder,
  ...props
}) => {
  const { encrypt, decrypt, isInitialized } = useSecurity();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const decryptInitialValue = async () => {
      if (initialEncryptedValue && isInitialized) {
        try {
          const decrypted = await decrypt(initialEncryptedValue);
          setValue(decrypted);
          if (autoResize) adjustHeight();
        } catch (err) {
          setError('Failed to decrypt initial value');
          console.error('Decryption error:', err);
        }
      }
      setIsLoading(false);
    };

    decryptInitialValue();
  }, [initialEncryptedValue, decrypt, isInitialized]);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea && autoResize) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [autoResize]);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    if (maxLength && newValue.length > maxLength) return;
    
    setValue(newValue);

    if (autoResize) {
      adjustHeight();
    }

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
  }, [name, onEncryptedChange, validateFn, encrypt, isInitialized, maxLength, autoResize]);

  const handleClear = useCallback(() => {
    setValue('');
    if (onEncryptedChange) {
      onEncryptedChange(name, '');
    }
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [name, onEncryptedChange]);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight, value]);

  useEffect(() => {
    if (autoResize) {
      window.addEventListener('resize', adjustHeight);
      return () => window.removeEventListener('resize', adjustHeight);
    }
  }, [autoResize, adjustHeight]);

  if (isLoading) {
    return <div className="animate-pulse h-24 bg-gray-100 rounded" />;
  }

  const characterCount = value.length;
  const isAtLimit = maxLength && characterCount >= maxLength;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
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

      <div className="relative mt-1">
        <textarea
          ref={textareaRef}
          id={name}
          rows={rows}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`block w-full rounded-md shadow-sm
            resize-${autoResize ? 'none' : 'vertical'}
            focus:ring-blue-500 focus:border-blue-500 sm:text-sm
            ${error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'}
            ${disabled ? 'bg-gray-50 text-gray-500' : ''}
            ${isAtLimit ? 'border-yellow-300' : ''}
            ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${name}-error` : 
            showCharacterCount ? `${name}-count` :
            undefined
          }
          disabled={disabled}
          maxLength={maxLength}
          {...props}
        />

        {showClearButton && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 bottom-2 p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mt-1">
        {error && (
          <p className="text-sm text-red-600" id={`${name}-error`} role="alert">
            {error}
          </p>
        )}
        {!error && value && successMessage && (
          <p className="text-sm text-green-600">{successMessage}</p>
        )}
        {showCharacterCount && (
          <p 
            className={`text-xs ${
              isAtLimit ? 'text-yellow-600' : 'text-gray-500'
            }`}
            id={`${name}-count`}
          >
            {characterCount}{maxLength ? `/${maxLength}` : ''} characters
          </p>
        )}
      </div>
    </div>
  );
};

export default SecureTextArea;
