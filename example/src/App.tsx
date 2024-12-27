import React from 'react';
import { 
  SecureField, 
  SecureSelect, 
  SecureForm, 
  SecureTextArea 
} from '../../src/components';

const App = () => {
  const handleSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' }
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">HIPAAGuard Demo</h1>

      <SecureForm onSubmit={handleSubmit}>
        <div className="space-y-4">
          <SecureField 
            name="name" 
            label="Name" 
            sensitivityLevel="PII" 
            required 
          />
          
          <SecureSelect
            name="role"
            label="Role"
            options={roleOptions}
            sensitivityLevel="PII"
          />
          
          <SecureTextArea 
            name="notes" 
            label="Medical Notes" 
            sensitivityLevel="PHI" 
            rows={4}
          />

          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </SecureForm>
    </div>
  );
};

export default App;
