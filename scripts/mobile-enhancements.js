/* eslint-env browser */
/* eslint-disable no-unused-vars */
// Mobile enhancement script for better touch experience
(function() {
    'use strict';

    // Check if device is touch-capable
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) return;

    // Add touch class to document
    document.documentElement.classList.add('touch-device');

    // Swipe gesture handler
    class SwipeHandler {
        constructor(element, options = {}) {
            this.element = element;
            this.threshold = options.threshold || 50;
            this.restraint = options.restraint || 100;
            this.allowedTime = options.allowedTime || 300;
            this.startX = 0;
            this.startY = 0;
            this.distX = 0;
            this.distY = 0;
            this.startTime = 0;
            this.elapsedTime = 0;

            this.init();
        }

        init() {
            this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        }

        handleTouchStart(e) {
            const touchObj = e.changedTouches[0];
            this.startX = touchObj.pageX;
            this.startY = touchObj.pageY;
            this.startTime = new Date().getTime();
        }

        handleTouchEnd(e) {
            const touchObj = e.changedTouches[0];
            this.distX = touchObj.pageX - this.startX;
            this.distY = touchObj.pageY - this.startY;
            this.elapsedTime = new Date().getTime() - this.startTime;

            if (this.elapsedTime <= this.allowedTime) {
                if (Math.abs(this.distX) >= this.threshold && Math.abs(this.distY) <= this.restraint) {
                    const direction = this.distX < 0 ? 'left' : 'right';
                    this.triggerSwipe(direction);
                }
            }
        }

        triggerSwipe(direction) {
            const event = new CustomEvent('swipe', {
                detail: { direction, element: this.element }
            });
            this.element.dispatchEvent(event);
        }
    }

    // Initialize mobile enhancements when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initMobileEnhancements();
    });

    function initMobileEnhancements() {
        // Add viewport height fix for mobile browsers
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);

        // Enhanced button feedback
        addButtonFeedback();

        // Swipe to close modals
        addSwipeToCloseModals();

        // Pull to refresh prevention
        preventPullToRefresh();

        // Enhanced form interactions
        enhanceFormInputs();

        // Smooth scroll enhancements
        enhanceScrolling();
    }

    // Fix viewport height on mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Add haptic feedback for buttons (if available)
    function addButtonFeedback() {
        const buttons = document.querySelectorAll('button, [role="button"], a');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                // Add visual feedback
                this.classList.add('touch-feedback');
                
                // Haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }, { passive: true });

            button.addEventListener('touchend', function() {
                // Remove visual feedback after delay
                setTimeout(() => {
                    this.classList.remove('touch-feedback');
                }, 150);
            }, { passive: true });
        });
    }

    // Add swipe to close for modals
    function addSwipeToCloseModals() {
        const modals = document.querySelectorAll('[role="dialog"], .modal');
        
        modals.forEach(modal => {
            new SwipeHandler(modal);
            
            modal.addEventListener('swipe', function(e) {
                if (e.detail.direction === 'right') {
                    // Close modal on right swipe
                    const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"], .close');
                    if (closeButton) {
                        closeButton.click();
                    }
                }
            });
        });
    }

    // Prevent accidental pull-to-refresh
    function preventPullToRefresh() {
        let startY = 0;
        
        document.addEventListener('touchstart', function(e) {
            startY = e.touches[0].pageY;
        }, { passive: true });

        document.addEventListener('touchmove', function(e) {
            if (window.scrollY === 0 && e.touches[0].pageY > startY) {
                // Only prevent if we're at the top and pulling down
                if (e.touches[0].pageY - startY > 10) {
                    e.preventDefault();
                }
            }
        });
    }

    // Enhance form inputs for mobile
    function enhanceFormInputs() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add mobile-friendly attributes
            if (input.type === 'email') {
                input.setAttribute('autocapitalize', 'none');
                input.setAttribute('autocorrect', 'off');
            }
            
            if (input.type === 'search') {
                input.setAttribute('autocapitalize', 'none');
                input.setAttribute('autocomplete', 'off');
                input.setAttribute('autocorrect', 'off');
            }

            // Fix input zoom on iOS
            if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                const currentFontSize = window.getComputedStyle(input).fontSize;
                if (parseFloat(currentFontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            }
        });
    }

    // Enhanced scrolling for mobile
    function enhanceScrolling() {
        // Add momentum scrolling to scrollable elements
        const scrollableElements = document.querySelectorAll('.overflow-auto, .overflow-y-auto, .overflow-x-auto');
        
        scrollableElements.forEach(element => {
            element.style.WebkitOverflowScrolling = 'touch';
        });

        // Smooth scroll to top functionality
        const scrollToTopElements = document.querySelectorAll('[onclick*="scrollTo"]');
        
        scrollToTopElements.forEach(element => {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Add CSS for touch feedback
    const style = document.createElement('style');
    style.textContent = `
        .touch-feedback {
            transform: scale(0.98);
            opacity: 0.8;
            transition: all 0.1s ease;
        }
        
        .touch-device .hover\\:scale-105:hover {
            transform: none;
        }
        
        .touch-device .hover\\:scale-110:hover {
            transform: none;
        }
        
        /* Fix for iOS safe area */
        @supports (padding: max(0px)) {
            .touch-device body {
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
            }
            
            .touch-device header {
                padding-top: env(safe-area-inset-top);
            }
        }
        
        /* Better touch targets */
        .touch-device button,
        .touch-device a,
        .touch-device [role="button"] {
            min-height: 48px;
            min-width: 48px;
        }
        
        /* Disable hover effects on touch */
        @media (hover: none) {
            .hover\\:bg-gray-50:hover {
                background-color: inherit;
            }
            
            .hover\\:bg-gray-100:hover {
                background-color: inherit;
            }
            
            .hover\\:text-primary-600:hover {
                color: inherit;
            }
        }
    `;
    
    document.head.appendChild(style);

    // Expose SwipeHandler for external use
    window.SwipeHandler = SwipeHandler;
})();