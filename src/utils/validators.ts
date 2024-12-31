// Common validation types
export type ValidationResult = string | null;
export type Validator = (value: any) => ValidationResult;

// HIPAA-specific validation rules
export const hipaaValidators = {
  // Enhanced SSN validation (###-##-####)
  ssn: (value: string): ValidationResult => {
    if (!value) return 'SSN is required';

    // Basic format check
    if (!/^\d{3}-\d{2}-\d{4}$/.test(value)) {
      return 'SSN must be in format: XXX-XX-XXXX';
    }

    // Split the SSN into groups for detailed validation
    const [area, group, serial] = value.split('-');

    // Validate area number (first three digits)
    if (area === '000' || area === '666' || /^9\d{2}$/.test(area)) {
      return 'Invalid SSN: First three digits cannot be 000, 666, or 9XX';
    }

    // Validate group number (middle two digits)
    if (group === '00') {
      return 'Invalid SSN: Middle two digits cannot be 00';
    }

    // Validate serial number (last four digits)
    if (serial === '0000') {
      return 'Invalid SSN: Last four digits cannot be 0000';
    }

    return null;
  },

  // Medical Record Number (MRN) validation
  mrn: (value: string): ValidationResult => {
    if (!value) return 'MRN is required';
    if (value.length < 6) return 'MRN must be at least 6 characters';
    return null;
  },

  // Date of Birth validation
  dob: (value: string): ValidationResult => {
    if (!value) return 'Date of Birth is required';
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date format';
    if (date > new Date()) return 'Date cannot be in the future';
    return null;
  },

  // Phone number validation
  phone: (value: string): ValidationResult => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!value) return 'Phone number is required';
    if (!phoneRegex.test(value)) return 'Invalid phone number format';
    return null;
  },

  // Email validation
  email: (value: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Invalid email format';
    return null;
  },

  // ZIP code validation
  zipCode: (value: string): ValidationResult => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!value) return 'ZIP code is required';
    if (!zipRegex.test(value)) return 'Invalid ZIP code format';
    return null;
  },

  // Name validation
  name: (value: string): ValidationResult => {
    if (!value) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s-']+$/.test(value)) return 'Name contains invalid characters';
    return null;
  },

  // Medical notes validation
  medicalNotes: (value: string): ValidationResult => {
    if (!value) return 'Notes are required';
    if (value.length < 10) return 'Notes must be at least 10 characters';
    return null;
  },

  // Insurance ID validation
  insuranceId: (value: string): ValidationResult => {
    if (!value) return 'Insurance ID is required';
    if (value.length < 6) return 'Insurance ID must be at least 6 characters';
    return null;
  },

  // Custom validation creator
  createRequired: (fieldName: string): Validator => {
    return (value: any): ValidationResult => {
      if (!value) return `${fieldName} is required`;
      return null;
    };
  },

  // Combined validators
  combine: (...validators: Validator[]): Validator => {
    return (value: any): ValidationResult => {
      for (const validator of validators) {
        const result = validator(value);
        if (result) return result;
      }
      return null;
    };
  }
};

// Form level validation
export interface FormValidationRules {
  [key: string]: {
    validator: Validator;
    required?: boolean;
    sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  };
}

export const validateForm = (values: Record<string, any>, rules: FormValidationRules): Record<string, string | null> => {
  const errors: Record<string, string | null> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = values[field];

    // Check required fields
    if (rule.required && !value) {
      errors[field] = `${field} is required`;
      continue;
    }

    // Run field validator
    const validationResult = rule.validator(value);
    if (validationResult) {
      errors[field] = validationResult;
    }
  }

  return errors;
};
