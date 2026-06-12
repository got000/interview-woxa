export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

export const PASSWORD_MIN_LENGTH = 8;

export function hasMinLength(value: string): boolean {
  return value.length >= PASSWORD_MIN_LENGTH;
}

export function hasLetter(value: string): boolean {
  return /[A-Za-z]/.test(value);
}

export function hasNumber(value: string): boolean {
  return /\d/.test(value);
}

export function isValidPassword(value: string): boolean {
  return hasMinLength(value) && hasLetter(value) && hasNumber(value);
}
