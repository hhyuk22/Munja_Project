import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { db } from './firebase-config'; // 기존 firebase-config.js 파일 import
import { doc, updateDoc } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import { useEffect } from 'react';

// 푸시 알림 핸들러 설정 (앱이 실행 중일 때 알림이 오면 처리)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const usePushNotifications = () => {
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    registerForPushNotificationsAsync().then(token => {
      if (token) {
        savePushTokenToFirestore(user.id, token);
      }
    });
  }, [user?.id]);
};

// 1. 토큰 획득 함수
async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // 1-1. 권한 요청
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // 1-2. 권한 거부 시 경고
  if (finalStatus !== 'granted') {
    alert('푸시 알림 권한이 거부되었습니다!');
    return;
  }

  // 1-3. Expo Push Token 획득
  token = (await Notifications.getExpoPushTokenAsync({
    projectId: '96b88fb0-bdc2-40d1-8cf3-f55b8becce32', // app.json의 projectId 사용
  })).data;

  // 1-4. Android 채널 설정
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

// 2. Firestore에 토큰 저장 함수
async function savePushTokenToFirestore(uid, token) {
  try {
    await updateDoc(doc(db, 'users', uid), {
      expoPushToken: token, // users/{uid} 문서에 토큰 필드를 추가합니다.
    });
    console.log('푸시 토큰 Firestore 저장 완료:', token);
  } catch (e) {
    console.error('푸시 토큰 저장 실패:', e);
  }
}