import {auth} from './database/firebase-config'
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './components/StackNavigator';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { Stack } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { signInWithCustomToken } from 'firebase/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("CLERK_PUBLISHABLE_KEY Error");
  }
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Heavy': require('./assets/fonts/SourceHanSerifK-Heavy.otf'),
        'Bold': require('./assets/fonts/SourceHanSerifK-Bold.otf'),
        'SemiBold': require('./assets/fonts/SourceHanSerifK-SemiBold.otf'),
        'Medium': require('./assets/fonts/SourceHanSerifK-Medium.otf'),
        'Regular': require('./assets/fonts/SourceHanSerifK-Regular.otf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) return null;
  
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <NavigationContainer>
          <SignedOut>
            <StackNavigator />
          </SignedOut>
          <SignedIn>
            <StackNavigator />
          </SignedIn>
        </NavigationContainer>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}