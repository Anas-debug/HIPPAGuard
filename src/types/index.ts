export type SensitivityLevel = 'PHI' | 'PII' | 'HIPAA' | 'NONE';

export interface FormField {
  name: string;
  value: string;
  sensitivityLevel?: SensitivityLevel;
  isValid: boolean;
  error?: string;
}

export interface FormState {
  fields: Record<string, FormField>;
  isValid: boolean;
  isSubmitting: boolean;
}

export interface SecureFieldProps {
  name: string;
  label: string;
  sensitivityLevel?: SensitivityLevel;
  onChange?: (value: string) => void;
  validateFn?: (value: string) => string | null;
  required?: boolean;
  type?: 'text' | 'password' | 'email';
}

export interface SecureFormProps {
  children: React.ReactNode;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  className?: string;
}
