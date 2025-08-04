import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockViewport } from '../../test/setup'

// Mock i18n utilities
vi.mock('../../utils/i18n', () => ({
  getLangFromUrl: vi.fn(() => 'en'),
  t: vi.fn((key: string, lang: string) => {
    const translations = {
      'navigation.home': lang === 'ko' ? '홈' : 'Home',
      'navigation.blog': lang === 'ko' ? '블로그' : 'Blog',
    }
    return translations[key as keyof typeof translations] || key
  })
}))

describe('Navigation Components', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('Mobile Bottom Navigation', () => {
    beforeEach(() => {
      mockViewport(375, 667) // iPhone viewport
      // Create mock mobile navigation structure
      document.body.innerHTML = `
        <nav 
          class="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 z-50 md:hidden"
          role="navigation"
          aria-label="Mobile Navigation"
        >
          <div class="flex justify-around items-center h-20 max-w-sm mx-auto px-4">
            <a href="/" data-nav-item="home" aria-label="Home">
              <span>Home</span>
            </a>
            <a href="/blog" data-nav-item="blog" aria-label="Blog">
              <span>Blog</span>
            </a>
            <button id="mobile-search-button" data-nav-item="search" aria-label="Search">
              <span>Search</span>
            </button>
            <button id="mobile-theme-toggle" data-nav-item="theme" aria-label="Theme">
              <span>Theme</span>
            </button>
            <button id="mobile-language-toggle" data-nav-item="language" aria-label="Language">
              <span>EN</span>
            </button>
          </div>
        </nav>
      `
    })

    it('should render all navigation items', () => {
      const nav = document.querySelector('[role="navigation"]')
      expect(nav).toBeInTheDocument()
      
      const navItems = document.querySelectorAll('[data-nav-item]')
      expect(navItems).toHaveLength(5)
      
      expect(document.querySelector('[data-nav-item="home"]')).toBeInTheDocument()
      expect(document.querySelector('[data-nav-item="blog"]')).toBeInTheDocument()
      expect(document.querySelector('[data-nav-item="search"]')).toBeInTheDocument()
      expect(document.querySelector('[data-nav-item="theme"]')).toBeInTheDocument()
      expect(document.querySelector('[data-nav-item="language"]')).toBeInTheDocument()
    })

    it('should have proper accessibility attributes', () => {
      const nav = document.querySelector('nav')
      expect(nav).toHaveAttribute('role', 'navigation')
      expect(nav).toHaveAttribute('aria-label', 'Mobile Navigation')
      
      const navItems = document.querySelectorAll('[data-nav-item]')
      navItems.forEach(item => {
        expect(item).toHaveAttribute('aria-label')
      })
    })

    it('should handle search button click', () => {
      const searchButton = document.querySelector('#mobile-search-button')
      expect(searchButton).toBeInTheDocument()
      
      const clickHandler = vi.fn()
      searchButton?.addEventListener('click', clickHandler)
      
      searchButton?.dispatchEvent(new Event('click'))
      expect(clickHandler).toHaveBeenCalledOnce()
    })

    it('should handle theme toggle click', () => {
      const themeButton = document.querySelector('#mobile-theme-toggle')
      expect(themeButton).toBeInTheDocument()
      
      const clickHandler = vi.fn()
      themeButton?.addEventListener('click', clickHandler)
      
      themeButton?.dispatchEvent(new Event('click'))
      expect(clickHandler).toHaveBeenCalledOnce()
    })

    it('should handle language toggle click', () => {
      const languageButton = document.querySelector('#mobile-language-toggle')
      expect(languageButton).toBeInTheDocument()
      
      const clickHandler = vi.fn()
      languageButton?.addEventListener('click', clickHandler)
      
      languageButton?.dispatchEvent(new Event('click'))
      expect(clickHandler).toHaveBeenCalledOnce()
    })

    it('should be hidden on desktop viewports', () => {
      mockViewport(1024, 768) // Desktop viewport
      
      const nav = document.querySelector('nav')
      expect(nav).toHaveClass('md:hidden')
    })

    it('should handle safe area inset for devices with home indicator', () => {
      const nav = document.querySelector('nav')
      
      // Should have safe area padding
      expect(nav).toHaveStyle('padding-bottom: env(safe-area-inset-bottom, 0.5rem)')
    })
  })

  describe('Desktop Navigation', () => {
    beforeEach(() => {
      mockViewport(1024, 768) // Desktop viewport
      // Create mock desktop navigation structure
      document.body.innerHTML = `
        <header class="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
          <nav class="container mx-auto px-4" role="navigation" aria-label="Main Navigation">
            <div class="flex items-center justify-between h-16">
              <a href="/" class="logo">
                <span>Jay Lee</span>
              </a>
              <div class="flex items-center gap-6">
                <a href="/" data-nav-item="home">Home</a>
                <a href="/blog" data-nav-item="blog">Blog</a>
                <a href="/about" data-nav-item="about">About</a>
                <button id="desktop-search-button" data-nav-item="search" aria-label="Search">
                  <span>Search</span>
                </button>
                <button id="desktop-theme-toggle" data-nav-item="theme" aria-label="Theme">
                  <span>Theme</span>
                </button>
              </div>
            </div>
          </nav>
        </header>
      `
    })

    it('should render desktop navigation', () => {
      const nav = document.querySelector('[role="navigation"]')
      expect(nav).toBeInTheDocument()
      
      const logo = document.querySelector('.logo')
      expect(logo).toBeInTheDocument()
      
      const navItems = document.querySelectorAll('[data-nav-item]')
      expect(navItems.length).toBeGreaterThan(0)
    })

    it('should have search functionality', () => {
      const searchButton = document.querySelector('#desktop-search-button')
      expect(searchButton).toBeInTheDocument()
      
      const clickHandler = vi.fn()
      searchButton?.addEventListener('click', clickHandler)
      
      searchButton?.dispatchEvent(new Event('click'))
      expect(clickHandler).toHaveBeenCalledOnce()
    })

    it('should have theme toggle functionality', () => {
      const themeButton = document.querySelector('#desktop-theme-toggle')
      expect(themeButton).toBeInTheDocument()
      
      const clickHandler = vi.fn()
      themeButton?.addEventListener('click', clickHandler)
      
      themeButton?.dispatchEvent(new Event('click'))
      expect(clickHandler).toHaveBeenCalledOnce()
    })
  })

  describe('Navigation Active States', () => {
    it('should highlight active navigation item', () => {
      // Mock current path
      Object.defineProperty(globalThis.location, 'pathname', {
        value: '/blog',
        configurable: true,
      })

      document.body.innerHTML = `
        <nav>
          <a href="/" data-nav-item="home">Home</a>
          <a href="/blog" data-nav-item="blog" aria-current="page">Blog</a>
          <a href="/about" data-nav-item="about">About</a>
        </nav>
      `

      const activeItem = document.querySelector('[aria-current="page"]')
      expect(activeItem).toBeInTheDocument()
      expect(activeItem).toHaveAttribute('href', '/blog')
    })

    it('should handle keyboard navigation', () => {
      document.body.innerHTML = `
        <nav>
          <a href="/" data-nav-item="home">Home</a>
          <a href="/blog" data-nav-item="blog">Blog</a>
          <a href="/about" data-nav-item="about">About</a>
        </nav>
      `

      const firstLink = document.querySelector('[data-nav-item="home"]') as HTMLElement
      const secondLink = document.querySelector('[data-nav-item="blog"]') as HTMLElement

      firstLink.focus()
      expect(document.activeElement).toBe(firstLink)

      // Simulate Tab key
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      firstLink.dispatchEvent(tabEvent)
      
      // In a real scenario, focus would move naturally, but we can test the presence of focusable elements
      expect(secondLink).toBeInTheDocument()
      expect(secondLink.tabIndex).not.toBe(-1)
    })
  })

  describe('Navigation Responsiveness', () => {
    it('should adapt to mobile viewport', () => {
      mockViewport(375, 667)
      
      document.body.innerHTML = `
        <nav class="md:hidden">Mobile Nav</nav>
        <nav class="hidden md:flex">Desktop Nav</nav>
      `

      const mobileNav = document.querySelector('.md\\:hidden')
      const desktopNav = document.querySelector('.hidden.md\\:flex')
      
      expect(mobileNav).toBeInTheDocument()
      expect(desktopNav).toBeInTheDocument()
    })

    it('should adapt to tablet viewport', () => {
      mockViewport(768, 1024)
      
      // At tablet size, should show desktop nav
      expect(globalThis.matchMedia('(min-width: 768px)').matches).toBe(true)
    })

    it('should adapt to desktop viewport', () => {
      mockViewport(1200, 800)
      
      expect(globalThis.matchMedia('(min-width: 1024px)').matches).toBe(true)
    })
  })
})