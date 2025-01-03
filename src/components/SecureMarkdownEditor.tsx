import React, { useState, useCallback } from 'react';
import { marked } from 'marked'; // Corrected import
import DOMPurify from 'dompurify';

interface SecureMarkdownEditorProps {
  name: string;
  label: string;
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  className?: string;
  rows?: number;
}

const SecureMarkdownEditor: React.FC<SecureMarkdownEditorProps> = ({
  name,
  label,
  sensitivityLevel = 'standard',
  onEncryptedChange,
  validateFn,
  className = '',
  rows = 6,
}) => {
  const [markdown, setMarkdown] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newMarkdown = e.target.value;
      setMarkdown(newMarkdown);

      // Validation
      if (validateFn) {
        const validationError = validateFn(newMarkdown);
        setError(validationError);
        if (validationError) return;
      } else {
        setError(null); // Clear error if validation passes
      }

      // Encrypt and send
      onEncryptedChange?.(name, newMarkdown);
    },
    [name, onEncryptedChange, validateFn]
  );

  const sanitizedHTML = DOMPurify.sanitize(marked(markdown));

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {sensitivityLevel !== 'standard' && (
          <span
            className={`ml-2 text-xs ${
              sensitivityLevel === 'PHI' ? 'text-red-500' : 'text-yellow-500'
            }`}
          >
            ({sensitivityLevel})
          </span>
        )}
      </label>

      <div className="flex items-center space-x-2 mb-2">
        <button
          type="button"
          onClick={() => setPreviewMode(false)}
          className={`px-2 py-1 rounded ${
            !previewMode ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setPreviewMode(true)}
          className={`px-2 py-1 rounded ${
            previewMode ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Preview
        </button>
      </div>

      {!previewMode ? (
        <textarea
          id={name}
          name={name}
          value={markdown}
          onChange={handleChange}
          rows={rows}
          placeholder="Write markdown here..."
          className={`block w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500 sm:text-sm
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${className}`}
        />
      ) : (
        <div
          className={`w-full rounded-md border p-3 min-h-[150px]
            ${error ? 'border-red-300' : 'border-gray-300'}`}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecureMarkdownEditor;
