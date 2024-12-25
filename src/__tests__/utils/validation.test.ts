import { createValidator, commonValidators } from '../../utils/validation';

describe('Validation Utils', () => {
  describe('createValidator', () => {
    it('combines multiple validation rules', () => {
      const validator = createValidator([
        commonValidators.required(),
        commonValidators.minLength(3)
      ]);

      expect(validator('')).toBe('This field is required');
      expect(validator('ab')).toBe('Must be at least 3 characters');
      expect(validator('abc')).toBeNull();
    });
  });

  describe('commonValidators', () => {
    it('validates required fields', () => {
      const { validate } = commonValidators.required();
      expect(validate('')).toBe(false);
      expect(validate('  ')).toBe(false);
      expect(validate('test')).toBe(true);
    });

    it('validates email format', () => {
      const { validate } = commonValidators.email();
      expect(validate('invalid')).toBe(false);
      expect(validate('test@example.com')).toBe(true);
    });

    it('validates pattern matching', () => {
      const { validate } = commonValidators.pattern(/^\d+$/, 'Numbers only');
      expect(validate('abc')).toBe(false);
      expect(validate('123')).toBe(true);
    });
  });
});
