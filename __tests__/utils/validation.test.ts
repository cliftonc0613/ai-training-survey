import {
  validateName,
  validateEmail,
  validatePhone,
  formatPhone,
  validateUserRegistration,
} from '@/lib/utils/validation';

describe('validateName', () => {
  it('should accept valid names', () => {
    expect(validateName('John Doe')).toEqual({ isValid: true });
    expect(validateName("O'Brien")).toEqual({ isValid: true });
    expect(validateName('Mary-Jane')).toEqual({ isValid: true });
    expect(validateName('José García')).toEqual({ isValid: true });
  });

  it('should reject empty or whitespace-only names', () => {
    expect(validateName('')).toEqual({
      isValid: false,
      error: 'Name is required',
    });
    expect(validateName('   ')).toEqual({
      isValid: false,
      error: 'Name is required',
    });
  });

  it('should reject names that are too short', () => {
    expect(validateName('A')).toEqual({
      isValid: false,
      error: 'Name must be at least 2 characters long',
    });
  });

  it('should reject names that are too long', () => {
    const longName = 'A'.repeat(51);
    expect(validateName(longName)).toEqual({
      isValid: false,
      error: 'Name must not exceed 50 characters',
    });
  });

  it('should reject names with invalid characters', () => {
    expect(validateName('John123')).toEqual({
      isValid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    });
    expect(validateName('John@Doe')).toEqual({
      isValid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    });
  });
});

describe('validateEmail', () => {
  it('should accept valid email addresses', () => {
    expect(validateEmail('user@example.com')).toEqual({ isValid: true });
    expect(validateEmail('john.doe+tag@example.co.uk')).toEqual({ isValid: true });
    expect(validateEmail('user123@test-domain.org')).toEqual({ isValid: true });
  });

  it('should reject empty emails', () => {
    expect(validateEmail('')).toEqual({
      isValid: false,
      error: 'Email is required',
    });
    expect(validateEmail('   ')).toEqual({
      isValid: false,
      error: 'Email is required',
    });
  });

  it('should reject invalid email formats', () => {
    expect(validateEmail('notanemail')).toEqual({
      isValid: false,
      error: 'Please enter a valid email address',
    });
    expect(validateEmail('user@')).toEqual({
      isValid: false,
      error: 'Please enter a valid email address',
    });
    expect(validateEmail('@nodomain.com')).toEqual({
      isValid: false,
      error: 'Please enter a valid email address',
    });
    expect(validateEmail('double@@example.com')).toEqual({
      isValid: false,
      error: 'Please enter a valid email address',
    });
  });

  it('should reject emails that are too long', () => {
    const longLocal = 'a'.repeat(250);
    expect(validateEmail(`${longLocal}@example.com`)).toEqual({
      isValid: false,
      error: 'Email address is too long',
    });
  });

  it('should handle case-insensitive emails', () => {
    expect(validateEmail('User@EXAMPLE.COM')).toEqual({ isValid: true });
  });
});

describe('validatePhone', () => {
  it('should accept valid US phone numbers', () => {
    expect(validatePhone('1234567890')).toEqual({ isValid: true });
    expect(validatePhone('(123) 456-7890')).toEqual({ isValid: true });
    expect(validatePhone('123-456-7890')).toEqual({ isValid: true });
    expect(validatePhone('123.456.7890')).toEqual({ isValid: true });
  });

  it('should accept international phone numbers', () => {
    expect(validatePhone('+1 123 456 7890')).toEqual({ isValid: true });
    expect(validatePhone('+44 20 1234 5678')).toEqual({ isValid: true });
  });

  it('should reject empty phone numbers', () => {
    expect(validatePhone('')).toEqual({
      isValid: false,
      error: 'Phone number is required',
    });
    expect(validatePhone('   ')).toEqual({
      isValid: false,
      error: 'Phone number is required',
    });
  });

  it('should reject phone numbers that are too short', () => {
    expect(validatePhone('123456')).toEqual({
      isValid: false,
      error: 'Phone number must be at least 10 digits',
    });
  });

  it('should reject phone numbers that are too long', () => {
    expect(validatePhone('12345678901234567890')).toEqual({
      isValid: false,
      error: 'Phone number is too long',
    });
  });
});

describe('formatPhone', () => {
  it('should format 10-digit US phone numbers', () => {
    expect(formatPhone('1234567890')).toBe('(123) 456-7890');
    expect(formatPhone('123-456-7890')).toBe('(123) 456-7890');
  });

  it('should format 11-digit numbers starting with 1', () => {
    expect(formatPhone('11234567890')).toBe('+1 (123) 456-7890');
  });

  it('should preserve international format', () => {
    expect(formatPhone('+44 20 1234 5678')).toBe('+44 20 1234 5678');
  });

  it('should return original if format is unrecognized', () => {
    expect(formatPhone('123')).toBe('123');
  });
});

describe('validateUserRegistration', () => {
  it('should validate all fields successfully', () => {
    const result = validateUserRegistration({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should collect all validation errors', () => {
    const result = validateUserRegistration({
      name: '',
      email: 'invalid-email',
      phone: '123',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('phone');
  });

  it('should validate individual field errors correctly', () => {
    const result = validateUserRegistration({
      name: 'John Doe',
      email: 'invalid',
      phone: '1234567890',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Please enter a valid email address');
    expect(result.errors).not.toHaveProperty('name');
    expect(result.errors).not.toHaveProperty('phone');
  });
});
