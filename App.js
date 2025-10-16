import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import StackNavigator from './components/StackNavigator';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications'; // 🌟 Notifications import 추가
import { AppState } from 'react-native'; // 🌟 AppState import 추가

export default function App() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY; //Clerk으로 로그인 관리
  if (!publishableKey) {
    throw new Error("CLERK_PUBLISHABLE_KEY Error");
  }

  useEffect(() => {
    // 앱 상태 변경을 감지하는 핸들러
    const handleAppStateChange = (nextAppState) => {
      // 앱이 '활성화' 상태(Foreground)로 진입할 때
      if (nextAppState === 'active') {
        dismissAppNotifications();
      }
    };

    // AppState 리스너 등록
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      subscription.remove();
    };
  }, []); // 이 useEffect는 앱 시작 시 한 번만 실행되도록 빈 배열을 넣어줍니다.

  // 🌟 [추가할 함수]: 모든 알림을 삭제하는 로직
  const dismissAppNotifications = async () => {
    try {
      // 해당 앱과 관련된 모든 알림을 지웁니다.
      await Notifications.dismissAllNotificationsAsync();
      console.log('✅ 앱 진입 시 모든 푸시 알림이 지워졌습니다.');
    } catch (e) {
      console.error('푸시 알림 삭제 실패:', e);
    }
  };

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