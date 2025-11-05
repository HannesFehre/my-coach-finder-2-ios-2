# Web App Integration - Maintaining `?os=apple` Parameter

## 🎯 The Problem

The iOS app sends `?os=apple` in the initial request, but it gets lost during navigation:

```javascript
// Initial load from iOS app
https://app.my-coach-finder.com/go?os=apple ✅

// User navigates in your web app
window.location.href = '/auth/login';  // ❌ Parameter lost!
// Result: https://app.my-coach-finder.com/auth/login (no os=apple)
```

## ✅ The Solution

You need to **preserve the parameter** during all navigation in your web app.

### Option 1: Include the Maintenance Script (Automatic) ⭐ RECOMMENDED

Add this script to your web app's HTML (in the `<head>` or before `</body>`):

```html
<script src="/maintain-os-parameter.js"></script>
```

**What it does:**
- ✅ Automatically adds `?os=apple` to all link clicks
- ✅ Intercepts `history.pushState` and `history.replaceState`
- ✅ Intercepts `fetch()` requests
- ✅ Works with SPAs (React, Vue, etc.)
- ✅ No code changes needed!

**Copy the file:**
The script is in the iOS app repo: `/home/liz/Desktop/Module/MyCoachFinder/app/appel_2/maintain-os-parameter.js`

Deploy it to your web app's public folder.

### Option 2: Update Navigation Code (Manual)

If you can't include the script, update your navigation code:

#### ❌ Before (Parameter gets lost)

```javascript
// Direct navigation
window.location.href = '/auth/login';

// Link creation
<a href="/profile">Profile</a>

// fetch requests
fetch('/api/user');

// React Router
navigate('/dashboard');
```

#### ✅ After (Parameter preserved)

```javascript
// Helper function
function preserveParams(url) {
    const params = new URLSearchParams(window.location.search);
    const separator = url.includes('?') ? '&' : '?';
    return url + separator + params.toString();
}

// Direct navigation
window.location.href = preserveParams('/auth/login');

// Link creation
<a href={preserveParams('/profile')}>Profile</a>

// fetch requests
fetch(preserveParams('/api/user'));

// React Router
navigate(preserveParams('/dashboard'));
```

#### React Example

```javascript
// Create a hook
function usePreserveParams() {
    const location = useLocation();

    return (url) => {
        const search = location.search;
        const separator = url.includes('?') ? '&' : '?';
        return url + separator + search.substring(1);
    };
}

// Use in components
function MyComponent() {
    const preserveParams = usePreserveParams();

    const handleClick = () => {
        navigate(preserveParams('/dashboard'));
    };

    return <a href={preserveParams('/profile')}>Profile</a>;
}
```

#### Vue Example

```javascript
// Create a mixin or composable
export function usePreserveParams() {
    const route = useRoute();

    return (url) => {
        const search = new URLSearchParams(route.query).toString();
        const separator = url.includes('?') ? '&' : '?';
        return url + separator + search;
    };
}

// Use in components
const preserveParams = usePreserveParams();
router.push(preserveParams('/dashboard'));
```

## 🧪 Testing

### 1. Check Initial Load

Open Safari Web Inspector:
```javascript
console.log(window.location.search);  // Should show: ?os=apple
```

### 2. Check After Navigation

Navigate to another page:
```javascript
console.log(window.location.search);  // Should still show: ?os=apple
```

### 3. Check in Backend (FastAPI)

```python
@app.get("/any-route")
async def any_route(os: str = None):
    print(f"OS parameter: {os}")  # Should print: "apple"
    return {"os": os}
```

### 4. Check in nginx

```nginx
location / {
    if ($arg_os = "apple") {
        add_header X-Platform "iOS-App";
    }
    # Check response headers
}
```

## 📊 Detection Methods

### In JavaScript

```javascript
// Check if running in iOS app
const urlParams = new URLSearchParams(window.location.search);
const isIOSApp = urlParams.get('os') === 'apple';

if (isIOSApp) {
    console.log('Running in iOS app!');
    // Show iOS-specific UI
    // Enable native features
}
```

### In FastAPI

```python
from fastapi import Request

def is_ios_app(request: Request) -> bool:
    return request.query_params.get('os') == 'apple'

@app.get("/")
async def root(request: Request):
    if is_ios_app(request):
        return {"message": "iOS app detected!"}
    return {"message": "Web browser"}
```

### In nginx

```nginx
map $arg_os $is_ios_app {
    default 0;
    "apple" 1;
}

server {
    location / {
        if ($is_ios_app) {
            # iOS app-specific logic
        }
    }
}
```

## 🚨 Common Issues

### Issue 1: Parameter disappears after first navigation

**Cause**: Your web app code doesn't preserve URL parameters

**Fix**: Use Option 1 (include maintain-os-parameter.js) or Option 2 (update navigation code)

### Issue 2: Form submissions lose parameter

**Cause**: HTML forms don't preserve query parameters by default

**Fix**: Add hidden input field

```html
<form action="/login" method="GET">
    <!-- Add this -->
    <input type="hidden" name="os" value="apple" id="os-param">

    <input type="text" name="username">
    <button type="submit">Login</button>
</form>

<script>
// Set the value from URL
const params = new URLSearchParams(window.location.search);
const osParam = document.getElementById('os-param');
if (osParam && params.has('os')) {
    osParam.value = params.get('os');
}
</script>
```

### Issue 3: AJAX/fetch requests don't include parameter

**Fix**: Update all fetch calls

```javascript
// Before
fetch('/api/user');

// After
const params = new URLSearchParams(window.location.search);
fetch('/api/user?' + params.toString());
```

Or use the maintain-os-parameter.js script (it intercepts fetch automatically).

### Issue 4: Redirect removes parameter

**Cause**: Server-side redirects don't preserve query parameters

**Fix**: Update server redirects

**FastAPI:**
```python
from fastapi.responses import RedirectResponse

@app.get("/old-path")
async def redirect(request: Request):
    # Preserve query parameters
    query_string = str(request.url.query)
    new_url = f"/new-path?{query_string}" if query_string else "/new-path"
    return RedirectResponse(url=new_url)
```

**nginx:**
```nginx
location /old-path {
    return 301 /new-path$is_args$args;  # Preserves query params
}
```

## 📁 Files Provided

```
maintain-os-parameter.js       # ⭐ Include this in your web app
WEB_APP_INTEGRATION.md        # This file
```

## 🎯 Recommendation

**Use Option 1** (include maintain-os-parameter.js) because:

✅ No code changes needed
✅ Works automatically
✅ Handles all navigation types
✅ Works with any framework
✅ Easier to maintain

Just add one line to your HTML:
```html
<script src="/maintain-os-parameter.js"></script>
```

## ✅ Checklist

After integrating the parameter preservation:

- [ ] Initial load has `?os=apple`
- [ ] Link clicks preserve `?os=apple`
- [ ] Browser back/forward preserves `?os=apple`
- [ ] Form submissions preserve `?os=apple`
- [ ] fetch/AJAX requests preserve `?os=apple`
- [ ] Server redirects preserve `?os=apple`
- [ ] FastAPI receives `os=apple` parameter
- [ ] nginx detects `$arg_os=apple`
- [ ] JavaScript can read `os=apple` from URL

## 🚀 Summary

1. **iOS app** sends initial request with `?os=apple` ✅
2. **Your web app** must preserve it during navigation ⚠️
3. **Use maintain-os-parameter.js** for automatic preservation ⭐
4. **Test thoroughly** to ensure it works everywhere ✅

The iOS app is doing its job correctly. Now the web app needs to maintain the parameter during navigation!
