import React, { useState, useCallback, useRef } from 'react';
import SignaturePad from 'react-signature-canvas';

interface SecureSignatureProps {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
}

export const SecureSignature: React.FC<SecureSignatureProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  // initialEncryptedValue,
  // onEncryptedChange,
  ...props
}) => {
  // Ref for signature pad
  const signaturePadRef = useRef<SignaturePad>(null);

  // Handle signature changes
  const handleChange = useCallback(() => {
    const signatureData = signaturePadRef.current?.toData();

    // Encryption and decryption logic would go here
  }, [name]);

  // Handle clear signature
  const handleClear = useCallback(() => {
    signaturePadRef.current?.clear();
    handleChange();
  }, [handleChange]);

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

      <div className="border border-gray-300 rounded-md p-4">
        <SignaturePad
          ref={signaturePadRef}
          canvasProps={{ className: 'w-full h-40 border-2 border-dashed border-gray-300 rounded-md' }}
          onEnd={handleChange}
          {...props}
        />
      </div>

      <button
        type="button"
        onClick={handleClear}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
      >
        Clear Signature
      </button>
    </div>
  );
};
