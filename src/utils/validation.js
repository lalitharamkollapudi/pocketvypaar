// src/utils/validation.js
/**
 * Simple mobile number validator – accepts exactly 10 digits.
 */
export function isValidMobile(mobile) {
  const regex = /^[0-9]{10}$/;
  return regex.test(mobile);
}
