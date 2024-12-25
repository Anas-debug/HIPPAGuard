export type ValidationRule = {
  validate: (value: string) => boolean;
  message: string;
};

export const createValidator = (rules: ValidationRule[]) => {
  return (value: string): string | null => {
    for (const rule of rules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
    return null;
  };
};

export const commonValidators = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value: string) => value.trim().length > 0,
    message,
  }),
  minLength: (length: number, message?: string): ValidationRule => ({
    validate: (value: string) => value.length >= length,
    message: message || `Must be at least ${length} characters`,
  }),
  maxLength: (length: number, message?: string): ValidationRule => ({
    validate: (value: string) => value.length <= length,
    message: message || `Must be no more than ${length} characters`,
  }),
  email: (message = 'Invalid email address'): ValidationRule => ({
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),
  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value: string) => regex.test(value),
    message,
  }),
};
