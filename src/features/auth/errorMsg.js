const FIREBASE_ERRORS = {
  'auth/invalid-email': "That email address doesn't look right.",
  'auth/user-disabled': "This account has been disabled. Please contact support.",
  'auth/user-not-found': "No account found with this email.",
  'auth/wrong-password': "Incorrect password. Please try again.",
  'auth/email-already-in-use': "An account already exists with this email address.",
  'auth/weak-password': "Password should be at least 6 characters.",
  'auth/admin-restricted-operation': "This operation is restricted to administrators only.",
  'auth/popup-closed-by-user': "Login cancelled. Please finish the process in the popup window.",
  'auth/popup-blocked': "The login popup was blocked by your browser. Please allow popups for this site.",
  'auth/cancelled-popup-request': "Multiple login popups were opened. Only one is allowed at a time.",
  'auth/operation-not-allowed': "This sign-in method is not enabled. Please contact the administrator.",
  'auth/auth-domain-config-required': "Configuration error regarding the auth domain.",
  'auth/unauthorized-domain': "This domain is not authorized for Firebase Authentication.",
  'auth/account-exists-with-different-credential': "An account already exists with this email. Try signing in with your original provider.",
  'auth/credential-already-in-use': "This social account is already linked to another user.",
  'auth/provider-already-linked': "This provider is already linked to the current user.",
  'auth/no-such-provider': "The user has not linked an account with this provider.",
  'auth/captcha-check-failed': "ReCAPTCHA check failed. Please try again.",
  'auth/invalid-phone-number': "The phone number is invalid.",
  'auth/missing-phone-number': "Phone number is required.",
  'auth/quota-exceeded': "SMS quota exceeded. Please try again later.",
  'auth/session-expired': "The SMS code session has expired. Please request a new code.",
  'auth/invalid-verification-code': "The 6-digit code you entered is incorrect.",
  'auth/invalid-verification-id': "The verification ID is invalid.",
  'auth/code-expired': "The SMS code has expired. Please request a new one.",
  'auth/network-request-failed': "Network error. Please check your internet connection.",
  'auth/too-many-requests': "Too many failed attempts. We've temporarily disabled login for this account.",
  'auth/internal-error': "A server error occurred. Please try again in a few moments.",
  'auth/timeout': "The operation timed out. Please try again.",
  'auth/expired-action-code': "The link has expired. Please request a new one.",
  'auth/invalid-action-code': "The link is invalid or has already been used.",
  'auth/user-mismatch': "The user credentials do not match the expected user for this action.",
  'auth/requires-recent-login': "For security reasons, please log out and log back in before making this change.",
  'auth/user-token-expired': "Your session has expired. Please log in again.",
  'auth/user-token-signature-invalid': "Security token mismatch. Please log in again.",
  'auth/app-not-authorized': "This app is not authorized to use Firebase Authentication with the provided API key.",
  'auth/mfa-info-required': "Multi-factor authentication is required to continue.",
  'auth/second-factor-already-in-use': "This second factor is already linked to this account.",
  'auth/argument-error': "Invalid configuration or missing fields.",
  'auth/invalid-credential': "The credentials provided are invalid or expired.",
  'auth/recaptcha-not-enabled': "Recaptcha is not enabled for this project.",
  'auth/missing-ios-bundle-id': "Missing iOS Bundle ID.",
  'auth/missing-android-pkg-name': "Missing Android Package Name.",
  'auth/invalid-continue-uri': "The continue URL provided is invalid.",
  'auth/missing-continue-uri': "A continue URL must be provided.",
  'auth/passwords-do-not-match': "Passwords do not match. Please try again.",
  'auth/missing-email': "Please enter your email address first."
};

const messageOf = (error) => {
  if (!error) return "";
  if (typeof error === 'string') return error;
  return FIREBASE_ERRORS[error.code] || "An unexpected error occurred. Please try again.";
};

export default messageOf;