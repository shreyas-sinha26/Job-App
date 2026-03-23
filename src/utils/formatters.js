/**
 * Formatting utilities for PrecisionHire
 */

/**
 * Format salary in lakhs or thousands based on currency
 * @param {number} min Minimum salary
 * @param {number} max Maximum salary
 * @param {string} currency Currency code ('INR' or 'USD')
 * @returns {string} Formatted salary string
 */
export function formatSalary(min, max, currency) {
  if (currency === 'INR') {
    const minL = (min / 100000).toFixed(0);
    const maxL = (max / 100000).toFixed(0);
    return `₹${minL}L–₹${maxL}L`;
  }
  return `$${(min / 1000).toFixed(0)}K–$${(max / 1000).toFixed(0)}K`;
}

/**
 * Generate a consistent HSL color from a string (e.g., company name)
 * @param {string} str Input string
 * @returns {string} HSL color string
 */
export function stringToHslColor(str, s = 65, l = 45) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, ${s}%, ${l}%)`;
}
