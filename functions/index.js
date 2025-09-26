const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Expo = require('expo-server-sdk').Expo;

admin.initializeApp();
const db = admin.firestore();
const expo = new Expo();

// 새 메시지가 chatrooms/{chatroomId}/messages 컬렉션에 추가될 때 실행
exports.sendPushNotificationOnMessage = functions.firestore
  .document('chatrooms/{chatroomId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const newMessage = snapshot.data();
    const senderUid = newMessage.uid;
    const chatroomId = context.params.chatroomId;

    // 1. 전송자가 본인인 경우 알림을 보내지 않음 (선택 사항: 굳이 필요 없음)
    // if (newMessage.text.startsWith('[SYSTEM]')) return null;

    // 2. 채팅방 정보 로드 및 상대방 UID 찾기
    const chatroomRef = db.collection('chatrooms').doc(chatroomId);
    const chatroomSnap = await chatroomRef.get();
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
    const isFinished = chatroomData.finished[receiverUid]; // 상대방이 대화를 끝냈는지 확인

    // 4. 알림 전송 로직 (앱 컨셉 적용: '알림을 보내지 않습니다.')
    // 사용자님의 앱 컨셉을 존중하여, 기본적으로 알림을 보내지 않거나 
    // 나중에 '알림 허용' 플래그가 있을 때만 보내도록 구현할 수 있습니다.
    
    // 이 예시에서는 **앱의 컨셉을 어기지 않기 위해 알림 전송 로직을 주석 처리**하고, 
    // 토큰이 유효한지 확인하는 로직만 남깁니다.
    
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`상대방 토큰 (${pushToken})은 유효한 Expo Push Token이 아닙니다.`);
        return null;
    }
    
    // **만약 알림을 보낸다면:**
    /*
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
    let tickets = [];
    (async () => {
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending push chunk:', error);
            }
        }
    })();
    */

    console.log(`알림 전송 로직 완료 (토큰: ${pushToken})`);
    return null;
  });