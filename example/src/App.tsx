import React from 'react';
import {
  SecureField,
  SecureSelect,
  SecureForm,
  SecureCheckbox,
  SecureRadioGroup,
  SecureTextArea,
} from '../../src/components';

const App = () => {
  const handleEncryptedSubmit = (encryptedData: Record<string, string>) => {
    console.log('Encrypted form data:', encryptedData);
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(value) ? null : 'Invalid email address';
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">HIPAAGuard Demo</h1>
      <div className="max-w-md mx-auto mt-6">
        <SecureForm onEncryptedSubmit={handleEncryptedSubmit}>
          <SecureField
            name="name"
            label="Patient Name"
            sensitivityLevel="PII"
            required
          />
          <SecureField
            name="email"
            label="Email Address"
            type="email"
            sensitivityLevel="PII"
            required
            validateFn={validateEmail}
            className="mt-4"
          />
          <SecureSelect
            name="gender"
            label="Gender"
            options={['Male', 'Female', 'Other']}
            sensitivityLevel="PII"
            required
            className="mt-4"
          />
          <SecureRadioGroup
            name="age_group"
            label="Age Group"
            options={['Under 18', '18-64', '65+']}
            sensitivityLevel="PII"
            required
            className="mt-4"
          />
          <SecureCheckbox
            name="terms"
            label="I agree to the terms and conditions"
            sensitivityLevel="standard"
            required
            className="mt-4"
          />
          <SecureTextArea
            name="medical_history"
            label="Medical History"
            sensitivityLevel="PHI"
            rows={4}
            className="mt-4"
          />
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded"
          >
            Submit
          </button>
        </SecureForm>
      </div>
    </div>
  );
};

export default App;
