// Enhanced code block functionality
(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeEnhancements);
  } else {
    initCodeEnhancements();
  }

  function initCodeEnhancements() {
    enhanceCodeBlocks();
    addCopyFunctionality();
    addLineNumbering();
    addLanguageLabels();
    setupKeyboardShortcuts();
  }

  function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre.shiki, .code-block-enhanced');
    
    codeBlocks.forEach((block, index) => {
      // Add unique ID if not present
      if (!block.id) {
        block.id = `code-block-${index}`;
      }
      
      // Add wrapper div if not already wrapped
      if (!block.parentElement.classList.contains('code-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper relative';
        block.parentElement.insertBefore(wrapper, block);
        wrapper.appendChild(block);
      }
      
      // Add enhanced class
      block.classList.add('code-block-enhanced');
      
      // Set up intersection observer for analytics
      if (typeof window.gtag !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              window.gtag('event', 'code_block_view', {
                event_category: 'engagement',
                event_label: block.id || 'unknown'
              });
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.5 });
        
        observer.observe(block);
      }
    });
  }

  function addCopyFunctionality() {
    const codeBlocks = document.querySelectorAll('.code-block-enhanced');
    
    codeBlocks.forEach(block => {
      // Skip if copy button already exists
      if (block.querySelector('.copy-button')) return;
      
      const code = getCodeContent(block);
      if (!code.trim()) return;
      
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button absolute top-3 right-3 z-10 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-sm rounded border border-gray-600 transition-all duration-200 opacity-75 hover:opacity-100';
      copyButton.innerHTML = `
        <span class="copy-text flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          Copy
        </span>
        <span class="success-text hidden flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Copied!
        </span>
      `;
      
      copyButton.addEventListener('click', () => copyToClipboard(code, copyButton));
      
      // Add button to block
      const wrapper = block.closest('.code-wrapper') || block.parentElement;
      if (wrapper) {
        wrapper.style.position = 'relative';
        wrapper.appendChild(copyButton);
      }
    });
  }

  function addLineNumbering() {
    const codeBlocks = document.querySelectorAll('.code-block-enhanced:not(.line-numbers-added)');
    
    codeBlocks.forEach(block => {
      const code = block.querySelector('code');
      if (!code) return;
      
      const lines = code.textContent.split('\n');
      if (lines.length <= 1) return;
      
      // Create line numbers container
      const lineNumbers = document.createElement('div');
      lineNumbers.className = 'line-numbers absolute left-0 top-0 bottom-0 w-12 bg-gray-800 border-r border-gray-700 flex flex-col text-gray-500 text-sm font-mono select-none z-5';
      
      lines.forEach((_, index) => {
        if (index === lines.length - 1 && lines[index].trim() === '') return; // Skip empty last line
        
        const lineNumber = document.createElement('div');
        lineNumber.className = 'line-number px-2 py-0 text-right leading-6 h-6';
        lineNumber.textContent = (index + 1).toString();
        lineNumbers.appendChild(lineNumber);
      });
      
      // Add padding to code for line numbers
      code.style.paddingLeft = '3.5rem';
      
      // Add line numbers to wrapper
      const wrapper = block.closest('.code-wrapper') || block.parentElement;
      if (wrapper) {
        wrapper.style.position = 'relative';
        wrapper.appendChild(lineNumbers);
      }
      
      block.classList.add('line-numbers-added');
    });
  }

  function addLanguageLabels() {
    const codeBlocks = document.querySelectorAll('.code-block-enhanced:not(.language-label-added)');
    
    codeBlocks.forEach(block => {
      const code = block.querySelector('code');
      if (!code) return;
      
      // Extract language from class
      const langClass = Array.from(code.classList).find(cls => cls.startsWith('language-'));
      if (!langClass) return;
      
      const language = langClass.replace('language-', '');
      const displayName = getLanguageDisplayName(language);
      
      // Create language label
      const languageLabel = document.createElement('div');
      languageLabel.className = 'language-label absolute top-3 left-3 z-10 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded border border-gray-600 font-medium uppercase tracking-wide';
      languageLabel.textContent = displayName;
      
      // Add label to wrapper
      const wrapper = block.closest('.code-wrapper') || block.parentElement;
      if (wrapper) {
        wrapper.style.position = 'relative';
        wrapper.appendChild(languageLabel);
      }
      
      block.classList.add('language-label-added');
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Shift + C to copy focused code block
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        const focusedElement = document.activeElement;
        const codeBlock = focusedElement.closest('.code-block-enhanced') || 
                         document.querySelector('.code-block-enhanced:hover');
        
        if (codeBlock) {
          e.preventDefault();
          const code = getCodeContent(codeBlock);
          const copyButton = codeBlock.parentElement.querySelector('.copy-button');
          copyToClipboard(code, copyButton);
        }
      }
    });
  }

  function getCodeContent(block) {
    const code = block.querySelector('code');
    if (!code) return '';
    
    // Get text content, preserving line breaks
    return code.textContent || code.innerText || '';
  }

  async function copyToClipboard(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      showCopySuccess(button);
      
      // Track copy event
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'code_copy', {
          event_category: 'engagement',
          event_label: 'copy_button',
          value: text.length
        });
      }
    } catch (err) {
      console.warn('Failed to copy with Clipboard API, trying fallback:', err);
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopySuccess(button);
      } catch (fallbackErr) {
        console.error('Failed to copy code:', fallbackErr);
        showCopyError(button);
      }
    }
  }

  function showCopySuccess(button) {
    if (!button) return;
    
    const copyText = button.querySelector('.copy-text');
    const successText = button.querySelector('.success-text');
    
    if (copyText && successText) {
      copyText.classList.add('hidden');
      successText.classList.remove('hidden');
      button.classList.add('bg-green-600', 'hover:bg-green-500');
      button.classList.remove('bg-gray-700', 'hover:bg-gray-600');
      
      setTimeout(() => {
        copyText.classList.remove('hidden');
        successText.classList.add('hidden');
        button.classList.remove('bg-green-600', 'hover:bg-green-500');
        button.classList.add('bg-gray-700', 'hover:bg-gray-600');
      }, 2000);
    }
  }

  function showCopyError(button) {
    if (!button) return;
    
    const copyText = button.querySelector('.copy-text');
    if (copyText) {
      const originalText = copyText.textContent;
      copyText.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        Failed
      `;
      button.classList.add('bg-red-600', 'hover:bg-red-500');
      button.classList.remove('bg-gray-700', 'hover:bg-gray-600');
      
      setTimeout(() => {
        copyText.textContent = originalText;
        button.classList.remove('bg-red-600', 'hover:bg-red-500');
        button.classList.add('bg-gray-700', 'hover:bg-gray-600');
      }, 2000);
    }
  }

  function getLanguageDisplayName(language) {
    const languageNames = {
      'js': 'JavaScript',
      'javascript': 'JavaScript',
      'ts': 'TypeScript',
      'typescript': 'TypeScript',
      'jsx': 'React JSX',
      'tsx': 'React TSX',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'python': 'Python',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'go': 'Go',
      'rust': 'Rust',
      'php': 'PHP',
      'ruby': 'Ruby',
      'swift': 'Swift',
      'kotlin': 'Kotlin',
      'sql': 'SQL',
      'json': 'JSON',
      'yaml': 'YAML',
      'yml': 'YAML',
      'toml': 'TOML',
      'xml': 'XML',
      'bash': 'Bash',
      'sh': 'Shell',
      'powershell': 'PowerShell',
      'dockerfile': 'Dockerfile',
      'docker': 'Docker',
      'markdown': 'Markdown',
      'md': 'Markdown',
      'text': 'Text',
      'plaintext': 'Plain Text'
    };
    
    return languageNames[language.toLowerCase()] || language.toUpperCase();
  }

  // Expose utilities globally for debugging
  window.codeBlockUtils = {
    enhanceCodeBlocks,
    addCopyFunctionality,
    getCodeContent,
    copyToClipboard
  };
})();