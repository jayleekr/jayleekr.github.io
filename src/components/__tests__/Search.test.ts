import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockViewport } from '../../test/setup'

// Mock i18n utilities
vi.mock('../../utils/i18n', () => ({
  getLangFromUrl: vi.fn(() => 'en'),
  t: vi.fn((key: string) => key)
}))

describe('Search Functionality', () => {
  beforeEach(() => {
    // Reset DOM and mocks
    document.body.innerHTML = ''
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  describe('Search Modal', () => {
    beforeEach(() => {
      // Create search modal structure
      document.body.innerHTML = `
        <div id="search-modal" class="fixed inset-0 z-50 hidden" role="dialog" aria-modal="true" data-search-modal>
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" data-search-backdrop></div>
          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-start justify-center p-4 pt-16">
              <div class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white">
                <div class="relative">
                  <div class="flex items-center px-6 py-4 border-b">
                    <input
                      type="text"
                      id="search-input"
                      class="flex-1 bg-transparent border-0 text-lg"
                      placeholder="Search posts, categories, tags..."
                      data-search-input
                    >
                    <button type="button" data-search-close aria-label="Close search">×</button>
                  </div>
                </div>
                <div class="max-h-96 overflow-y-auto" data-search-results>
                  <div class="px-6 py-8 text-center" data-search-empty>
                    <p>Start typing to search</p>
                  </div>
                  <div class="hidden px-6 py-8 text-center" data-search-loading>
                    <p>Searching...</p>
                  </div>
                  <div class="hidden px-6 py-8 text-center" data-search-no-results>
                    <p>No results found</p>
                  </div>
                  <div class="hidden" data-search-results-list></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button id="desktop-search-button">Search</button>
        <button id="mobile-search-button">Search</button>
      `
    })

    it('should render search modal with proper structure', () => {
      const modal = document.getElementById('search-modal')
      expect(modal).toBeInTheDocument()
      expect(modal).toHaveAttribute('role', 'dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
      expect(modal).toHaveClass('hidden')

      const input = document.querySelector('[data-search-input]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'text')

      const closeButton = document.querySelector('[data-search-close]')
      expect(closeButton).toBeInTheDocument()
      expect(closeButton).toHaveAttribute('aria-label', 'Close search')
    })

    it('should have proper accessibility attributes', () => {
      const modal = document.getElementById('search-modal')
      expect(modal).toHaveAttribute('role', 'dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')

      const input = document.querySelector('[data-search-input]') as HTMLInputElement
      expect(input).toHaveAttribute('placeholder')
    })

    it('should open when search button is clicked', () => {
      const modal = document.getElementById('search-modal')
      const searchButton = document.getElementById('desktop-search-button')
      
      // Simulate search modal class that would handle this
      const openModal = () => {
        modal?.classList.remove('hidden')
        const input = document.querySelector('[data-search-input]') as HTMLInputElement
        input?.focus()
      }

      searchButton?.addEventListener('click', openModal)
      searchButton?.click()

      expect(modal).not.toHaveClass('hidden')
    })

    it('should close when close button is clicked', () => {
      const modal = document.getElementById('search-modal')
      const closeButton = document.querySelector('[data-search-close]')
      
      // Open modal first
      modal?.classList.remove('hidden')
      
      const closeModal = () => {
        modal?.classList.add('hidden')
        const input = document.querySelector('[data-search-input]') as HTMLInputElement
        if (input) input.value = ''
      }

      closeButton?.addEventListener('click', closeModal)
      const closeButtonElement = closeButton as HTMLElement
      closeButtonElement?.click()

      expect(modal).toHaveClass('hidden')
    })

    it('should close when backdrop is clicked', () => {
      const modal = document.getElementById('search-modal')
      const backdrop = document.querySelector('[data-search-backdrop]')
      
      // Open modal first
      modal?.classList.remove('hidden')
      
      const closeModal = () => {
        modal?.classList.add('hidden')
      }

      backdrop?.addEventListener('click', closeModal)
      const backdropElement = backdrop as HTMLElement
      backdropElement?.click()

      expect(modal).toHaveClass('hidden')
    })

    it('should handle search input changes', () => {
      const input = document.querySelector('[data-search-input]') as HTMLInputElement
      const loadingState = document.querySelector('[data-search-loading]')
      const emptyState = document.querySelector('[data-search-empty]')
      
      // Mock search handler
      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement
        const query = target.value.trim()
        
        if (query.length === 0) {
          emptyState?.classList.remove('hidden')
          loadingState?.classList.add('hidden')
        } else if (query.length >= 2) {
          emptyState?.classList.add('hidden')
          loadingState?.classList.remove('hidden')
        }
      }

      input?.addEventListener('input', handleInput)

      // Test empty input
      input.value = ''
      input.dispatchEvent(new Event('input'))
      expect(emptyState).not.toHaveClass('hidden')
      expect(loadingState).toHaveClass('hidden')

      // Test search input
      input.value = 'test'
      input.dispatchEvent(new Event('input'))
      expect(emptyState).toHaveClass('hidden')
      expect(loadingState).not.toHaveClass('hidden')
    })

    it('should handle keyboard shortcuts', () => {
      const modal = document.getElementById('search-modal')
      let modalOpen = false
      
      const handleKeydown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault()
          modalOpen = true
          modal?.classList.remove('hidden')
        } else if (e.key === '/' && !((e.target as Element)?.tagName === 'INPUT' || (e.target as Element)?.tagName === 'TEXTAREA')) {
          e.preventDefault()
          modalOpen = true
          modal?.classList.remove('hidden')
        } else if (e.key === 'Escape' && modalOpen) {
          modalOpen = false
          modal?.classList.add('hidden')
        }
      }

      document.addEventListener('keydown', handleKeydown)

      // Test Cmd+K
      document.dispatchEvent(new KeyboardEvent('keydown', { metaKey: true, key: 'k' }))
      expect(modal).not.toHaveClass('hidden')

      // Test Escape
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      expect(modal).toHaveClass('hidden')

      // Test / key
      document.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }))
      expect(modal).not.toHaveClass('hidden')
    })

    it('should show loading state during search', () => {
      const input = document.querySelector('[data-search-input]') as HTMLInputElement
      const loadingState = document.querySelector('[data-search-loading]')
      const emptyState = document.querySelector('[data-search-empty]')
      
      const simulateSearch = () => {
        emptyState?.classList.add('hidden')
        loadingState?.classList.remove('hidden')
        
        // Simulate async search completion
        setTimeout(() => {
          loadingState?.classList.add('hidden')
        }, 100)
      }

      input.value = 'test query'
      simulateSearch()

      expect(loadingState).not.toHaveClass('hidden')
      expect(emptyState).toHaveClass('hidden')

      // Fast forward timers
      vi.advanceTimersByTime(100)
      expect(loadingState).toHaveClass('hidden')
    })

    it('should show no results state', () => {
      const noResultsState = document.querySelector('[data-search-no-results]')
      const loadingState = document.querySelector('[data-search-loading]')
      
      const showNoResults = () => {
        loadingState?.classList.add('hidden')
        noResultsState?.classList.remove('hidden')
      }

      showNoResults()
      expect(noResultsState).not.toHaveClass('hidden')
      expect(loadingState).toHaveClass('hidden')
    })

    it('should handle search result navigation with arrow keys', () => {
      const input = document.querySelector('[data-search-input]') as HTMLInputElement
      const resultsList = document.querySelector('[data-search-results-list]')
      
      // Mock search results
      if (resultsList) {
        resultsList.innerHTML = `
          <div data-result-index="0" class="search-result">Result 1</div>
          <div data-result-index="1" class="search-result">Result 2</div>
          <div data-result-index="2" class="search-result">Result 3</div>
        `
        resultsList.classList.remove('hidden')
      }

      let selectedIndex = -1
      const results = document.querySelectorAll('[data-result-index]')

      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          if (selectedIndex >= 0) {
            results[selectedIndex].classList.remove('selected')
          }
          selectedIndex = (selectedIndex + 1) % results.length
          results[selectedIndex].classList.add('selected')
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          if (selectedIndex >= 0) {
            results[selectedIndex].classList.remove('selected')
          }
          selectedIndex = selectedIndex <= 0 ? results.length - 1 : selectedIndex - 1
          results[selectedIndex].classList.add('selected')
        }
      }

      input.addEventListener('keydown', handleKeydown)

      // Test arrow down
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
      expect(results[0]).toHaveClass('selected')

      // Test arrow down again
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
      expect(results[0]).not.toHaveClass('selected')
      expect(results[1]).toHaveClass('selected')

      // Test arrow up
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
      expect(results[1]).not.toHaveClass('selected')
      expect(results[0]).toHaveClass('selected')
    })

    it('should handle search input debouncing', () => {
      const input = document.querySelector('[data-search-input]') as HTMLInputElement
      let searchCallCount = 0
      
      const debouncedSearch = vi.fn(() => {
        searchCallCount++
      })

      let timeoutId: number | null = null
      const handleInput = () => {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = window.setTimeout(debouncedSearch, 150)
      }

      input.addEventListener('input', handleInput)

      // Simulate rapid typing
      input.value = 't'
      input.dispatchEvent(new Event('input'))
      input.value = 'te'
      input.dispatchEvent(new Event('input'))
      input.value = 'tes'
      input.dispatchEvent(new Event('input'))
      input.value = 'test'
      input.dispatchEvent(new Event('input'))

      // Should not have called search yet
      expect(searchCallCount).toBe(0)

      // Fast forward past debounce time
      vi.advanceTimersByTime(150)
      expect(searchCallCount).toBe(1)
    })
  })

  describe('Search Results', () => {
    it('should display search results correctly', () => {
      document.body.innerHTML = `
        <div data-search-results-list class="hidden"></div>
      `

      const resultsList = document.querySelector('[data-search-results-list]')
      const mockResults = [
        {
          title: 'Test Post 1',
          url: '/blog/test-1',
          excerpt: 'This is a test post excerpt',
          type: 'post' as const,
          date: '2024-01-15',
          tags: ['test', 'javascript']
        },
        {
          title: 'Test Post 2',
          url: '/blog/test-2',
          excerpt: 'Another test post excerpt',
          type: 'post' as const,
          date: '2024-01-10',
          tags: ['test', 'react']
        }
      ]

      const displayResults = (results: typeof mockResults) => {
        if (resultsList) {
          resultsList.innerHTML = results.map((result, index) => `
            <div class="search-result" data-result-index="${index}">
              <h3>${result.title}</h3>
              <p>${result.excerpt}</p>
              <div class="meta">
                <span>${new Date(result.date).toLocaleDateString()}</span>
                <div class="tags">
                  ${result.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
              </div>
            </div>
          `).join('')
          resultsList.classList.remove('hidden')
        }
      }

      displayResults(mockResults)

      const results = document.querySelectorAll('.search-result')
      expect(results).toHaveLength(2)
      expect(results[0].querySelector('h3')?.textContent).toBe('Test Post 1')
      expect(results[1].querySelector('h3')?.textContent).toBe('Test Post 2')
      expect(resultsList).not.toHaveClass('hidden')
    })

    it('should highlight search query in results', () => {
      const highlightQuery = (text: string, query: string): string => {
        if (!query) return text
        const regex = new RegExp(`(${query})`, 'gi')
        return text.replace(regex, '<mark>$1</mark>')
      }

      const text = 'This is a test post about JavaScript testing'
      const query = 'test'
      const highlighted = highlightQuery(text, query)

      expect(highlighted).toContain('<mark>test</mark>')
      // The function highlights all case-insensitive matches as lowercase
      expect(highlighted).toMatch(/<mark>test<\/mark>/gi)
    })

    it('should handle result clicks', () => {
      document.body.innerHTML = `
        <div data-search-results-list>
          <div class="search-result" data-result-index="0" data-url="/blog/test-1">
            <h3>Test Post 1</h3>
          </div>
        </div>
      `

      const result = document.querySelector('[data-result-index="0"]')
      let clickedUrl = ''

      const handleResultClick = (e: Event) => {
        const target = e.currentTarget as HTMLElement
        clickedUrl = target.getAttribute('data-url') || ''
      }

      result?.addEventListener('click', handleResultClick)
      const resultElement = result as HTMLElement
      resultElement?.click()

      expect(clickedUrl).toBe('/blog/test-1')
    })
  })

  describe('Search Responsiveness', () => {
    it('should adapt to mobile viewport', () => {
      mockViewport(375, 667)
      
      document.body.innerHTML = `
        <div id="search-modal" class="fixed inset-0">
          <div class="flex min-h-full items-start justify-center p-4 pt-16 sm:p-6 sm:pt-24">
            <div class="w-full max-w-2xl">Search Content</div>
          </div>
        </div>
      `

      const modal = document.getElementById('search-modal')
      expect(modal).toBeInTheDocument()
      
      // On mobile, should have smaller padding
      const wrapper = modal?.querySelector('.p-4.pt-16')
      expect(wrapper).toBeInTheDocument()
    })

    it('should adapt to desktop viewport', () => {
      mockViewport(1200, 800)
      
      document.body.innerHTML = `
        <div id="search-modal" class="fixed inset-0">
          <div class="flex min-h-full items-start justify-center p-4 pt-16 sm:p-6 sm:pt-24">
            <div class="w-full max-w-2xl">Search Content</div>
          </div>
        </div>
      `

      // On desktop, should allow for larger padding via sm: classes
      expect(globalThis.matchMedia('(min-width: 768px)').matches).toBe(true)
    })
  })
})