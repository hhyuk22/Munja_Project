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
// 1. 토큰 획득 함수 (registerForPushNotificationsAsync 내부)
async function registerForPushNotificationsAsync() {
    // ... (권한 요청 로직)

    if (finalStatus !== 'granted') {
        console.error('푸시 알림 권한이 최종 거부됨!');
        return;
    }

    // 1-3. Expo Push Token 획득
    token = (await Notifications.getExpoPushTokenAsync({
        projectId: '96b88fb0-bdc2-40d1-8cf3-f55b8becce32', // app.json의 projectId 확인
    })).data;
    
    console.log('획득된 토큰:', token); // <-- 토큰이 실제로 찍히는지 확인
    return token;
}

// 2. Firestore에 토큰 저장 함수 (savePushTokenToFirestore 내부)
async function savePushTokenToFirestore(uid, token) {
    console.log('🔥🔥🔥 savePushTokenToFirestore 🔥🔥🔥')
  try {
    await updateDoc(doc(db, 'users', uid), {
      expoPushToken: token, 
    });
    console.log('🔥🔥🔥 푸시 토큰 Firestore 저장 성공! 🔥🔥🔥'); // <-- 성공 로그 확인
  } catch (e) {
    console.error('❌❌❌ 푸시 토큰 저장 실패:', e); // <-- 실패 로그 확인
  }
}