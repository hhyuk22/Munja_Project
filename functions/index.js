const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

// V2 방식: 리전 등 전역 옵션 설정
setGlobalOptions({region: "asia-northeast3"});

// V2 방식: onDocumentCreated 함수 사용
exports.sendPushNotification = onDocumentCreated("chatrooms/{chatroomId}/messages/{messageId}", async (event) => {
  // V2 방식: 이벤트 데이터와 파라미터는 event 객체에서 가져옵니다.
  const chatroomId = event.params.chatroomId;
  const messageSnapshot = event.data;

  if (!messageSnapshot) {
    console.log("메시지 데이터가 없습니다.");
    return;
  }
  const message = messageSnapshot.data();

  const chatroomRef = admin.firestore().collection("chatrooms").doc(chatroomId);
  const chatroomSnap = await chatroomRef.get();
  if (!chatroomSnap.exists) {
    console.log("채팅방이 존재하지 않습니다:", chatroomId);
    return;
  }
  const chatroomData = chatroomSnap.data();

  const senderUid = message.uid;
  const recipientUid = chatroomData.users.find((uid) => uid !== senderUid);

  if (!recipientUid) {
    console.log("수신자를 찾을 수 없습니다.");
    return;
  }

  const recipientRef = admin.firestore().collection("users").doc(recipientUid);
  const recipientSnap = await recipientRef.get();
  if (!recipientSnap.exists) {
    console.log("수신자 문서가 없습니다:", recipientUid);
    return;
  }
  const recipientData = recipientSnap.data();
  const pushToken = recipientData.pushToken;

  if (!pushToken) {
    console.log("수신자의 pushToken이 없습니다.");
    return;
  }

  const senderRef = admin.firestore().collection("users").doc(senderUid);
  const senderSnap = await senderRef.get();
  const senderName = senderSnap.exists() ? senderSnap.data().name : "누군가";

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: pushToken,
      title: `${senderName}님에게서 온 문자`,
      body: message.text,
      data: {chatroomId: chatroomId},
    }),
  });

  console.log(`알림 전송 완료: ${recipientUid}에게`);
  return null;
});