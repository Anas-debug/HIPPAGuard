import React, { FormEvent } from 'react';

interface SecureFormProps {
  children: React.ReactNode;
  onSubmit: (encryptedData: Record<string, string>) => void;
  className?: string;
}

const SecureForm: React.FC<SecureFormProps> = ({ children, onSubmit, className = '' }) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const encryptedData: Record<string, string> = {};

    formData.forEach((value, key) => {
      encryptedData[key] = value.toString(); // Replace this with actual encryption logic if needed
    });

    onSubmit(encryptedData);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

export default SecureForm;
