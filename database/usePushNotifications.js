import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { db, auth } from './firebase-config'; // 기존 firebase-config.js 파일 import
import { doc, updateDoc } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';

// 푸시 알림 핸들러 설정 (앱이 실행 중일 때 알림이 오면 처리)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// [새로 추가된 함수]: 토큰 획득/저장 로직을 외부에서 호출 가능하도록 만듭니다.
export const savePushTokenOnLogin = async (user) => {
    if (!user?.id) return;

    // 1. 토큰 획득 (로직은 registerForPushNotificationsAsync 그대로)
    const token = await registerForPushNotificationsAsync();

    // 2. Auth 토큰 갱신 및 Firestore 저장 (기존 savePushTokenToFirestore 로직)
    if (token) {
        try {
            const firebaseUser = getAuth().currentUser;
            if (firebaseUser) {
                await firebaseUser.getIdToken(true); 
                await updateDoc(doc(db, 'users', user.id), { 
                    expoPushToken: token, 
                });
                console.log('🔥🔥🔥 [Login Flow] 푸시 토큰 저장 성공! 🔥🔥🔥');
            }
        } catch (e) {
            console.error('❌❌❌ [Login Flow] 푸시 토큰 저장 실패:', e.message);
        }
    }
};

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

     // 1. [핵심] Firebase ID 토큰 강제 갱신
    // Firestore 쓰기 전에 현재 사용자(auth.currentUser)의 ID 토큰을 갱신합니다.
    const user = getAuth().currentUser; // 현재 Auth 유저 가져오기
    if (user) {
        await user.getIdToken(true); // 만료 여부와 관계없이 강제로 새 토큰을 요청
        console.log("✅ Auth Token Refreshed.");
    }

    await updateDoc(doc(db, 'users', uid), {
      expoPushToken: token, 
    });
    console.log('🔥🔥🔥 푸시 토큰 Firestore 저장 성공! 🔥🔥🔥'); // <-- 성공 로그 확인
  } catch (e) {
    console.error('❌❌❌ 푸시 토큰 저장 실패:', e); // <-- 실패 로그 확인
  }
}