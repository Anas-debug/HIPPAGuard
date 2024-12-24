import React, { useState, useCallback } from 'react';
import { SecureField } from './SecureField';

interface SecureFormProps {
  onSubmit: (encryptedData: Record<string, string>) => void;
  children: React.ReactNode;
  className?: string;
}

export const SecureForm: React.FC<SecureFormProps> = ({
  onSubmit,
  children,
  className = ''
}) => {
  const [encryptedValues, setEncryptedValues] = useState<Record<string, string>>({});

  // Handle encrypted field changes
  const handleEncryptedChange = useCallback((name: string, encryptedValue: string) => {
    setEncryptedValues(prev => ({
      ...prev,
      [name]: encryptedValue
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(encryptedValues);
  }, [onSubmit, encryptedValues]);

  // Clone children to pass encrypted change handler
  const formChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && 'name' in child.props) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onEncryptedChange: handleEncryptedChange
      });
    }
    return child;
  });

  return (
    <form 
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
    >
      {formChildren}
    </form>
  );
};

// Example usage component
export const PatientForm: React.FC = () => {
  const handleSubmit = async (encryptedData: Record<string, string>) => {
    console.log('Encrypted form data:', encryptedData);
  };

  return (
    <SecureForm 
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6"
    >
      <SecureField
        name="firstName"
        label="First Name"
        sensitivityLevel="PII"
        required
      />
      <SecureField
        name="lastName"
        label="Last Name"
        sensitivityLevel="PII"
        required
      />
      <SecureField
        name="ssn"
        label="Social Security Number"
        sensitivityLevel="PHI"
        type="password"
        required
      />
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Save Patient Information
      </button>
    </SecureForm>
  );
};
