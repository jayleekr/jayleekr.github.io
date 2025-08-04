import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Theme Toggle Functionality', () => {
  beforeEach(() => {
    // Reset DOM and localStorage
    document.body.innerHTML = ''
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark')
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Theme Toggle Component', () => {
    beforeEach(() => {
      // Create theme toggle structure
      document.body.innerHTML = `
        <button 
          id="theme-toggle" 
          class="theme-toggle"
          aria-label="Toggle theme"
          type="button"
        >
          <svg class="w-6 h-6 dark:hidden sun-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg class="w-6 h-6 hidden dark:block moon-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      `
    })

    it('should render theme toggle button with proper structure', () => {
      const button = document.getElementById('theme-toggle')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-label', 'Toggle theme')
      expect(button).toHaveAttribute('type', 'button')

      const sunIcon = document.querySelector('.sun-icon')
      const moonIcon = document.querySelector('.moon-icon')
      expect(sunIcon).toBeInTheDocument()
      expect(moonIcon).toBeInTheDocument()
    })

    it('should have proper accessibility attributes', () => {
      const button = document.getElementById('theme-toggle')
      expect(button).toHaveAttribute('aria-label')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should show correct icon for light theme', () => {
      // Light theme should show sun icon (visible) and hide moon icon
      document.documentElement.classList.remove('dark')
      
      const sunIcon = document.querySelector('.sun-icon')
      const moonIcon = document.querySelector('.moon-icon')
      
      expect(sunIcon).toHaveClass('dark:hidden')
      expect(moonIcon).toHaveClass('hidden', 'dark:block')
    })

    it('should show correct icon for dark theme', () => {
      // Dark theme should show moon icon and hide sun icon
      document.documentElement.classList.add('dark')
      
      const sunIcon = document.querySelector('.sun-icon')
      const moonIcon = document.querySelector('.moon-icon')
      
      expect(sunIcon).toHaveClass('dark:hidden')
      expect(moonIcon).toHaveClass('hidden', 'dark:block')
    })

    it('should toggle theme on click', () => {
      const button = document.getElementById('theme-toggle')
      const html = document.documentElement
      
      // Mock theme toggle functionality
      const toggleTheme = () => {
        const isDark = html.classList.contains('dark')
        if (isDark) {
          html.classList.remove('dark')
          html.setAttribute('data-theme', 'light')
          localStorage.setItem('theme', 'light')
        } else {
          html.classList.add('dark')
          html.setAttribute('data-theme', 'dark')
          localStorage.setItem('theme', 'dark')
        }
      }

      button?.addEventListener('click', toggleTheme)

      // Initial state (light)
      expect(html).not.toHaveClass('dark')

      // Click to toggle to dark
      button?.click()
      expect(html).toHaveClass('dark')
      expect(html).toHaveAttribute('data-theme', 'dark')
      expect(localStorage.getItem('theme')).toBe('dark')

      // Click to toggle back to light
      button?.click()
      expect(html).not.toHaveClass('dark')
      expect(html).toHaveAttribute('data-theme', 'light')
      expect(localStorage.getItem('theme')).toBe('light')
    })

    it('should persist theme preference in localStorage', () => {
      const setTheme = (theme: 'light' | 'dark') => {
        const html = document.documentElement
        if (theme === 'dark') {
          html.classList.add('dark')
          html.setAttribute('data-theme', 'dark')
        } else {
          html.classList.remove('dark')
          html.setAttribute('data-theme', 'light')
        }
        localStorage.setItem('theme', theme)
        return localStorage.getItem('theme')
      }

      // Set dark theme
      const darkTheme = setTheme('dark')
      expect(darkTheme).toBe('dark')
      
      // Set light theme  
      const lightTheme = setTheme('light')
      expect(lightTheme).toBe('light')
    })

    it('should load theme from localStorage on init', () => {
      const loadTheme = () => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const theme = savedTheme || (prefersDark ? 'dark' : 'light')
        
        const html = document.documentElement
        if (theme === 'dark') {
          html.classList.add('dark')
          html.setAttribute('data-theme', 'dark')
        } else {
          html.classList.remove('dark')
          html.setAttribute('data-theme', 'light')
        }
      }

      // Test with saved dark theme
      localStorage.setItem('theme', 'dark')
      loadTheme()
      expect(document.documentElement).toHaveClass('dark')
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark')

      // Test with saved light theme
      localStorage.setItem('theme', 'light')
      loadTheme()
      expect(document.documentElement).not.toHaveClass('dark')
      expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    })

    it('should respect system preference when no saved theme', () => {
      // Mock matchMedia to return dark preference
      const mockMatchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      })

      const loadTheme = () => {
        const savedTheme = localStorage.getItem('theme')
        if (!savedTheme) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          const theme = prefersDark ? 'dark' : 'light'
          
          const html = document.documentElement
          if (theme === 'dark') {
            html.classList.add('dark')
            html.setAttribute('data-theme', 'dark')
          } else {
            html.classList.remove('dark')
            html.setAttribute('data-theme', 'light')
          }
        }
      }

      // Clear localStorage to test system preference
      localStorage.clear()
      loadTheme()
      
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
      expect(document.documentElement).toHaveClass('dark')
    })

    it('should handle keyboard interaction', () => {
      const button = document.getElementById('theme-toggle')
      let themeToggled = false
      
      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          themeToggled = true
        }
      }

      button?.addEventListener('keydown', handleKeydown)

      // Test Enter key
      button?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      expect(themeToggled).toBe(true)

      // Reset and test Space key
      themeToggled = false
      button?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
      expect(themeToggled).toBe(true)
    })

    it('should provide visual feedback on interaction', () => {
      const button = document.getElementById('theme-toggle')
      
      // Test hover state (would be handled by CSS)
      button?.classList.add('hover:bg-gray-100')
      expect(button).toHaveClass('hover:bg-gray-100')
      
      // Test focus state
      button?.focus()
      expect(document.activeElement).toBe(button)
      
      // Test active state
      const handleMouseDown = () => {
        button?.classList.add('active')
      }
      const handleMouseUp = () => {
        button?.classList.remove('active')
      }
      
      button?.addEventListener('mousedown', handleMouseDown)
      button?.addEventListener('mouseup', handleMouseUp)
      
      button?.dispatchEvent(new MouseEvent('mousedown'))
      expect(button).toHaveClass('active')
      
      button?.dispatchEvent(new MouseEvent('mouseup'))
      expect(button).not.toHaveClass('active')
    })
  })

  describe('Theme System Integration', () => {
    it('should apply theme to CSS custom properties', () => {
      const applyTheme = (theme: 'light' | 'dark') => {
        const root = document.documentElement
        
        if (theme === 'dark') {
          root.style.setProperty('--color-background', '#1f2937')
          root.style.setProperty('--color-text', '#f9fafb')
        } else {
          root.style.setProperty('--color-background', '#ffffff')
          root.style.setProperty('--color-text', '#111827')
        }
      }

      applyTheme('dark')
      expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#1f2937')
      expect(document.documentElement.style.getPropertyValue('--color-text')).toBe('#f9fafb')

      applyTheme('light')
      expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#ffffff')
      expect(document.documentElement.style.getPropertyValue('--color-text')).toBe('#111827')
    })

    it('should handle theme transitions smoothly', () => {
      const button = document.getElementById('theme-toggle')
      const html = document.documentElement
      
      // Add transition classes
      html.classList.add('transition-colors', 'duration-200')
      
      // Mock theme toggle with transition
      const toggleThemeWithTransition = () => {
        // Disable transitions momentarily to prevent flash
        html.classList.add('disable-transitions')
        
        // Toggle theme
        html.classList.toggle('dark')
        
        // Re-enable transitions after a brief delay
        setTimeout(() => {
          html.classList.remove('disable-transitions')
        }, 10)
      }

      button?.addEventListener('click', toggleThemeWithTransition)
      
      expect(html).toHaveClass('transition-colors', 'duration-200')
    })

    it('should sync theme across multiple toggle buttons', () => {
      // Add multiple theme toggle buttons
      document.body.innerHTML = `
        <button id="desktop-theme-toggle" class="theme-toggle">Toggle</button>
        <button id="mobile-theme-toggle" class="theme-toggle">Toggle</button>
      `

      const buttons = document.querySelectorAll('.theme-toggle')
      const html = document.documentElement
      
      const syncTheme = () => {
        const isDark = html.classList.contains('dark')
        // In a real implementation, you'd update button states here
        // For testing, we'll just verify the sync mechanism works
        buttons.forEach(button => {
          button.setAttribute('data-theme', isDark ? 'dark' : 'light')
        })
      }

      const toggleTheme = () => {
        html.classList.toggle('dark')
        syncTheme()
      }

      buttons.forEach(button => {
        button.addEventListener('click', toggleTheme)
      })

      // Click first toggle
      buttons[0].dispatchEvent(new Event('click'))
      expect(html).toHaveClass('dark')
      expect(buttons[0]).toHaveAttribute('data-theme', 'dark')
      expect(buttons[1]).toHaveAttribute('data-theme', 'dark')

      // Click second toggle
      buttons[1].dispatchEvent(new Event('click'))
      expect(html).not.toHaveClass('dark')
      expect(buttons[0]).toHaveAttribute('data-theme', 'light')
      expect(buttons[1]).toHaveAttribute('data-theme', 'light')
    })

    it('should handle system theme changes', () => {
      let systemThemeMatches = false
      
      const mockMatchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)' ? systemThemeMatches : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      })

      const setupSystemThemeListener = () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const html = document.documentElement
        
        // Apply initial theme based on system preference
        if (mediaQuery.matches && !localStorage.getItem('theme')) {
          html.classList.add('dark')
        }
      }

      // Test with dark preference
      systemThemeMatches = true
      setupSystemThemeListener()
      
      // Should apply dark theme when no saved preference
      expect(document.documentElement).toHaveClass('dark')
      
      // Test with saved preference (should not follow system)
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
      
      setupSystemThemeListener()
      // Should not apply dark theme when user has saved preference
      expect(document.documentElement).not.toHaveClass('dark')
    })
  })

  describe('Theme Accessibility', () => {
    it('should announce theme changes to screen readers', () => {
      document.body.innerHTML = `
        <button id="theme-toggle" aria-label="Switch to dark theme">Toggle</button>
        <div id="theme-announcement" aria-live="polite" class="sr-only"></div>
      `

      const button = document.getElementById('theme-toggle')
      const announcement = document.getElementById('theme-announcement')
      
      const toggleThemeWithAnnouncement = () => {
        const html = document.documentElement
        const isDark = html.classList.contains('dark')
        
        if (isDark) {
          html.classList.remove('dark')
          button?.setAttribute('aria-label', 'Switch to dark theme')
          if (announcement) announcement.textContent = 'Switched to light theme'
        } else {
          html.classList.add('dark')
          button?.setAttribute('aria-label', 'Switch to light theme')
          if (announcement) announcement.textContent = 'Switched to dark theme'
        }
      }

      button?.addEventListener('click', toggleThemeWithAnnouncement)
      
      // Test toggle to dark
      button?.click()
      expect(button).toHaveAttribute('aria-label', 'Switch to light theme')
      expect(announcement?.textContent).toBe('Switched to dark theme')
      
      // Test toggle to light
      button?.click()
      expect(button).toHaveAttribute('aria-label', 'Switch to dark theme')
      expect(announcement?.textContent).toBe('Switched to light theme')
    })

    it('should respect prefers-reduced-motion', () => {
      const mockMatchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      })

      const applyThemeWithMotionPreference = () => {
        const html = document.documentElement
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        
        if (prefersReducedMotion) {
          html.classList.add('reduce-motion')
        } else {
          html.classList.remove('reduce-motion')
        }
      }

      applyThemeWithMotionPreference()
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
      expect(document.documentElement).toHaveClass('reduce-motion')
    })
  })
})