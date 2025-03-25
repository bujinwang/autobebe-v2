# PatientApp - AutoBebe

## Deploying to Apple App Store

### Prerequisites
- An Apple Developer account ($99/year)
- Xcode installed on your Mac
- EAS CLI installed (`npm install -g eas-cli`)
- Expo account (sign up at https://expo.dev)

### Setup Steps

#### 1. Update Configuration Files

The app.json and eas.json files have already been configured with placeholder values. Before building, replace:

In app.json:
- Update the `bundleIdentifier` if different from "com.autobebe.patientapp"
- Ensure `buildNumber` is incremented for each new submission
- Verify app permissions in `infoPlist` section match your app's requirements
- Update the `appStoreUrl` once your app is live
- Set your `projectId` in the "extra.eas" section (get this from Expo)
- Set the `owner` to your Expo account username

In eas.json:
- Fill in `appleId` with your Apple Developer account email
- Set `ascAppId` with your App Store Connect app ID (numeric)
- Set `appleTeamId` with your Apple Developer Team ID

#### 2. Prepare App Store Assets

- Create screenshots for different iPhone/iPad models
- Prepare app icon in various sizes
- Write compelling app description, keywords, and privacy policy

#### 3. Build and Submit

Log in to your Expo account:
```
eas login
```

Build the app for iOS:
```
eas build --platform ios --profile production
```

Submit to App Store:
```
eas submit --platform ios --profile production
```

Alternatively, build and submit in one command:
```
eas build --platform ios --profile submit --auto-submit
```

#### 4. App Store Connect

After submission:
1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Complete app metadata, screenshots, and description
3. Fill out the App Review Information
4. Submit for review

### Troubleshooting

If you encounter build issues:
- Verify your Apple Developer account has the correct provisioning profiles
- Check that all app permissions are properly declared
- Ensure the bundle identifier is unique and properly formatted

For submission errors:
- Verify your app meets all App Store guidelines
- Check that all privacy labels and permissions are correctly configured

### Additional Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/) 