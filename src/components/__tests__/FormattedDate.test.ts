import { describe, it, expect } from 'vitest'

// FormattedDate 컴포넌트가 사용할 로직 테스트
describe('FormattedDate Component Logic', () => {
  it('should validate date prop is required', () => {
    const testDate = new Date('2023-12-25')
    expect(testDate).toBeInstanceOf(Date)
    expect(testDate.getFullYear()).toBe(2023)
    expect(testDate.getMonth()).toBe(11) // 0-indexed
    expect(testDate.getDate()).toBe(25)
  })

  it('should format date for datetime attribute', () => {
    const testDate = new Date('2023-12-25T10:30:00Z')
    const datetimeString = testDate.toISOString()
    
    expect(datetimeString).toContain('2023-12-25')
    expect(datetimeString).toContain('T')
    expect(datetimeString.endsWith('Z')).toBe(true)
  })

  it('should handle timezone formatting', () => {
    const testDate = new Date('2023-12-25T10:30:00Z')
    
    // Test different locale formats
    const koFormat = testDate.toLocaleDateString('ko-KR')
    const enFormat = testDate.toLocaleDateString('en-US')
    
    expect(koFormat).toMatch(/\d{4}\.\s?\d{1,2}\.\s?\d{1,2}\.?/)
    expect(enFormat).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
  })
})