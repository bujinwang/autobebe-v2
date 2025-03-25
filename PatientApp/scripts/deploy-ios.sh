#!/bin/bash

# Deploy script for iOS App Store submission
# Usage: ./scripts/deploy-ios.sh

echo "🚀 Starting iOS App Store deployment process for PatientApp..."
echo "------------------------------------------------------------"

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
else
    echo "✅ EAS CLI found"
fi

# Login to EAS
echo "🔑 Logging in to EAS..."
eas login

# Ensure eas.json is configured
if grep -q "YOUR_APPLE_ID" eas.json; then
    echo "⚠️ Warning: You need to update the placeholders in eas.json with your actual values:"
    echo "  - YOUR_APPLE_ID"
    echo "  - YOUR_APP_STORE_CONNECT_APP_ID"
    echo "  - YOUR_APPLE_TEAM_ID"
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting. Please update eas.json and try again."
        exit 1
    fi
fi

# Ensure app.json is configured
if grep -q "your-eas-project-id" app.json; then
    echo "⚠️ Warning: You need to update the placeholders in app.json with your actual values:"
    echo "  - your-eas-project-id (in extra.eas.projectId)"
    echo "  - your-expo-account (in owner)"
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting. Please update app.json and try again."
        exit 1
    fi
fi

# Ask user what type of build they want
echo "📱 Select build type:"
echo "1) Development build"
echo "2) Preview build (internal testing)"
echo "3) Production build"
echo "4) Production build + auto-submit to App Store"
read -p "Enter your choice (1-4): " buildChoice

case $buildChoice in
    1)
        echo "🛠️ Building development version..."
        eas build --platform ios --profile development
        ;;
    2)
        echo "🛠️ Building preview version for internal testing..."
        eas build --platform ios --profile preview
        ;;
    3)
        echo "🛠️ Building production version..."
        eas build --platform ios --profile production
        ;;
    4)
        echo "🛠️ Building and submitting to App Store..."
        eas build --platform ios --profile submit --auto-submit
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo "✅ Build process initiated. Check the EAS dashboard for build status."
echo "📝 Remember to complete the App Store submission process in App Store Connect"
echo "   https://appstoreconnect.apple.com" 