// Reading time calculation utility
// Based on average reading speeds for different languages

interface ReadingTimeOptions {
  wordsPerMinute?: number;
  includeImages?: boolean;
  imageReadingTime?: number; // seconds per image
}

interface ReadingTimeResult {
  minutes: number;
  seconds: number;
  totalSeconds: number;
  words: number;
  text: string;
}

/**
 * Calculate estimated reading time for content
 * @param content - The text content to analyze
 * @param lang - Language code (ko, en)
 * @param options - Configuration options
 */
export function calculateReadingTime(
  content: string, 
  lang: string = 'ko', 
  options: ReadingTimeOptions = {}
): ReadingTimeResult {
  const {
    wordsPerMinute = getWordsPerMinute(lang),
    includeImages = true,
    imageReadingTime = 12 // 12 seconds per image (average)
  } = options;

  // Remove markdown formatting and HTML tags
  const cleanContent = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image markdown
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Convert links to text
    .replace(/[#*_~`]/g, '') // Remove markdown formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Count words based on language
  const words = countWords(cleanContent, lang);
  
  // Calculate base reading time
  const baseTimeMinutes = words / wordsPerMinute;
  
  // Add time for images if enabled
  let imageTime = 0;
  if (includeImages) {
    const imageMatches = content.match(/!\[.*?\]\(.*?\)/g) || [];
    imageTime = imageMatches.length * imageReadingTime;
  }
  
  // Total time in seconds
  const totalSeconds = Math.ceil(baseTimeMinutes * 60 + imageTime);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  // Generate human-readable text
  const text = formatReadingTime(minutes, seconds, lang);
  
  return {
    minutes,
    seconds,
    totalSeconds,
    words,
    text
  };
}

/**
 * Get words per minute based on language
 */
function getWordsPerMinute(lang: string): number {
  // Reading speeds vary by language due to character density and complexity
  const speedMap: Record<string, number> = {
    'ko': 200, // Korean: slower due to character complexity
    'en': 250, // English: standard reading speed
    'ja': 180, // Japanese: slower due to mixed scripts
    'zh': 180, // Chinese: slower due to character density
  };
  
  return speedMap[lang] || 230; // Default speed
}

/**
 * Count words based on language
 */
function countWords(text: string, lang: string): number {
  if (!text || text.trim().length === 0) return 0;
  
  if (lang === 'ko' || lang === 'ja' || lang === 'zh') {
    // For CJK languages, count characters (excluding spaces)
    const cjkChars = text.replace(/\s/g, '').length;
    // Convert character count to approximate word count
    // Average Korean word is about 2-3 characters
    return Math.ceil(cjkChars / 2.5);
  } else {
    // For Latin-based languages, count words by spaces
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
}

/**
 * Format reading time as human-readable text
 */
function formatReadingTime(minutes: number, seconds: number, lang: string): string {
  if (lang === 'ko') {
    if (minutes === 0) {
      return '1분 미만';
    } else if (minutes === 1) {
      return '약 1분';
    } else {
      return `약 ${minutes}분`;
    }
  } else {
    if (minutes === 0) {
      return 'Less than 1 min';
    } else if (minutes === 1) {
      return '1 min read';
    } else {
      return `${minutes} min read`;
    }
  }
}

/**
 * Get reading time from markdown content
 * Convenience function for Astro components
 */
export function getReadingTimeFromMarkdown(
  markdownContent: string, 
  lang: string = 'ko'
): ReadingTimeResult {
  return calculateReadingTime(markdownContent, lang, {
    includeImages: true,
    imageReadingTime: 12
  });
}

/**
 * Reading time component data for consistent display
 */
export function getReadingTimeDisplay(
  readingTime: ReadingTimeResult,
  lang: string = 'ko'
): {
  text: string;
  ariaLabel: string;
  icon: string;
} {
  const icon = '📖'; // Book emoji as reading indicator
  
  const ariaLabel = lang === 'ko' 
    ? `예상 읽기 시간: ${readingTime.text}`
    : `Estimated reading time: ${readingTime.text}`;
    
  return {
    text: readingTime.text,
    ariaLabel,
    icon
  };
}