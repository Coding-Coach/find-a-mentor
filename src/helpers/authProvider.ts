/**
 * Detects the auth provider from auth0Id
 * Auth0 ID format: "provider|unique-id"
 * Examples:
 * - "auth0|..." - Username/Password (uses Gravatar)
 * - "google-oauth2|..." - Google OAuth (uses Google profile picture)
 */
export enum AuthProvider {
  USERNAME = 'auth0',
  GOOGLE = 'google-oauth2',
  UNKNOWN = 'unknown',
}

export function getAuthProvider(auth0Id?: string): AuthProvider {
  if (!auth0Id) return AuthProvider.UNKNOWN;

  if (auth0Id.startsWith('google-oauth2|')) {
    return AuthProvider.GOOGLE;
  }

  if (auth0Id.startsWith('auth0|')) {
    return AuthProvider.USERNAME;
  }

  return AuthProvider.UNKNOWN;
}

export function isGoogleOAuthUser(auth0Id?: string): boolean {
  return getAuthProvider(auth0Id) === AuthProvider.GOOGLE;
}
