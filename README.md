# HIPPAGuard 🔒

Secure form handling with client-side encryption for React applications - HIPAA-compliant form components with built-in security.

[![npm version](https://badge.fury.io/js/@hippaguard%2Freact.svg)](https://badge.fury.io/js/@hippaguard%2Freact)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/badge/coverage-87%25-green.svg)](https://github.com/Anas-debug/HIPPAGuard)

![HIPPAGuard Logo](assets/logo.svg)

## Overview

HIPPAGuard provides secure form components for handling sensitive healthcare data in React applications. It includes built-in encryption, data protection, and HIPAA compliance features.

## Key Features

- 🔒 Client-side AES-256-GCM encryption
- ⚕ HIPAA & PHI/PII data protection 
- 🛡 Form validation & sanitization
- 🔄 Simple React hooks API
- 📝 Full TypeScript support
- ✅ Extensive test coverage
- 🚀 Lightweight with minimal dependencies
- 💪 Built for production use

## Getting Started

### Installation

bash
npm install @hippaguard/react


### Basic Usage

tsx
import { SecureForm, SecureField } from '@hippaguard/react';

function PatientForm() {
  const handleSubmit = async (data) => {
    // Data is automatically encrypted
    console.log('Encrypted form data:', data);
  };

  return (
    <SecureForm onSubmit={handleSubmit}>
      <SecureField
        name="firstName" 
        label="First Name"
        required
        sensitivityLevel="PHI"
      />
      
      <SecureTextArea
        name="symptoms"
        label="Current Symptoms" 
        sensitivityLevel="PHI"
      />

      <SecureSelect
        name="insurance"
        label="Insurance Provider"
        options={insuranceOptions}
        sensitivityLevel="PHI"
      />

      <button type="submit">
        Submit
      </button>
    </SecureForm>
  );
}


## Core Components

### SecureField
Standard input field with encryption and validation.

tsx
<SecureField
  name="ssn"
  label="Social Security Number" 
  type="text"
  sensitivityLevel="PII"
  validateFn={validateSSN}
  required
/>


### SecureSelect 
Encrypted select/dropdown component.

tsx
<SecureSelect
  name="provider"
  label="Insurance Provider"
  options={[
    { value: 'aetna', label: 'Aetna' },
    { value: 'cigna', label: 'Cigna' }
  ]}
  sensitivityLevel="PHI"
/>


### SecureTextArea
Multiline text input with encryption.

tsx
<SecureTextArea
  name="notes"
  label="Medical Notes"
  rows={4}
  sensitivityLevel="PHI" 
/>


### SecureCheckbox
Secure checkbox component.

tsx
<SecureCheckbox
  name="consent"
  label="I consent to treatment"
  sensitivityLevel="PHI"
/>


### SecureRadioGroup
Radio button group with encryption.

tsx
<SecureRadioGroup
  name="gender"
  label="Gender"
  options={['Male', 'Female', 'Other']}
  sensitivityLevel="PHI"
/>


## Security Features

- 🔐 AES-256-GCM encryption
- 🔑 Unique IV per encryption
- 🛡 PBKDF2 key derivation
- 🧹 Auto key cleanup
- 🔒 Zero plaintext storage
- ✅ Input sanitization 

## Validation

Built-in validation helpers:

tsx
import { validators } from '@hippaguard/react';

<SecureField
  name="email"
  validateFn={validators.combine([
    validators.required(),
    validators.email()
  ])}
/>


## Context & Hooks

### SecurityProvider
Provides encryption context.

tsx
import { SecurityProvider } from '@hippaguard/react';

function App() {
  return (
    <SecurityProvider>
      <YourApp />
    </SecurityProvider>
  );
}


### useSecurity
Access encryption functions.

tsx
const { encrypt, decrypt } = useSecurity();


## Contributing

We welcome contributions! Please check our [Contributing Guide](CONTRIBUTING.md).

### Development

1. Clone repo
bash
git clone https://github.com/Anas-debug/HIPPAGuard.git


2. Install dependencies
bash
npm install


3. Run tests
bash
npm test


### Testing
Coverage: ~87%
- Unit tests
- Integration tests  
- Security tests
- Edge cases

## Support

- 📝 [Documentation](https://github.com/Anas-debug/HIPPAGuard)
- 🐛 [Issues](https://github.com/Anas-debug/HIPPAGuard/issues)
- ✉ [Email](mailto:security@hippaguard.dev)

## License

[MIT](LICENSE) © [Anas Saoui](https://github.com/Anas-debug)
