// functions/index.js (V2 마이그레이션)

// ********** V2 SDK Import로 변경 **********
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
// ****************************************
const admin = require('firebase-admin');
const Expo = require('expo-server-sdk').Expo;

admin.initializeApp();
const db = admin.firestore();
const expo = new Expo();

// 새 메시지가 chatrooms/{chatroomId}/messages 컬렉션에 추가될 때 실행
// V1: exports.sendPushNotificationOnMessage = functions.firestore.document(...)
// ********** V2: onDocumentCreated 사용 **********
exports.sendPushNotificationOnMessage = onDocumentCreated(
  'chatrooms/{chatroomId}/messages/{messageId}',
  async (event) => {
    // V2에서는 context 대신 event.data와 event.params를 사용합니다.
    const snapshot = event.data;
    const context = event; // V2에서 context는 event와 거의 유사합니다.

    const newMessage = snapshot.data();
    const senderUid = newMessage.uid;
    const chatroomId = context.params.chatroomId;

    // ... (로직 생략 - V1과 동일하게 작동)

    // 2. 채팅방 정보 로드 및 상대방 UID 찾기
    const chatroomSnap = await db.collection('chatrooms').doc(chatroomId).get();
    const chatroomData = chatroomSnap.data();

    // 채팅방 참여자 중 전송자가 아닌 상대방 UID를 찾습니다.
    const receiverUid = chatroomData.users.find(uid => uid !== senderUid);
    if (!receiverUid) {
      console.log('상대방 UID를 찾을 수 없습니다.');
      return null;
    }

    // 3. 상대방의 사용자 정보 (토큰) 로드
    const receiverUserRef = db.collection('users').doc(receiverUid);
    const receiverUserSnap = await receiverUserRef.get();
    const receiverUserData = receiverUserSnap.data();
    const pushToken = receiverUserData.expoPushToken;
    const isFinished = chatroomData.finished[receiverUid];

    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`상대방 토큰 (${pushToken})은 유효한 Expo Push Token이 아닙니다.`);
        return null;
    }
    
    // **만약 알림을 보낸다면:** (활성화된 상태)
    const messages = [];
    messages.push({
        to: pushToken,
        sound: 'default',
        title: `${receiverUserData.name}님에게 새 문자 도착!`, 
        body: newMessage.text,
        data: { chatroomId: chatroomId },
        priority: 'high',
    });
    
    let chunks = expo.chunkPushNotifications(messages);
    
    // ********** V1과 동일한 await 로직 **********
    for (let chunk of chunks) {
        try {
            await expo.sendPushNotificationsAsync(chunk); 
        } catch (error) {
            console.error('Error sending push chunk:', error);
        }
    }

    console.log(`알림 전송 로직 완료 (토큰: ${pushToken})`);
    return null;
  }
);