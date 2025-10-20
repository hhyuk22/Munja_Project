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

      const now = new Date(); // 현재 시간
      const lastMessageTime =
      chatroomData.lastMessageTime?.toDate?.() || new Date(0);
      const oneDay = 24 * 60 * 60 * 1000;
      const isOver24h = now.getTime() - lastMessageTime.getTime() > oneDay;

      // ********************************************************
      // ✅ [추가 로직 1: 24시간 경과 시 알림 수신 허용 플래그 강제 업데이트]
      // ********************************************************
      if (isOver24h) {
        // 24시간이 지났다면, 클라이언트의 읽음 처리 여부와 관계없이
        // 수신자(receiverUid)에게 다음 알림을 받을 수 있는 권한을 부여합니다.
        await db.collection("chatrooms").doc(chatroomId).update(
            {[`isAllowedToReceivePush.${receiverUid}`]: true,
            });
        console.log(
            `24시간 초과로 인해 ${receiverUid}의 알림 수신 상태를 '가능'으로 업데이트했습니다.`);
      }
      // ********************************************************


      // 3. 알림 전송 조건 확인:
      // (24시간 업데이트가 끝난 후) 현재 수신자가 알림을 받을 수 있는 상태인지 다시 확인합니다.
      // 24시간이 지났다면, 위 로직에 의해 isAllowedToReceive가 true가 됩니다.
      const updatedChatroomSnap =
      await db.collection("chatrooms").doc(chatroomId).get();
      const updatedChatroomData = updatedChatroomSnap.data();
      const isAllowedToReceive =
      updatedChatroomData.isAllowedToReceivePush?.[receiverUid] === true;

      // ✅ [조건 1: 알림 허용 상태 확인]
      if (!isAllowedToReceive) {
        console.log(
            `${receiverUid}는 알림을 받을 수 있는 상태가 아닙니다 (읽음 처리 또는 24시간 미경과).`);
        return null;
      }

      // **이 시점에서는 24시간 초과 여부를 다시 확인할 필요가 없습니다.
      // isAllowedToReceive === true 라는 것은 (클라이언트 읽음 처리)
      // OR (24시간 초과) 둘 중 하나가 만족했다는 의미이기 때문입니다.**


      // 4. 알림 전송 상태 기록 (알림이 발송되기 직전)
      // 알림을 보낼 자격이 있으므로, 플래그를 false로 변경하여 중복 발송을 방지합니다.
      await db.collection("chatrooms").doc(chatroomId).update({
        [`isAllowedToReceivePush.${receiverUid}`]: false,
      });
      console.log(`${receiverUid}의 알림 상태를 false로 업데이트했습니다.`);


      // 5. 상대방의 사용자 정보 (토큰) 로드
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
        title: ` `, // 누구의 문자인지 안보이게 문자 내용도 보이지 않게
        body: `문자가 도착했습니다`,
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
