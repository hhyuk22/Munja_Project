import { auth, db } from '../database/firebase-config';
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';
import NameScreen from '../screens/start/NameScreen';
import AddfriendScreen from '../screens/setting/AddfriendScreen';
import EditfriendScreen from '../screens/setting/EditfriendScreen';
import SettingScreen from '../screens/setting/SettingScreen';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { signInWithCustomToken } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import EditnameScreen from '../screens/setting/EditnameScreen';
import OnboardingScreen from '../screens/start/OnboardingScreen';
import LoadingScreen from '../screens/start/LoadingScreen';
import SetOnboardingScreen from '../screens/start/SetOnboardingScreen';
import SignoutScreen from '../screens/setting/SignoutScreen';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator();

// 알림 핸들러 설정 (앱이 실행 중일 때 알림이 오면 어떻게 표시할지 결정)


const StackNavigator = () => {
  const { user, isLoaded } = useUser();
  const [entryPoint, setEntryPoint] = useState(null);
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {

    const registerForPushNotificationsAsync = async (uid) => {
      // if (!Constants.isDevice) {
      //   console.log("에뮬레이터에서는 푸시 토큰을 가져올 수 없습니다.");
      //   return;
      // }

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
        console.log("안드로이드");
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("알림설정1");
      }
      if (finalStatus !== 'granted') {
        console.log("알림설정2");
        alert('푸시 알림을 받으려면 알림 권한을 허용해주세요!');
        return;
      }
      
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        if (!projectId) {
            throw new Error('Expo project ID not found');
        }
        const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        
        // Firestore의 사용자 문서에 pushToken 저장
        await setDoc(doc(db, 'users', uid), { pushToken: token }, { merge: true });

      } catch (e) {
        console.error("Push token 가져오기 실패", e);
      }
    };

    const loginToFirebase = async () => {
      if (isSignedIn && isLoaded) {
        try {
          const token = await getToken({ template: 'integration_firebase' });
          const creds = await signInWithCustomToken(auth, token || '');
          const userRef = doc(db, 'users', creds.user.uid);
          const userSnap = await getDoc(userRef);

          // Firebase 로그인 성공 후 푸시 알림 등록 함수 호출
          await registerForPushNotificationsAsync(creds.user.uid);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: creds.user.uid,
              email: user.emailAddresses[0]?.emailAddress || '',
              name: '',
            });
            setEntryPoint('Name');
          } else {
            const data = userSnap.data();
            if (!data.name || data.name.trim() === '') {
              setEntryPoint('Name');
            } else {
              setEntryPoint('Home');
            }
          }
        } catch (err) {
          console.error('Firebase 로그인 실패:', err);
          setEntryPoint('Login');
        }
      } 
      else {
        setEntryPoint('Loading');
      }
    };
    loginToFirebase();
  }, [isSignedIn, isLoaded]);

  if (!isLoaded || entryPoint === null) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade'  }}>
      {entryPoint === 'Loading' && (
        <>
          <Stack.Screen
            name="Loading"
            component={LoadingScreen}
            options={{ animation: 'none' }}
          />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
      {entryPoint === 'Login' && (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
      {entryPoint === 'Name' && (
        <>
          <Stack.Screen name="Name" component={NameScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Message" component={MessageScreen} />
          <Stack.Screen name="Addfriend" component={AddfriendScreen} />
          <Stack.Screen name="Editfriend" component={EditfriendScreen} />
          <Stack.Screen name="Setting" component={SettingScreen} />
          <Stack.Screen name="Editname" component={EditnameScreen} />
          <Stack.Screen name="Setonboarding" component={SetOnboardingScreen} />
          <Stack.Screen name="Signout" component={SignoutScreen} />
        </>
      )}
      {entryPoint === 'Home' && (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Message" component={MessageScreen} />
          <Stack.Screen name="Addfriend" component={AddfriendScreen} />
          <Stack.Screen name="Editfriend" component={EditfriendScreen} />
          <Stack.Screen name="Setting" component={SettingScreen} />
          <Stack.Screen name="Editname" component={EditnameScreen} />
          <Stack.Screen name="Setonboarding" component={SetOnboardingScreen} />
          <Stack.Screen name="Signout" component={SignoutScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;