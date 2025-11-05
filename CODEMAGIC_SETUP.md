# CodeMagic CI/CD Setup Guide

## ✅ Configuration File Added

The `codemagic.yaml` file has been added and pushed to the repository!

**Repository**: https://github.com/HannesFehre/my-coach-finder-2-ios-2

## 🚀 Quick Start

1. **Go to CodeMagic**: https://codemagic.io/
2. **Add the repository**: `HannesFehre/my-coach-finder-2-ios-2`
3. **Configure environment variables** (see below)
4. **Run a build!**

## 🔧 Environment Variables Required

### For Development Builds (`ios-development` workflow)

CodeMagic will handle these automatically if you configure signing:

- Bundle ID: `MyCoachFinder`
- Development provisioning profile
- Development certificate

### For Production Builds (`ios-production` workflow)

You need to configure these in CodeMagic:

#### 1. Code Signing (in `ios_signing` group)

- **CM_CERTIFICATE**: Base64-encoded .p12 certificate
- **CM_CERTIFICATE_PASSWORD**: `MyCoachFinder2024` (or your certificate password)
- **CM_PROVISIONING_PROFILE**: Base64-encoded provisioning profile

#### 2. App Store Connect API (for TestFlight/App Store)

- **APP_STORE_CONNECT_PRIVATE_KEY**: Your App Store Connect API private key
- **APP_STORE_CONNECT_KEY_IDENTIFIER**: Key ID
- **APP_STORE_CONNECT_ISSUER_ID**: Issuer ID

## 📋 Two Workflows Available

### 1. `ios-development` - For Testing

```yaml
workflow: ios-development
```

**What it does:**
- ✅ Installs dependencies
- ✅ Runs `pod install`
- ✅ Syncs Capacitor
- ✅ Builds development IPA
- ✅ Sends email notification

**Use this for:**
- Testing the build process
- Generating development builds
- Internal testing

### 2. `ios-production` - For App Store

```yaml
workflow: ios-production
```

**What it does:**
- ✅ Everything from development workflow
- ✅ Auto-increments build number
- ✅ Builds production IPA
- ✅ Submits to TestFlight automatically
- ✅ Sends email notification

**Use this for:**
- App Store releases
- TestFlight distribution
- Production builds

## 🆚 Differences from Old App

### Clean Build Process

**Old app (`appel`):**
```yaml
- Patch Google Auth plugin
- Verify patches
- Install dependencies
- Build
```

**New app (`appel_2`):**
```yaml
- Install dependencies
- Build
```

No patches needed! This is a clean Capacitor 6 setup that works out of the box.

### Simplified Scripts

| Feature | Old App | New App |
|---------|---------|---------|
| Google Auth patches | ✅ Required | ❌ Not needed |
| Script complexity | High (70+ lines) | Low (simple installs) |
| Maintenance | Complex | Easy |
| Build time | ~10-15 min | ~5-10 min |

## 📝 How to Configure CodeMagic

### Step 1: Add Repository

1. Log into CodeMagic
2. Click "Add application"
3. Select GitHub
4. Choose: `HannesFehre/my-coach-finder-2-ios-2`

### Step 2: Configure iOS Signing

1. Go to app settings → Code signing
2. Upload iOS certificates:
   - Development certificate (`.p12`)
   - Distribution certificate (`.p12`)
3. Upload provisioning profiles:
   - Development profile (`.mobileprovision`)
   - App Store profile (`.mobileprovision`)

**Note**: The certificates are already in the repo for reference:
- `ios_development_NEW.p12`
- `MyCoachFinder_Development.mobileprovision`
- `My_Coach_Finder_App_Store.mobileprovision`

### Step 3: Configure App Store Connect

1. Go to app settings → Environment variables
2. Create group: `ios_signing`
3. Add variables:
   ```
   APP_STORE_CONNECT_PRIVATE_KEY=<your-private-key>
   APP_STORE_CONNECT_KEY_IDENTIFIER=<your-key-id>
   APP_STORE_CONNECT_ISSUER_ID=<your-issuer-id>
   ```

### Step 4: Test Build

1. Go to "Start new build"
2. Select workflow: `ios-development`
3. Click "Start build"
4. Wait ~5-10 minutes
5. Download IPA if successful!

## 🎯 Build Configuration Details

### Node.js & Xcode Versions

```yaml
node: 20.19.5
xcode: latest
cocoapods: default
```

Same as the old app for consistency.

### Build Instance

```yaml
instance_type: mac_mini_m1
max_build_duration: 120
```

- Uses Apple Silicon (M1) for faster builds
- 2-hour timeout (builds usually take 5-10 min)

### App Configuration

```yaml
BUNDLE_IDENTIFIER: "MyCoachFinder"
APP_STORE_ID: "6503015097"
```

Same bundle ID and App Store ID as the old app.

## 🔍 Troubleshooting

### Build fails at "pod install"

**Solution**: The build will automatically install CocoaPods dependencies. If it fails:
1. Check the build logs for specific errors
2. Verify that `Podfile` is present in `ios/App/`

### Certificate import fails

**Solution**: Verify the certificate password:
- Default: `MyCoachFinder2024`
- The script auto-detects the correct password
- Check CodeMagic logs for password verification messages

### Provisioning profile issues

**Solution**: Make sure:
1. Bundle ID matches: `MyCoachFinder`
2. Profile is for the correct app
3. Profile is not expired
4. Profile includes the correct certificates

### Build succeeds but IPA is missing

**Solution**: Check artifacts section in build logs:
- Artifacts are saved to: `build/ios/ipa/*.ipa`
- Download from CodeMagic UI after build completes

## 📊 Expected Build Output

### Successful Development Build

```
✅ Install npm dependencies
✅ Install CocoaPods dependencies
✅ Sync Capacitor assets to iOS
✅ Set up keychain
✅ Add certificates to keychain
✅ Set up code signing settings
✅ Build iOS app

Artifacts:
- build/ios/ipa/My-Coach-Finder.ipa (ready to download)
```

### Successful Production Build

```
✅ Install npm dependencies
✅ Install CocoaPods dependencies
✅ Sync Capacitor assets to iOS
✅ Set up keychain
✅ Set up code signing
✅ Set up Xcode project signing
✅ Increment build number
✅ Build iOS app
✅ Submit to TestFlight

Email sent to: info@boothtml.com
```

## 📧 Email Notifications

All builds send notifications to: `info@boothtml.com`

You can add more recipients in `codemagic.yaml`:

```yaml
publishing:
  email:
    recipients:
      - info@boothtml.com
      - your-email@example.com  # Add more here
```

## 🎉 Ready to Build!

The app is fully configured for CodeMagic CI/CD:

- ✅ `codemagic.yaml` committed and pushed
- ✅ Bundle ID matches existing app
- ✅ Certificates included in repo
- ✅ Clean build process (no patches needed)
- ✅ Two workflows: development and production
- ✅ Automatic TestFlight submission
- ✅ Email notifications

**Next step**: Go to CodeMagic and trigger your first build! 🚀
