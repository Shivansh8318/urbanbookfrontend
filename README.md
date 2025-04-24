# UrbanBook

A React Native application for creating and sharing event invitations. Built using pure React Native (no Expo).

## Features

- Create event invitations
- View event details
- Interactive UI with animations
- Carousel event selection

## Technologies Used

- React Native
- React Navigation
- React Native Reanimated
- React Native Gesture Handler
- React Native Linear Gradient
- React Native Safe Area Context

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Android SDK

### Installation

1. Clone this repository
2. Navigate to the project directory:
   ```
   cd InvitesApp
   ```
3. Install dependencies:
   ```
   npm install
   ```
   
### Running the App

#### Android

1. Start an Android emulator or connect an Android device
2. Run the app:
   ```
   npx react-native run-android
   ```

## Project Structure

```
src/
  ├── assets/         # Images and other assets
  ├── components/     # Reusable UI components
  ├── navigation/     # Navigation setup
  └── screens/        # Application screens
```

## Customization

- Edit the events array in `src/screens/WelcomeScreen.js` to add or modify events
- To change the app's color theme, edit the LinearGradient colors in the screens
