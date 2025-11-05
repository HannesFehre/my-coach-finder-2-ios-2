# My-Coach-Finder iOS App (Clean Build)

This is a clean, from-scratch implementation of the My-Coach-Finder iOS app using Capacitor 6.

## Features

- **Native WebView**: Loads https://app.my-coach-finder.com/go with automatic `?os=apple` parameter injection
- **Native Google Sign-In**: Integrated Google authentication using @codetrix-studio/capacitor-google-auth
- **Automatic URL Parameter Injection**: All my-coach-finder.com URLs automatically get `?os=apple` added
- **Clean Architecture**: No legacy code or unused dependencies

## App Configuration

- **Bundle ID**: MyCoachFinder
- **App Name**: My-Coach-Finder
- **Version**: 1.1.13
- **Google Client ID**: 353309305721-ir55d3eiiucm5fda67gsn9gscd8eq146.apps.googleusercontent.com

## Project Structure

```
appel_2/
├── www/
│   └── index.html          # Main HTML file with os=apple injection logic
├── ios/
│   └── App/                # Native iOS Xcode project
├── capacitor.config.json   # Capacitor configuration
├── package.json            # NPM dependencies
├── *.mobileprovision       # Provisioning profiles (for signing)
├── *.p12                   # Development certificate
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Xcode (v13 or higher)
- CocoaPods (for iOS dependencies)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install iOS CocoaPods dependencies:
```bash
cd ios/App
pod install
cd ../..
```

3. Open the project in Xcode:
```bash
npm run ios
```
or
```bash
npx cap open ios
```

## Google Sign-In Integration

The app listens for Google Sign-In requests from the web app via `postMessage`:

```javascript
// From web app - trigger native Google Sign-In
window.postMessage({ type: 'GOOGLE_SIGN_IN' }, '*');

// Listen for response
window.addEventListener('message', (event) => {
  if (event.data.type === 'GOOGLE_SIGN_IN_SUCCESS') {
    const user = event.data.data;
    // Handle successful login
  } else if (event.data.type === 'GOOGLE_SIGN_IN_ERROR') {
    // Handle error
  }
});
```

## URL Parameter Injection

All navigation to my-coach-finder.com URLs automatically adds `?os=apple`:

- `https://app.my-coach-finder.com/go` → `https://app.my-coach-finder.com/go?os=apple`
- `https://my-coach-finder.com/page` → `https://my-coach-finder.com/page?os=apple`
- Already has parameter: `https://app.my-coach-finder.com/go?foo=bar` → `https://app.my-coach-finder.com/go?foo=bar&os=apple`

This is implemented in `www/index.html` using JavaScript URL interception.

## Git Setup

The project is initialized with git and ready to push:

```bash
# The repository is already initialized and committed
# To push to GitHub (requires authentication):
git push -u origin main
```

Or use GitHub CLI:
```bash
gh auth login
git push -u origin main
```

Repository: https://github.com/HannesFehre/my-coach-finder-2-ios-2

## CodeMagic CI/CD

This app is configured to work with CodeMagic for automated builds and App Store distribution:

- Certificates and provisioning profiles are included in the repository
- Bundle ID matches the existing app (MyCoachFinder)
- App icons and assets are configured

### CodeMagic Configuration

1. Connect your GitHub repository (https://github.com/HannesFehre/my-coach-finder-2-ios-2)
2. Upload the certificates and provisioning profiles to CodeMagic
3. Configure build settings:
   - Xcode version: Latest stable
   - Build command: `npx cap sync ios && cd ios/App && pod install`
   - Archive path: `ios/App/App.xcworkspace`

## Building for Production

1. Update version in `package.json` and sync:
```bash
npm version patch  # or minor, major
npx cap sync ios
```

2. Build in Xcode:
   - Select "Any iOS Device" as target
   - Product → Archive
   - Upload to App Store Connect

## Differences from Old App

This is a **clean, minimal implementation** with:

- ✅ No legacy code or unused plugins
- ✅ Modern Capacitor 6 setup
- ✅ Simplified JavaScript-based URL parameter injection
- ✅ Direct Google Auth plugin integration
- ✅ Clean project structure
- ✅ Same bundle ID, certificates, and app icons as the original

## Troubleshooting

### Google Sign-In not working

1. Verify the iOS Client ID in `capacitor.config.json`
2. Check URL scheme in `ios/App/App/Info.plist` (should be `com.googleusercontent.apps.353309305721-ir55d3eiiucm5fda67gsn9gscd8eq146`)
3. Ensure CocoaPods dependencies are installed (`pod install`)

### os=apple parameter not being added

1. Check browser console for logs (filter for `[App]`)
2. Verify the URL is a my-coach-finder.com domain
3. Check that the JavaScript in `www/index.html` is loaded

## License

ISC
