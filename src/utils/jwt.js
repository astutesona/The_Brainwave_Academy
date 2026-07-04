/**
 * Client-Side JWT Encoding, Decoding, and Verification Utility
 * Simulates standard HS256 JWT tokens using Base64URL representations.
 */

// Helper to convert string to Base64URL
const toBase64Url = (str) => {
  try {
    const base64 = btoa(unescape(encodeURIComponent(str)));
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  } catch (e) {
    return '';
  }
};

// Helper to convert Base64URL to string
const fromBase64Url = (str) => {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return decodeURIComponent(escape(atob(base64)));
  } catch (e) {
    return null;
  }
};

// Simple hash simulation for HS256 signature
const generateSignature = (headerB64, payloadB64, secret) => {
  const data = `${headerB64}.${payloadB64}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return toBase64Url(`${hash}-${secret}`);
};

/**
 * Encodes a payload into a JWT token signed with a secret.
 * @param {Object} payload 
 * @param {string} secret 
 * @returns {string} jwtToken
 */
export const signJWT = (payload, secret = 'brainwave_secret_key') => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = toBase64Url(JSON.stringify(header));
  
  // Set default expiration claim (exp) to 2 hours from now
  const enrichedPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7200
  };
  const payloadB64 = toBase64Url(JSON.stringify(enrichedPayload));
  const signatureB64 = generateSignature(headerB64, payloadB64, secret);
  
  return `${headerB64}.${payloadB64}.${signatureB64}`;
};

/**
 * Verifies a JWT token's signature and expiration claims.
 * @param {string} token 
 * @param {string} secret 
 * @returns {Object|null} verifiedPayload
 */
export const verifyJWT = (token, secret = 'brainwave_secret_key') => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;
  
  // Re-generate signature to verify integrity
  const expectedSignature = generateSignature(headerB64, payloadB64, secret);
  if (signatureB64 !== expectedSignature) {
    console.error("JWT Verification failed: Invalid signature.");
    return null;
  }

  // Parse payload
  const payloadStr = fromBase64Url(payloadB64);
  if (!payloadStr) return null;

  try {
    const payload = JSON.parse(payloadStr);
    
    // Check expiration claim
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      console.error("JWT Verification failed: Token has expired.");
      return null;
    }
    
    return payload;
  } catch (e) {
    return null;
  }
};

/**
 * Decodes a token's payload without verifying signature (standard payload decoding).
 * @param {string} token 
 * @returns {Object|null} decodedPayload
 */
export const decodeJWT = (token) => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  
  const payloadStr = fromBase64Url(parts[1]);
  if (!payloadStr) return null;

  try {
    return JSON.parse(payloadStr);
  } catch (e) {
    return null;
  }
};
