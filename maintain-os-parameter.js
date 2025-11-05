/**
 * maintain-os-parameter.js
 *
 * Maintains the ?os=apple parameter during navigation in iOS app
 *
 * Usage: Include this script in your web app's HTML:
 * <script src="/maintain-os-parameter.js"></script>
 */

(function() {
    'use strict';

    console.log('[OS Param] Script loaded');

    // Get OS parameter from URL
    function getOSParameter() {
        const params = new URLSearchParams(window.location.search);
        return params.get('os');
    }

    // Add os parameter to URL
    function addOSParameter(url, osValue) {
        if (!url || !osValue) return url;

        try {
            // Handle relative URLs
            const urlObj = new URL(url, window.location.origin);

            // Only modify my-coach-finder.com URLs
            if (!urlObj.host.includes('my-coach-finder.com')) {
                return url;
            }

            // Don't add if already has os parameter
            if (urlObj.searchParams.has('os')) {
                return url;
            }

            urlObj.searchParams.set('os', osValue);
            const newUrl = urlObj.toString();

            console.log('[OS Param] Modified URL:', url, '→', newUrl);
            return newUrl;
        } catch (e) {
            // Fallback for URLs that can't be parsed
            console.warn('[OS Param] Could not parse URL:', url, e);
            return url;
        }
    }

    // Get and store os parameter
    const osValue = getOSParameter();

    if (!osValue) {
        console.log('[OS Param] No os parameter detected');
        return;
    }

    console.log('[OS Param] Detected native app mode:', osValue);

    // Store in sessionStorage
    try {
        sessionStorage.setItem('os_parameter', osValue);
    } catch (e) {
        console.warn('[OS Param] Could not save to sessionStorage:', e);
    }

    // Expose helper function globally
    window.preserveOSParam = function(url) {
        return addOSParameter(url, osValue);
    };

    // Intercept all link clicks
    document.addEventListener('click', function(e) {
        let el = e.target;

        // Find the <a> element (in case user clicked a child element)
        for (let i = 0; i < 10 && el; i++) {
            if (el.tagName === 'A' && el.href) {
                const newHref = addOSParameter(el.href, osValue);

                if (newHref !== el.href) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[OS Param] Intercepted link click');
                    window.location.href = newHref;
                    return false;
                }
                break;
            }
            el = el.parentElement;
        }
    }, true); // Use capture phase

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

    // Check if current page is missing the parameter
    if (!window.location.search.includes('os=' + osValue)) {
        console.warn('[OS Param] Parameter missing from current URL');

        // Only redirect if we're on my-coach-finder.com
        if (window.location.host.includes('my-coach-finder.com')) {
            console.log('[OS Param] Redirecting to add parameter...');
            const newUrl = addOSParameter(window.location.href, osValue);
            if (newUrl !== window.location.href) {
                window.location.replace(newUrl);
            }
        }
    }

    console.log('[OS Param] Maintenance active - parameter will persist during navigation');

})();
