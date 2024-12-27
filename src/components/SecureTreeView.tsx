import React, { useState, useCallback } from 'react';

interface TreeItem {
  id: string;
  label: string;
  children?: TreeItem[];
}

interface SecureTreeViewProps {
  name: string;
  label: string;
  data: TreeItem[];
  sensitivityLevel?: 'PHI' | 'PII' | 'standard';
  initialEncryptedValue?: string;
  onEncryptedChange?: (name: string, encryptedValue: string) => void;
  validateFn?: (value: string) => string | null;
  className?: string;
}

const SecureTreeView: React.FC<SecureTreeViewProps> = ({
  name,
  label,
  data,
  sensitivityLevel = 'standard',
  onEncryptedChange,
  validateFn,
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemSelect = useCallback((itemId: string) => {
    const newSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];

    setSelectedItems(newSelectedItems);

    // Validation
    if (validateFn) {
      const validationError = validateFn(newSelectedItems.join(','));
      setError(validationError);
      if (validationError) return;
    }

    // Encrypt and send
    onEncryptedChange?.(name, JSON.stringify(newSelectedItems));
  }, [name, onEncryptedChange, validateFn, selectedItems]);

  const renderTreeItems = (items: TreeItem[], level = 0) => {
    return items.map(item => (
      <div key={item.id} className={`pl-${level * 4}`}>
        <div className="flex items-center">
          {item.children && (
            <button 
              type="button"
              onClick={() => toggleExpand(item.id)}
              className="mr-2 text-gray-500 focus:outline-none"
            >
              {expandedItems.includes(item.id) ? '▼' : '▶'}
            </button>
          )}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => handleItemSelect(item.id)}
              className="form-checkbox"
            />
            <span>{item.label}</span>
          </label>
        </div>
        {item.children && expandedItems.includes(item.id) && (
          <div className="pl-4">
            {renderTreeItems(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
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

      <div 
        className={`border rounded-md p-4 ${className} 
          ${error ? 'border-red-300' : 'border-gray-300'}`}
      >
        {renderTreeItems(data)}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecureTreeView;
