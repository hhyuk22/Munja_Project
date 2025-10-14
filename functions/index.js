// functions/index.js

const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const Expo = require("expo-server-sdk").Expo;

admin.initializeApp();
const db = admin.firestore();
const expo = new Expo();

// 새 메시지가 chatrooms/{chatroomId}/messages 컬렉션에 추가될 때 실행
exports.sendPushNotificationOnMessage = onDocumentCreated(
    "chatrooms/{chatroomId}/messages/{messageId}",
    async (event) => {
      const snapshot = event.data;
      const context = event;

      const newMessage = snapshot.data();
      const senderUid = newMessage.uid;
      const chatroomId = context.params.chatroomId;

      // 2. 채팅방 정보 로드 및 상대방 UID 찾기
      const chatroomSnap = await db.collection(
          "chatrooms").doc(chatroomId).get();
      const chatroomData = chatroomSnap.data();

      const receiverUid = chatroomData.users.find(
          (uid) => uid !== senderUid,
      );
      if (!receiverUid) {
        console.log("상대방 UID를 찾을 수 없습니다.");
        return null;
      }

      const isSenderFinished = chatroomData.finished?.[senderUid] === true;

      // 만약 상대방(발신자)의 finished 상태가 true가 아니라면
      // 즉, 읽음 상태가 아니라면
      if (!isSenderFinished) {
        console.log(`알림전송거부: ${senderUid}가 읽음 처리 하지 않았습니다.`);
        return null;
      }

      // 3. 상대방의 사용자 정보 (토큰) 로드
      const receiverUserRef = db.collection("users").doc(receiverUid);
      const receiverUserSnap = await receiverUserRef.get();
      const receiverUserData = receiverUserSnap.data();
      const pushToken = receiverUserData.expoPushToken;

      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(
            `상대방 토큰 (${pushToken})은 유효한 Expo Push Token이 아닙니다.`,
        );
        return null;
      }

      // **만약 알림을 보낸다면:** (활성화된 상태)
      const messages = [];
      messages.push({
        to: pushToken,
        sound: "default",
        title: `문자가 도착했습니다`, // 누구의 문자인지 안보이게
        // body: newMessage.text, 문자 내용도 보이지 않게
        data: {chatroomId: chatroomId},
        priority: "high",
      });

      const chunks = expo.chunkPushNotifications(messages);

      // ********** 알림 전송 로직 **********
      for (const chunk of chunks) {
        try {
          await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
          console.error("Error sending push chunk:", error);
        }
      }

      console.log(`알림 전송 로직 완료 (토큰: ${pushToken})`);
      return null;
    },
);
