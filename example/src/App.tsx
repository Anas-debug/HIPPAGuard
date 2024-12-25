import React from 'react';
import { SecureField } from '../../src/components/SecureField';

const App = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">HIPAAGuard Demo</h1>
      
      <div className="max-w-md mx-auto mt-6">
        <SecureField
          name="name"
          label="Patient Name"
          sensitivityLevel="PII"
          required
        />
      </div>

      <div className="mt-4 text-gray-600">
        {/* Debug section */}
        <p>Component loaded successfully</p>
      </div>
    </div>
  );
};

export default App;
