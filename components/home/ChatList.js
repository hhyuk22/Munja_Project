import { View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { db } from '../../database/firebase-config';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import ChatRow from './ChatRow';

const ChatList = ({ setModal, setSelectedChat }) => {
  const { user } = useUser();
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const myUid = user.id;

    const loadFriendsAndListenChatrooms = async () => {
      try {
        const friendsSnapshot = await getDocs(collection(db, `users/${myUid}/friends`));
        const friendsMap = {};
        friendsSnapshot.forEach(doc => {
          friendsMap[doc.id] = doc.data().customName || doc.data().originalName;
        });

        const unsubscribe = onSnapshot(collection(db, 'chatrooms'), async (snapshot) => {
          const now = new Date();
          const myChatrooms = [];

          for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            const users = data.users;

            if (users.includes(myUid)) {
              const friendUid = users.find(uid => uid !== myUid);
              const lastMessageSender = data.lastMessageSender;
              const lastMessageTime = data.lastMessageTime?.toDate?.();
              const isFinished = data.finished?.[myUid] ?? false;

              const isOver24h = lastMessageTime
                ? now - lastMessageTime > 24 * 60 * 60 * 1000
                : false;

              const isRead = lastMessageSender === myUid || isOver24h || isFinished;

              myChatrooms.push({
                id: docSnap.id,
                friendUid,
                displayName: friendsMap[friendUid] || '알 수 없음',
                lastMessage: data.lastMessage || '',
                lastMessageTime: lastMessageTime || new Date(0), // null 방지
                isRead,
              });
            }
          }

          // 정렬 적용: 읽지 않은 → 최근 순으로
          const sorted = myChatrooms.sort((a, b) => {
            if (a.isRead !== b.isRead) {
              return a.isRead ? 1 : -1; // 읽지 않은 것 먼저
            }
            return b.lastMessageTime - a.lastMessageTime; // 최신 메시지 순
          });

          setChatRooms(sorted);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('채팅방 실시간 구독 실패:', error);
      }
    };

    loadFriendsAndListenChatrooms();
  }, [user.id]);


  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={chatRooms}
        removeClippedSubviews={false}
        keyExtractor={(item) => item.id}
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
