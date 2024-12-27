import React, { useState } from 'react';
import {
  SecureForm,
  SecureField,
  SecureSelect,
  SecureTextArea,
  SecureCheckbox,
  SecureRadioGroup,
} from '../../src/components';
import { SecurityProvider } from '../../src/contexts/SecurityContext';

const ComponentShowcase = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleEncryptedChange = (name: string, encryptedValue: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: encryptedValue
    }));
    console.log(`${name} changed:`, encryptedValue);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          HIPPAGuard Component Showcase
        </h1>

        <div className="space-y-12">
          {/* SecureField Showcase */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              SecureField Component
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Standard Text Input</h3>
                <SecureField
                  name="standardText"
                  label="Standard Field"
                  onEncryptedChange={handleEncryptedChange}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">PII Field</h3>
                <SecureField
                  name="piiField"
                  label="Social Security Number"
                  sensitivityLevel="PII"
                  onEncryptedChange={handleEncryptedChange}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">PHI Field</h3>
                <SecureField
                  name="phiField"
                  label="Medical ID"
                  sensitivityLevel="PHI"
                  onEncryptedChange={handleEncryptedChange}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">With Validation</h3>
                <SecureField
                  name="validatedField"
                  label="Required Field"
                  validateFn={(value) => !value ? 'This field is required' : null}
                  onEncryptedChange={handleEncryptedChange}
                />
              </div>
            </div>
          </section>

          {/* SecureSelect Showcase */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              SecureSelect Component
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Basic Select</h3>
                <SecureSelect
                  name="basicSelect"
                  label="Select Option"
                  options={['Option 1', 'Option 2', 'Option 3']}
                  onEncryptedChange={handleEncryptedChange}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">With Custom Options</h3>
                <SecureSelect
                  name="customSelect"
                  label="Select with Labels"
                  sensitivityLevel="PHI"
                  options={[
                    { value: '1', label: 'First Option' },
                    { value: '2', label: 'Second Option' },
                    { value: '3', label: 'Third Option' }
                  ]}
                  onEncryptedChange={handleEncryptedChange}
                />
              </div>
            </div>
          </section>

          {/* SecureTextArea Showcase */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              SecureTextArea Component
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Standard TextArea</h3>
                <SecureTextArea
                  name="standardTextArea"
                  label="Comments"
                  rows={4}
                  onEncryptedChange={handleEncryptedChange}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">PHI TextArea</h3>
                <SecureTextArea
                  name="phiTextArea"
                  label="Medical Notes"
                  sensitivityLevel="PHI"
                  rows={4}
                  onEncryptedChange={handleEncryptedChange}
                />
              </div>
            </div>
          </section>

          {/* SecureCheckbox Showcase */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              SecureCheckbox Component
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Standard Checkbox</h3>
                <SecureCheckbox
                  name="standardCheckbox"
                  label="I agree to terms"
                  onEncryptedChange={handleEncryptedChange}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">PHI Checkbox</h3>
                <SecureCheckbox
                  name="phiCheckbox"
                  label="I have allergies"
                  sensitivityLevel="PHI"
                  onEncryptedChange={handleEncryptedChange}
                />
              </div>
            </div>
          </section>

          {/* SecureRadioGroup Showcase */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              SecureRadioGroup Component
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Standard Radio Group</h3>
                <SecureRadioGroup
                  name="standardRadio"
                  label="Select One Option"
                  options={['Option A', 'Option B', 'Option C']}
                  onEncryptedChange={handleEncryptedChange}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">PHI Radio Group</h3>
                <SecureRadioGroup
                  name="phiRadio"
                  label="Medical History"
                  sensitivityLevel="PHI"
                  options={[
                    { value: 'none', label: 'No Previous Conditions' },
                    { value: 'mild', label: 'Mild Conditions' },
                    { value: 'severe', label: 'Severe Conditions' }
                  ]}
                  onEncryptedChange={handleEncryptedChange}
                />
              </div>
            </div>
          </section>

          {/* Form Data Display */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Encrypted Form Data
            </h2>
            <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
};

// Wrap with SecurityProvider
const App = () => (
  <SecurityProvider>
    <ComponentShowcase />
  </SecurityProvider>
);

export default App;
