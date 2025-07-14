import { describe, it, expect } from 'vitest'
import { formatDate, formatDateEn, getRelativeTime } from '../formatDate'

describe('Date Formatting Utils', () => {
  const testDate = new Date('2023-12-25')

  it('should format date in Korean', () => {
    const formatted = formatDate(testDate)
    expect(formatted).toContain('2023')
    expect(formatted).toContain('12')
    expect(formatted).toContain('25')
  })

  it('should format date in English', () => {
    const formatted = formatDateEn(testDate)
    expect(formatted).toContain('2023')
    expect(formatted).toContain('December')
    expect(formatted).toContain('25')
  })

  it('should handle invalid dates gracefully', () => {
    const invalidDate = new Date('invalid')
    expect(() => formatDate(invalidDate)).not.toThrow()
    expect(formatDate(invalidDate)).toBe('잘못된 날짜')
    expect(formatDateEn(invalidDate)).toBe('Invalid Date')
  })

  it('should calculate relative time correctly', () => {
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    expect(getRelativeTime(now, 'ko')).toBe('오늘')
    expect(getRelativeTime(yesterday, 'ko')).toBe('어제')
    expect(getRelativeTime(now, 'en')).toBe('Today')
    expect(getRelativeTime(yesterday, 'en')).toBe('Yesterday')
  })
})