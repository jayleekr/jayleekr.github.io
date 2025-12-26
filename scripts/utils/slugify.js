/**
 * URL-safe slug generation utility
 *
 * Creates readable ASCII-only slugs from Korean/English mixed titles
 * Prevents URL encoding issues (e.g., %EC%9D%B8%EC%88%98)
 *
 * @module slugify
 */

/**
 * Extract English words from mixed Korean/English title
 * @param {string} text - Input text with possible Korean/English mix
 * @returns {string} Extracted English words or empty string
 */
function extractEnglishWords(text) {
  // Remove all non-ASCII characters (Korean, special chars, etc.)
  const englishOnly = text.replace(/[^\x00-\x7F]+/g, ' ');

  // Clean up and normalize
  return englishOnly
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Check if a string has enough meaningful content for a slug
 * @param {string} text - Text to check
 * @param {number} minLength - Minimum required length (default: 3)
 * @returns {boolean}
 */
function hasEnoughContent(text, minLength = 3) {
  if (!text) return false;

  // Remove common noise words and check remaining length
  const cleaned = text
    .toLowerCase()
    .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by)\b/g, '')
    .replace(/\s+/g, '')
    .trim();

  return cleaned.length >= minLength;
}

/**
 * Generate fallback slug from date
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @returns {string} Fallback slug like "post-2025-12-26"
 */
function generateFallbackSlug(dateStr) {
  return `post-${dateStr}`;
}

/**
 * Create URL-safe slug from title
 *
 * Strategy:
 * 1. Extract English words from mixed Korean/English title
 * 2. If extracted text is meaningful enough, use it
 * 3. Otherwise, use date-based fallback
 *
 * @param {string} title - Original title (may contain Korean)
 * @param {string} dateStr - ISO date string for fallback (YYYY-MM-DD)
 * @returns {string} URL-safe ASCII-only slug
 *
 * @example
 * slugify("Anthropic Bun 인수", "2025-12-26")
 * // returns "anthropic-bun"
 *
 * slugify("한글 제목", "2025-12-26")
 * // returns "post-2025-12-26"
 *
 * slugify("AI and 머신러닝 Trends", "2025-12-26")
 * // returns "ai-and-trends"
 */
export function slugify(title, dateStr) {
  if (!title) {
    return generateFallbackSlug(dateStr);
  }

  // Extract English portion
  const englishWords = extractEnglishWords(title);

  // Check if extracted English is meaningful
  if (hasEnoughContent(englishWords)) {
    // Create slug from English words
    return englishWords
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove non-alphanumeric except spaces
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/-+/g, '-')         // Replace multiple hyphens with single
      .replace(/^-|-$/g, '')       // Remove leading/trailing hyphens
      .substring(0, 50);           // Limit length
  }

  // No meaningful English found, use fallback
  return generateFallbackSlug(dateStr);
}

/**
 * Validate generated slug
 * @param {string} slug - Generated slug to validate
 * @returns {boolean} True if slug is valid
 */
export function isValidSlug(slug) {
  if (!slug || slug.length === 0) return false;

  // Must be ASCII-only (no URL encoding needed)
  const hasNonAscii = /[^\x00-\x7F]/.test(slug);
  if (hasNonAscii) return false;

  // Must contain at least one letter or number
  const hasContent = /[a-z0-9]/.test(slug);
  if (!hasContent) return false;

  // Must not have special chars that need URL encoding
  const hasSpecialChars = /[^a-z0-9-]/.test(slug);
  if (hasSpecialChars) return false;

  return true;
}

/**
 * Get readability report for a slug
 * @param {string} slug - Slug to analyze
 * @returns {Object} Readability analysis
 */
export function getSlugReadability(slug) {
  const report = {
    slug,
    isValid: isValidSlug(slug),
    length: slug.length,
    hasKorean: /[가-힣]/.test(slug),
    hasSpecialChars: /[^a-z0-9-]/.test(slug),
    willUrlEncode: /[^\x00-\x7F]/.test(slug),
    readabilityScore: 0
  };

  // Calculate readability score (0-100)
  let score = 100;

  if (report.hasKorean) score -= 50;  // Major penalty for Korean chars
  if (report.willUrlEncode) score -= 30; // Penalty for URL encoding
  if (report.hasSpecialChars) score -= 10; // Minor penalty for special chars
  if (report.length > 50) score -= 5; // Too long
  if (report.length < 5) score -= 10; // Too short

  report.readabilityScore = Math.max(0, score);
  report.recommendation = score >= 80 ? 'Good' : score >= 50 ? 'Acceptable' : 'Poor';

  return report;
}

/**
 * Batch check readability for multiple slugs
 * @param {Array<{title: string, slug: string}>} items - Items to check
 * @returns {Array<Object>} Readability reports
 */
export function checkBatchReadability(items) {
  return items.map(item => ({
    title: item.title,
    ...getSlugReadability(item.slug)
  }));
}
