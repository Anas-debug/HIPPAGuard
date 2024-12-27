import React, { useState, useCallback } from 'react';

interface SecureImageUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
}

export const SecureImageUpload: React.FC<SecureImageUploadProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  // onEncryptedChange,
  className = '',
  ...props
}) => {
  // State for selected image
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Handle image change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Encryption logic would go here
    }
  }, [name]);

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

      <div className="flex items-center space-x-4">
        <label
          htmlFor={name}
          className={`flex flex-col items-center justify-center w-24 h-24 rounded-md border-2 border-dashed border-gray-300
            cursor-pointer hover:bg-gray-50 ${className}`}
        >
          <span className="text-sm text-gray-500">Upload Image</span>
          <input
            type="file"
            id={name}
            accept="image/*"
            onChange={handleChange}
            className="sr-only"
            {...props}
          />
        </label>

        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            className="w-24 h-24 rounded-md object-cover"
          />
        )}
      </div>
    </div>
  );
};
