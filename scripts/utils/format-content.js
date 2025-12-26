/**
 * Content formatting utilities for improved readability
 *
 * Improves MDX content readability by:
 * - Adding blank lines before/after headers
 * - Ensuring proper paragraph separation
 * - Creating visual whitespace for better scanning
 */

/**
 * Improve Korean content readability by adding proper spacing
 *
 * @param {string} content - Raw MDX content from Notion
 * @returns {string} Formatted content with improved readability
 */
export function formatContentReadability(content) {
  let formatted = content;

  // Step 1: Normalize line endings
  formatted = formatted.replace(/\r\n/g, '\n');

  // Step 2: Add blank lines before bold headers (multi-line support)
  // Pattern: **Header text...** (bold sections spanning multiple lines)
  // Use DOTALL-like pattern with [\s\S] to match across newlines
  formatted = formatted.replace(/([^\n])\n(\*\*[\s\S]*?\*\*\n)/g, '$1\n\n$2');

  // Step 3: Add blank lines after bold headers (multi-line support)
  // Pattern: **Header text...** followed immediately by content
  formatted = formatted.replace(/(\*\*[\s\S]*?\*\*)\n([^\n*])/g, '$1\n\n$2');

  // Step 4: Ensure numbered/bulleted list headers have spacing
  // Pattern: **1. Header text** or **• Header text**
  formatted = formatted.replace(/(\*\*\d+\..*?\*\*)\n/g, '$1\n\n');
  formatted = formatted.replace(/(\*\*•.*?\*\*)\n/g, '$1\n\n');

  // Step 5: Add blank lines before markdown headers (# ## ###)
  formatted = formatted.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');

  // Step 6: Add blank lines after markdown headers
  formatted = formatted.replace(/(#{1,6}\s[^\n]+)\n([^\n#])/g, '$1\n\n$2');

  // Step 7: Ensure list items have proper spacing
  // Pattern: • item or - item or * item
  formatted = formatted.replace(/\n([•\-\*]\s)/g, '\n\n$1');

  // Step 8: Break up very long paragraphs (>800 chars) at sentence boundaries
  formatted = breakLongParagraphs(formatted);

  // Step 9: Clean up excessive blank lines (max 2 consecutive)
  formatted = formatted.replace(/\n{4,}/g, '\n\n\n');

  // Step 10: Ensure content starts and ends properly
  formatted = '\n' + formatted.trim() + '\n';

  return formatted;
}

/**
 * Break very long paragraphs at sentence boundaries
 *
 * @param {string} content - Content to process
 * @returns {string} Content with long paragraphs broken up
 */
function breakLongParagraphs(content) {
  const lines = content.split('\n');
  const processed = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip if line is too short, is a header, or is a list item
    if (
      line.length < 800 ||
      line.startsWith('#') ||
      line.startsWith('**') ||
      line.match(/^[•\-\*]\s/) ||
      line.trim() === ''
    ) {
      processed.push(line);
      continue;
    }

    // Break at sentence boundaries (Korean and English)
    // Korean: . followed by space or end
    // English: . followed by space and capital letter
    const sentences = line.split(/([.。]\s+(?=[A-Z가-힣]))/);

    let currentParagraph = '';
    for (let j = 0; j < sentences.length; j++) {
      currentParagraph += sentences[j];

      // If paragraph is getting long (>600 chars) and we're at sentence boundary
      if (currentParagraph.length > 600 && sentences[j].match(/[.。]\s+$/)) {
        processed.push(currentParagraph.trim());
        processed.push(''); // Add blank line
        currentParagraph = '';
      }
    }

    // Add remaining content
    if (currentParagraph.trim()) {
      processed.push(currentParagraph.trim());
    }
  }

  return processed.join('\n');
}

/**
 * Get readability score for formatted content
 *
 * @param {string} content - Formatted content
 * @returns {Object} Readability metrics
 */
export function getContentReadability(content) {
  const lines = content.split('\n');
  const blankLines = lines.filter(l => l.trim() === '').length;
  const headerLines = lines.filter(l =>
    l.startsWith('#') || (l.startsWith('**') && l.endsWith('**'))
  ).length;

  const avgParagraphLength = lines
    .filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('**'))
    .reduce((sum, l) => sum + l.length, 0) /
    (lines.length - blankLines - headerLines || 1);

  const readabilityScore = Math.min(100, Math.max(0,
    50 + // Base score
    (blankLines / lines.length) * 100 + // Whitespace ratio (0-100)
    Math.max(0, 30 - (avgParagraphLength / 20)) // Penalty for long paragraphs
  ));

  return {
    readabilityScore: Math.round(readabilityScore),
    blankLineRatio: `${Math.round((blankLines / lines.length) * 100)}%`,
    avgParagraphLength: Math.round(avgParagraphLength),
    totalLines: lines.length,
    recommendation: readabilityScore < 60 ?
      'Content needs better formatting' :
      readabilityScore < 80 ?
        'Content formatting is acceptable' :
        'Content formatting is good'
  };
}
