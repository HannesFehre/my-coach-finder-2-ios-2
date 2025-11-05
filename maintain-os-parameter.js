/**
 * maintain-os-parameter.js
 *
 * Add this script to your web app to maintain the ?os=apple parameter
 * during all navigation. This ensures FastAPI, nginx, and JavaScript
 * can always detect the iOS app.
 *
 * Usage: Include this script in your web app's HTML:
 * <script src="maintain-os-parameter.js"></script>
 */

(function() {
    'use strict';

    console.log('[OS Parameter] Maintenance script loaded');

    // Get current os parameter
    function getOSParameter() {
        const params = new URLSearchParams(window.location.search);
        return params.get('os');
    }

    // Add os parameter to URL
    function addOSParameter(url, osValue) {
        if (!url || !osValue) return url;

        try {
            const urlObj = new URL(url, window.location.origin);

            // Only add to same-origin or my-coach-finder.com URLs
            if (!urlObj.host.includes('my-coach-finder.com')) {
                return url;
            }

            // Don't add if already exists
            if (urlObj.searchParams.has('os')) {
                return url;
            }

            urlObj.searchParams.set('os', osValue);
            return urlObj.toString();
        } catch (e) {
            // If URL parsing fails, try string manipulation
            if (url.includes('?')) {
                return url + '&os=' + osValue;
            } else {
                return url + '?os=' + osValue;
            }
        }
    }

    // Store the os parameter value
    const osValue = getOSParameter();

    if (!osValue) {
        console.log('[OS Parameter] No os parameter found in URL');
        return;
    }

    console.log('[OS Parameter] Detected os=' + osValue);

    // Store in sessionStorage for persistence
    try {
        sessionStorage.setItem('os_parameter', osValue);
    } catch (e) {
        console.warn('[OS Parameter] Could not save to sessionStorage:', e);
    }

    // Intercept all link clicks
    document.addEventListener('click', function(e) {
        let el = e.target;

        // Traverse up to find <a> tag
        for (let i = 0; i < 10 && el; i++) {
            if (el.tagName === 'A' && el.href) {
                const newHref = addOSParameter(el.href, osValue);
                if (newHref !== el.href) {
                    e.preventDefault();
                    window.location.href = newHref;
                    console.log('[OS Parameter] Redirected with parameter:', newHref);
                    return;
                }
            }
            el = el.parentElement;
        }
    }, true);

    // Intercept history.pushState
    const originalPushState = history.pushState;
    history.pushState = function(state, title, url) {
        if (url) {
            url = addOSParameter(url, osValue);
        }
        return originalPushState.call(history, state, title, url);
    };

    // Intercept history.replaceState
    const originalReplaceState = history.replaceState;
    history.replaceState = function(state, title, url) {
        if (url) {
            url = addOSParameter(url, osValue);
        }
        return originalReplaceState.call(history, state, title, url);
    };

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string') {
            url = addOSParameter(url, osValue);
        } else if (url instanceof Request) {
            const newUrl = addOSParameter(url.url, osValue);
            url = new Request(newUrl, url);
        }
        return originalFetch.call(window, url, options);
    };

    // Check current URL has parameter
    if (!window.location.search.includes('os=' + osValue)) {
        console.warn('[OS Parameter] Parameter missing from current URL, redirecting...');
        window.location.href = addOSParameter(window.location.href, osValue);
    }

    console.log('[OS Parameter] Maintenance active - parameter will persist');
})();
