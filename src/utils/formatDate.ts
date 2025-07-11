/**
 * Format date for Korean locale
 */
export function formatDate(date: Date): string {
  if (isNaN(date.getTime())) {
    return '잘못된 날짜'
  }
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format date for English locale
 */
export function formatDateEn(date: Date): string {
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date, locale: 'ko' | 'en' = 'ko'): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (locale === 'ko') {
    if (diffInDays === 0) return '오늘'
    if (diffInDays === 1) return '어제'
    if (diffInDays < 7) return `${diffInDays}일 전`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}달 전`
    return `${Math.floor(diffInDays / 365)}년 전`
  } else {
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }
}