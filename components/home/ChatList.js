import { View, FlatList } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../database/firebase-config';
import ChatRow from './ChatRow';

const ChatList = ({setModal, setSelectedChat}) => {
  const { user } = useUser();
  const [chatRooms, setChatRooms] = useState([]);

  const fetchChatRooms = async () => {
    try {
      const myUid = user.id;

      const friendsSnapshot = await getDocs(collection(db, `users/${myUid}/friends`));
      const friendsMap = {};
      friendsSnapshot.forEach(doc => {
        friendsMap[doc.id] = doc.data().customName || doc.data().originalName;
      });

      const allChatroomsSnap = await getDocs(collection(db, 'chatrooms'));
      const myChatrooms = [];

      for (const docSnap of allChatroomsSnap.docs) {
        const data = docSnap.data();
        const users = data.users;

        if (users.includes(myUid)) {
          const friendUid = users.find(uid => uid !== myUid);
          const lastMessageSender = data.lastMessageSender;
          const lastMessageTime = data.lastMessageTime?.toDate?.();
          const isFinished = data.finished?.[myUid] ?? false;
          const now = new Date();
          const isOver24h = lastMessageTime
            ? now - lastMessageTime > 24 * 60 * 60 * 1000
            : false;

          const isRead = lastMessageSender === myUid || isOver24h || isFinished;

          myChatrooms.push({
            id: docSnap.id,
            friendUid,
            displayName: friendsMap[friendUid] || '알 수 없음',
            lastMessage: data.lastMessage || '',
            isRead,
          });
        }
      }

      setChatRooms(myChatrooms);
    } catch (error) {
      console.error('❌ 채팅방 불러오기 실패:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChatRooms();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={chatRooms}
        removeClippedSubviews={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatRow
            chatroomId={item.id}
            displayName={item.displayName}
            lastMessage={item.lastMessage}
            isRead={item.isRead}
            item={item}
            setModal={setModal}
            setSelectedChat={setSelectedChat}
          />
        )}
      />
    </View>
  );
};

export default ChatList;
