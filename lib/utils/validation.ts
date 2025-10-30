// Validation utilities for user input

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a name (first name, last name, or full name)
 * Rules: 2-50 characters, letters, spaces, hyphens, and apostrophes only
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Name must not exceed 50 characters' };
  }

  // Allow letters (a-zA-Z), spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  return { isValid: true };
}

/**
 * Validates an email address
 * Uses a comprehensive RFC 5322 compliant regex pattern
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // RFC 5322 compliant email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }

  return { isValid: true };
}

/**
 * Validates a phone number
 * Supports various formats: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Phone number is required' };
  }

  const trimmedPhone = phone.trim();

  // Remove all non-digit characters except +
  const digitsOnly = trimmedPhone.replace(/[^\d+]/g, '');

  // Check for minimum length (10 digits for US, allow + for international)
  const minLength = digitsOnly.startsWith('+') ? 11 : 10;
  const maxLength = 15; // International standard

  if (digitsOnly.length < minLength) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }

  if (digitsOnly.length > maxLength) {
    return { isValid: false, error: 'Phone number is too long' };
  }

  // Common phone number patterns
  const phoneRegex =
    /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;

  if (!phoneRegex.test(trimmedPhone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  return { isValid: true };
}

/**
 * Formats a phone number to a consistent format
 * Example: 1234567890 -> (123) 456-7890
 */
export function formatPhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');

  // Handle international numbers (just return as-is with + prefix)
  if (phone.startsWith('+')) {
    return phone;
  }

  // Format US/Canada numbers
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }

  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }

  return phone; // Return original if format is unrecognized
}

/**
 * Validates all user registration fields
 */
export function validateUserRegistration(data: {
  name: string;
  email: string;
  phone: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid && nameValidation.error) {
    errors.name = nameValidation.error;
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid && emailValidation.error) {
    errors.email = emailValidation.error;
  }

  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.isValid && phoneValidation.error) {
    errors.phone = phoneValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
