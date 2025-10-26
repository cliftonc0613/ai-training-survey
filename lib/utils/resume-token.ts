// Resume token generator for quiz session recovery

/**
 * Generates a unique resume token for user sessions
 * Format: 8 characters (timestamp-based) + 8 characters (random)
 * Example: AB12CD34-XY98ZW76
 */
export function generateResumeToken(): string {
  const timestamp = Date.now().toString(36).toUpperCase(); // Base-36 timestamp
  const randomPart = generateRandomString(8);
  return `${timestamp}-${randomPart}`;
}

/**
 * Generates a random alphanumeric string
 */
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  // Use crypto.getRandomValues for secure random generation
  if (typeof window !== 'undefined' && window.crypto) {
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      result += characters.charAt(randomValues[i] % characters.length);
    }
  } else {
    // Fallback for server-side rendering
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }

  return result;
}

/**
 * Validates a resume token format
 */
export function validateResumeToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // Expected format: XXXXXXXX-XXXXXXXX (alphanumeric with hyphen separator)
  const tokenRegex = /^[A-Z0-9]+-[A-Z0-9]+$/;
  return tokenRegex.test(token) && token.length >= 10;
}

/**
 * Formats a resume token for display (adds spacing for readability)
 * Example: AB12CD34-XY98ZW76 -> AB12-CD34-XY98-ZW76
 */
export function formatResumeTokenForDisplay(token: string): string {
  if (!validateResumeToken(token)) {
    return token;
  }

  // Remove existing hyphens and add new ones every 4 characters
  const cleaned = token.replace(/-/g, '');
  const parts: string[] = [];

  for (let i = 0; i < cleaned.length; i += 4) {
    parts.push(cleaned.slice(i, i + 4));
  }

  return parts.join('-');
}

/**
 * Extracts timestamp from resume token
 */
export function getTokenTimestamp(token: string): Date | null {
  if (!validateResumeToken(token)) {
    return null;
  }

  try {
    const timestampPart = token.split('-')[0];
    const timestamp = parseInt(timestampPart, 36);
    return new Date(timestamp);
  } catch (error) {
    return null;
  }
}

/**
 * Checks if a resume token has expired (optional expiration time in hours)
 */
export function isTokenExpired(token: string, expirationHours: number = 24 * 30): boolean {
  const timestamp = getTokenTimestamp(token);
  if (!timestamp) {
    return true;
  }

  const now = new Date();
  const hoursSinceCreation = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

  return hoursSinceCreation > expirationHours;
}
