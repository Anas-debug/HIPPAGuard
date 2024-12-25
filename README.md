# HippaGuard

🔒 Secure form handling with client-side encryption for React applications

[![npm version](https://badge.fury.io/js/@hippaguard%2Freact.svg)](https://badge.fury.io/js/@hippaguard%2Freact)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/badge/coverage-89%25-green.svg)](https://hippaguard.dev/coverage)

## Features

- 🔐 Client-side encryption for sensitive data
- 🏥 HIPAA-compliant form handling
- 🛡️ Built-in validation
- 🔄 React hooks for easy integration
- 📝 TypeScript support
- ✅ Comprehensive test coverage (89.34%)
- 🚀 Zero dependencies (except React)
- 🔍 Automatic data sanitization

## Installation

```bash
npm install @hippaguard/react
# or
yarn add @hippaguard/react
```

## Quick Start

```tsx
import { SecureForm, SecureField } from '@hippaguard/react';

function MyForm() {
  const handleSubmit = async (data) => {
    // Data is automatically encrypted
    console.log(data);
  };

  return (
    <SecureForm onSubmit={handleSubmit}>
      <SecureField
        name="patientName"
        label="Patient Name"
        sensitivityLevel="PHI"
        required
      />
      <SecureField
        name="ssn"
        label="Social Security Number"
        sensitivityLevel="PII"
        type="password"
        required
      />
      <button type="submit">Submit</button>
    </SecureForm>
  );
}
```

## Security Features

### Encryption
- AES-256-GCM encryption for all sensitive data
- Unique IV (Initialization Vector) for each encryption operation
- Key derivation using PBKDF2
- Automatic key destruction on component unmount

### Data Protection
- Zero storage of sensitive data in plain text
- Support for PHI (Protected Health Information)
- Support for PII (Personally Identifiable Information)
- HIPAA compliance ready
- Automatic form field validation

### Best Practices
- Secure data handling
- Input validation and sanitization
- Automatic cleanup of sensitive data
- No data persistence without explicit configuration

## Component API

### SecureField
```tsx
interface SecureFieldProps {
  name: string;              // Field identifier
  label: string;             // Field label
  sensitivityLevel?: 'PHI' | 'PII' | 'HIPAA' | 'NONE';  // Data sensitivity
  onChange?: (value: string) => void;  // Change handler
  validateFn?: (value: string) => string | null;  // Custom validation
  required?: boolean;        // Required field flag
  type?: 'text' | 'password' | 'email';  // Input type
}
```

### SecureForm
```tsx
interface SecureFormProps {
  children: React.ReactNode;  // Form children
  onSubmit: (data: Record<string, any>) => void | Promise<void>;  // Submit handler
  className?: string;        // Optional CSS class
}
```

### Security Provider
```tsx
import { SecurityProvider } from '@hippaguard/react';

function App() {
  return (
    <SecurityProvider>
      <YourApp />
    </SecurityProvider>
  );
}
```

## Validation Utilities

Built-in validators for common use cases:

```tsx
import { commonValidators, createValidator } from '@hippaguard/react';

// Single validator
const nameField = (
  <SecureField
    name="name"
    validateFn={commonValidators.required()}
  />
);

// Combined validators
const passwordField = (
  <SecureField
    name="password"
    validateFn={createValidator([
      commonValidators.required(),
      commonValidators.minLength(8),
      commonValidators.pattern(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        'Password must contain letters and numbers'
      )
    ])}
  />
);
```

## Context Hooks

### useForm
```tsx
const { state, updateField, resetForm } = useForm();
```

### useSecurity
```tsx
const { 
  securityCore,
  initialize,
  encrypt,
  decrypt,
  isInitialized 
} = useSecurity();
```

## Advanced Usage

### Custom Encryption Configuration
```tsx
import { SecurityCore } from '@hippaguard/react';

const customConfig = {
  encryptionAlgorithm: 'AES-256-GCM',
  ivLength: 12,
  saltLength: 16,
  iterations: 100000
};

const securityCore = new SecurityCore(customConfig);
```

### Form with Multiple Sensitivity Levels
```tsx
<SecureForm onSubmit={handleSubmit}>
  <SecureField
    name="publicInfo"
    label="Public Information"
    sensitivityLevel="NONE"
  />
  <SecureField
    name="ssn"
    label="SSN"
    sensitivityLevel="PII"
    type="password"
  />
  <SecureField
    name="diagnosis"
    label="Diagnosis"
    sensitivityLevel="PHI"
  />
</SecureForm>
```

## Performance Considerations

- Zero-dependency core (except React)
- Lazy initialization of cryptographic operations
- Automatic cleanup of sensitive data
- Optimized re-renders
- Efficient form state management

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development

1. Clone the repository
```bash
git clone https://github.com/anassaoui/hippaguard.git
```

2. Install dependencies
```bash
npm install
```

3. Run tests
```bash
npm test
```

4. Build
```bash
npm run build
```

## Testing

Current test coverage: 89.34%

- Unit tests for all components
- Integration tests for form workflows
- Security testing for encryption functions
- Validation testing
- Edge case coverage

## Author

Created and maintained by [Anas Saoui](https://github.com/anassaoui).

## License

MIT © Anas Saoui

## Support

For bugs and feature requests, please [open an issue](https://github.com/anassaoui/hippaguard/issues).

For security concerns, please email security@hippaguard.dev directly.