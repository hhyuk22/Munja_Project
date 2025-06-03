import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import StackNavigator from './components/StackNavigator';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY; //Clerk으로 로그인 관리
  if (!publishableKey) {
    throw new Error("CLERK_PUBLISHABLE_KEY Error");
  }
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => { //폰트 본명조
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