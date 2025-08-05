/* eslint-env serviceworker */
/* eslint-disable no-console, no-undef */
/* global self, caches, fetch, URL */

// Service Worker for Jay's Blog
// Provides offline functionality and caching

const STATIC_CACHE = 'jay-blog-static-v1';
const DYNAMIC_CACHE = 'jay-blog-dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/about',
  '/blog',
  '/en',
  '/en/about',
  '/en/blog',
  // Add critical CSS and JS files
  // Note: Astro generates these files, paths may need adjustment
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error('[SW] Error caching static files:', error);
      })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Remove old caches
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName.startsWith('jay-blog-');
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
  );
  
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except fonts and common CDN resources)
  if (url.origin !== self.location.origin) {
    // Cache Google Fonts and other external resources
    if (url.hostname === 'fonts.googleapis.com' || 
        url.hostname === 'fonts.gstatic.com' ||
        url.hostname === 'cdn.jsdelivr.net') {
      event.respondWith(cacheFirstStrategy(request));
    }
    return;
  }
  
  // Handle different types of requests
  if (request.destination === 'document') {
    // HTML documents - Network first, cache fallback
    event.respondWith(networkFirstStrategy(request));
  } else if (request.destination === 'image') {
    // Images - Cache first, network fallback
    event.respondWith(cacheFirstStrategy(request));
  } else if (request.destination === 'script' || request.destination === 'style') {
    // JS/CSS - Cache first with network update
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else {
    // Other resources - Cache first
    event.respondWith(cacheFirstStrategy(request));
  }
});

// Network first strategy - for HTML pages
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[SW] Network failed, trying cache for:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page if available
    if (request.destination === 'document') {
      const offlinePage = await caches.match('/offline');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    throw error;
  }
}

// Cache first strategy - for assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first strategy failed for:', request.url, error);
    throw error;
  }
}

// Stale while revalidate strategy - for JS/CSS
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.error('[SW] Network request failed:', request.url, error);
    });
  
  // Return cached version immediately if available
  return cachedResponse || networkPromise;
}

// Background sync for form submissions (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-form') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle form submissions when back online
  console.log('[SW] Background sync triggered');
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-96x96.png',
      tag: 'jay-blog-notification',
      renotify: true
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.openWindow('/')
  );
});

// Cache management - clean up old entries
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    event.waitUntil(updateCache());
  }
});

async function updateCache() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const keys = await cache.keys();
  
  // Remove entries older than 7 days
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const dateHeader = response.headers.get('date');
      if (dateHeader) {
        const responseDate = new Date(dateHeader).getTime();
        if (responseDate < oneWeekAgo) {
          await cache.delete(request);
        }
      }
    }
  }
}

console.log('[SW] Service Worker loaded');