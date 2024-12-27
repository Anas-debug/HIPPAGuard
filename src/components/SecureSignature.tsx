import React, { useState, useCallback, useRef } from 'react';

interface SecureSignatureProps {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  className?: string;
  width?: number;
  height?: number;
}

const SecureSignature: React.FC<SecureSignatureProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  onEncryptedChange,
  validateFn,
  className = '',
  width = 400,
  height = 200,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);

    // Convert signature to base64
    const signatureImage = canvas.toDataURL();
    setSignatureData(signatureImage);

    // Validation
    if (validateFn) {
      const validationError = validateFn(signatureImage);
      setError(validationError);
      if (validationError) return;
    }

    // Encrypt and send
    onEncryptedChange?.(name, signatureImage);
  }, [name, onEncryptedChange, validateFn]);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

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

      <div className="space-y-2">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className={`border rounded-md ${
            error ? 'border-red-300' : 'border-gray-300'
          } ${className}`}
          style={{ cursor: 'crosshair' }}
        />

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={clearSignature}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecureSignature;
