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
    console.log("1");
  useEffect(() => {
    if (!user?.id) return;
    console.log("2");
    registerForPushNotificationsAsync().then(token => {
        console.log("3");
      if (token) {
        savePushTokenToFirestore(user.id, token);
      }
      console.log("4");
    });
  }, [user?.id]);
};

// 1. 토큰 획득 함수
// 1. 토큰 획득 함수 (registerForPushNotificationsAsync 내부)
async function registerForPushNotificationsAsync() {
    // -----------------------------------------------------------------
    // [필수 수정 1]: finalStatus 및 existingStatus 변수를 선언해야 합니다.
    let token; 
    const { status: existingStatus } = await Notifications.getPermissionsAsync(); // 이 await 필수
    let finalStatus = existingStatus;
    
    console.log("5");
    
    // [필수 수정 2]: 권한 요청 로직 (기존 코드에서 누락된 부분)
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync(); // 이 await 필수
        finalStatus = status;
    }
    // -----------------------------------------------------------------


    if (finalStatus !== 'granted') {
        console.error('푸시 알림 권한이 최종 거부됨!');
        return; // 권한이 없으면 여기서 토큰 획득 시도 없이 종료
    }
    
    console.log("🟡 토큰 획득 시도: Project ID 96b88fb0-bdc2-40d1-8cf3-f55b8becce32 사용"); 

    // 1-3. Expo Push Token 획득
    // [필수 수정 3]: token 변수 선언 및 await 구문 확인
    token = (await Notifications.getExpoPushTokenAsync({
        projectId: '96b88fb0-bdc2-40d1-8cf3-f55b8becce32', 
    })).data;
    
    console.log('🟢 [클라이언트 로그]: 획득된 토큰 값:', token); 

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