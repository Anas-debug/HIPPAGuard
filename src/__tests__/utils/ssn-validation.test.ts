import { hipaaValidators } from '../../utils/validators';

describe('SSN Validator', () => {
  const { ssn } = hipaaValidators;

  it('accepts valid SSN formats', () => {
    expect(ssn('123-45-6789')).toBeNull();
    expect(ssn('234-56-7890')).toBeNull();
  });

  it('rejects empty SSN', () => {
    expect(ssn('')).toBe('SSN is required');
  });

  it('rejects invalid SSN formats', () => {
    expect(ssn('123456789')).toBe('SSN must be in format: XXX-XX-XXXX');
    expect(ssn('12-34-5678')).toBe('SSN must be in format: XXX-XX-XXXX');
    expect(ssn('1234-56-789')).toBe('SSN must be in format: XXX-XX-XXXX');
  });

  it('rejects invalid area numbers', () => {
    expect(ssn('000-12-3456')).toBe('Invalid SSN: First three digits cannot be 000, 666, or 9XX');
    expect(ssn('666-12-3456')).toBe('Invalid SSN: First three digits cannot be 000, 666, or 9XX');
    expect(ssn('900-12-3456')).toBe('Invalid SSN: First three digits cannot be 000, 666, or 9XX');
    expect(ssn('999-12-3456')).toBe('Invalid SSN: First three digits cannot be 000, 666, or 9XX');
  });

  it('rejects invalid group numbers', () => {
    expect(ssn('123-00-4567')).toBe('Invalid SSN: Middle two digits cannot be 00');
  });

  it('rejects invalid serial numbers', () => {
    expect(ssn('123-45-0000')).toBe('Invalid SSN: Last four digits cannot be 0000');
  });
});
