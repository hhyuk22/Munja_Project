import {auth, db} from '../database/firebase-config'
import { useEffect, useState } from 'react'
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
import { usePushNotifications } from '../database/usePushNotifications';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user, isLoaded } = useUser();
  const [entryPoint, setEntryPoint] = useState(null);
  const { isSignedIn, getToken } = useAuth();

  usePushNotifications(); //푸시알림 호출

  useEffect(() => {
    const loginToFirebase = async () => {
      if (isSignedIn && isLoaded) {
        try {
          const token = await getToken({ template: 'integration_firebase' });
          const creds = await signInWithCustomToken(auth, token || '');
          const userRef = doc(db, 'users', creds.user.uid);
          const userSnap = await getDoc(userRef);

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


export default StackNavigator