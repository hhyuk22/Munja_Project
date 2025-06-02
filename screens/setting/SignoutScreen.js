import { View } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/signout/Header';
import Body from '../../components/signout/Body';
import DeleteIDModal from '../../components/signout/DeleteIDModal';
import { useUser } from '@clerk/clerk-react';
import { db } from '../../database/firebase-config';
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  arrayRemove,
  getDoc
} from 'firebase/firestore';

const SignoutScreen = () => {
  const [modal, setModal] = useState(false);
  const { user } = useUser();

  const deleteFirebaseData = async (uid) => {
    try {
      // 🔹 1. users 문서 삭제
      await deleteDoc(doc(db, 'users', uid));

      // 🔹 2. 사용자가 포함된 chatrooms 정리
      const chatroomsSnapshot = await getDocs(
        query(collection(db, 'chatrooms'), where('users', 'array-contains', uid))
      );

      for (const chatroom of chatroomsSnapshot.docs) {
        const data = chatroom.data();

        // 🔸 먼저 이 유저를 users 배열에서 제거
        await updateDoc(doc(db, 'chatrooms', chatroom.id), {
            users: arrayRemove(uid),
        });

        // 🔸 제거 후 users 배열이 비었는지 확인
        const updatedChatroomSnap = await getDoc(doc(db, 'chatrooms', chatroom.id));
        const updatedUsers = updatedChatroomSnap.data().users;

        // 🔸 아무도 안 남았으면 방 자체 삭제
        if (!updatedUsers || updatedUsers.length === 0) {
            await deleteDoc(doc(db, 'chatrooms', chatroom.id));
        }

        // 🔸 messages 하위 컬렉션은 선택적으로 정리 가능
        }
    } catch (err) {
      console.error('❌ Firebase 데이터 삭제 실패:', err);
    }
  };

  const DeleteAccount = async () => {
    try {
      const uid = user.id;

      await deleteFirebaseData(uid);     // 🔹 Firestore 데이터 삭제
      await user.delete();               // 🔹 Clerk 계정 삭제

      console.log('✅ 계정과 데이터가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('❌ 전체 삭제 실패:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Header />
      <Body setModal={setModal} />
      <DeleteIDModal
        visible={modal}
        onClose={() => setModal(false)}
        onEnd={() => {
          DeleteAccount();
        }}
      />
    </View>
  );
};

export default SignoutScreen;
