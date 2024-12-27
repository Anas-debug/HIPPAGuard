import React, { useState, useEffect } from 'react';
import {
  SecureForm,
  SecureField,
  SecureSelect,
  SecureTextArea,
  SecureCheckbox,
  SecureRadioGroup,
} from '../../src/components';
import { SecurityProvider, useSecurity } from '../../src/contexts/SecurityContext';

const ComponentShowcase = () => {
  const { initialize, isInitialized } = useSecurity();
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isInitialized) {
      initialize('temp-master-key');
    }
  }, [initialize, isInitialized]);

  const handleEncryptedChange = (name: string, encryptedValue: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: encryptedValue
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-xl shadow-lg mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="p-4">
              <path d="M12 2L3 7v10c0 5 9 8 9 8s9-3 9-8V7l-9-5zm7 14.59c0 3.16-5.87 5.41-7 5.41s-7-2.25-7-5.41V8.41L12 4.41l7 4v8.18z"/>
              <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Medicare Benefits Component Showcase
          </h1>
          <p className="text-gray-600 max-w-2xl text-center">
            Secure form handling with client-side encryption for Medicare enrollment and benefits
          </p>
        </div>

        {/* Component Grid */}
        <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
          {/* Text Inputs */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-4">
              Personal Information
            </h2>
            <div className="space-y-6">
              <SecureField
                name="medicareNumber"
                label="Medicare Number"
                placeholder="Enter Medicare Number"
                onEncryptedChange={handleEncryptedChange}
              />
              <SecureField
                name="socialSecurity"
                label="Social Security Number"
                sensitivityLevel="PII"
                placeholder="XXX-XX-XXXX"
                onEncryptedChange={handleEncryptedChange}
              />
              <SecureField
                name="medicareCardHolderName"
                label="Medicare Card Holder Name"
                sensitivityLevel="PHI"
                placeholder="Full Name as on Medicare Card"
                onEncryptedChange={handleEncryptedChange}
              />
            </div>
          </div>

          {/* Selection Components */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-4">
              Medicare Plan Details
            </h2>
            <SecureSelect
              name="medicareType"
              label="Medicare Plan Type"
              sensitivityLevel="PHI"
              options={[
                { value: '', label: 'Select Medicare Plan' },
                { value: 'partA', label: 'Medicare Part A (Hospital)' },
                { value: 'partB', label: 'Medicare Part B (Medical)' },
                { value: 'partC', label: 'Medicare Part C (Medicare Advantage)' },
                { value: 'partD', label: 'Medicare Part D (Prescription Drug)' },
              ]}
              onEncryptedChange={handleEncryptedChange}
            />
            <SecureRadioGroup
              name="enrollmentStatus"
              label="Enrollment Status"
              sensitivityLevel="PHI"
              options={[
                { value: 'initial', label: 'Initial Enrollment' },
                { value: 'special', label: 'Special Enrollment Period' },
                { value: 'annual', label: 'Annual Enrollment' },
              ]}
              onEncryptedChange={handleEncryptedChange}
            />
          </div>

          {/* Text Area */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-4">
              Additional Medical Information
            </h2>
            <SecureTextArea
              name="medicalHistory"
              label="Relevant Medical History"
              sensitivityLevel="PHI"
              placeholder="Provide relevant medical history for Medicare enrollment..."
              rows={6}
              onEncryptedChange={handleEncryptedChange}
            />
          </div>

          {/* Checkboxes */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-4">
              Consent and Authorization
            </h2>
            <div className="space-y-4">
              <SecureCheckbox
                name="privacyConsent"
                label="I acknowledge the Medicare Privacy Notice"
                onEncryptedChange={handleEncryptedChange}
              />
              <SecureCheckbox
                name="dataSharing"
                label="I consent to share medical information for enrollment"
                sensitivityLevel="PHI"
                onEncryptedChange={handleEncryptedChange}
              />
            </div>
          </div>
        </div>

        {/* Form Data */}
        <div className="mt-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 mb-4">
              Encrypted Medicare Enrollment Data
            </h2>
            <pre className="bg-slate-50 p-4 rounded-lg overflow-auto max-h-72 text-sm">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <SecurityProvider>
    <ComponentShowcase />
  </SecurityProvider>
);

export default App;