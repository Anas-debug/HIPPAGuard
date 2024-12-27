import React from 'react';

interface SecureFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  children: React.ReactNode;
}

export const SecureForm: React.FC<SecureFormProps> = ({
  onSubmit,
  className = '',
  children,
  ...props
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`space-y-6 ${className}`}
      {...props}
    >
      {children}
    </form>
  );
};

export default SecureForm;
