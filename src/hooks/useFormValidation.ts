import { useState, useCallback } from 'react';
import { FormValidationRules, validateForm } from '../utils/validators';

interface UseFormValidationProps {
  initialValues: Record<string, any>;
  validationRules: FormValidationRules;
  onSubmit: (values: Record<string, any>, encryptedValues: Record<string, string>) => void;
}

export const useFormValidation = ({
  initialValues,
  validationRules,
  onSubmit
}: UseFormValidationProps) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [encryptedValues, setEncryptedValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    const fieldRule = validationRules[name];
    if (fieldRule) {
      const fieldError = fieldRule.validator(value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  }, [validationRules]);

  const handleEncryptedChange = useCallback((name: string, encryptedValue: string) => {
    setEncryptedValues(prev => ({
      ...prev,
      [name]: encryptedValue
    }));
  }, []);

  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const fieldRule = validationRules[name];
    if (fieldRule) {
      const fieldError = fieldRule.validator(values[name]);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  }, [validationRules, values]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const validationErrors = validateForm(values, validationRules);
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(error => error !== null)) {
      return false;
    }

    onSubmit(values, encryptedValues);
    return true;
  }, [values, encryptedValues, validationRules, onSubmit]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleEncryptedChange,
    isValid: Object.values(errors).every(error => !error),
  };
};
