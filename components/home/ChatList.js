import { View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { db } from '../../database/firebase-config';
import { collection, onSnapshot } from 'firebase/firestore';
import ChatRow from './ChatRow';

const ChatList = ({ setModal, setSelectedChat }) => {
  const { user } = useUser();
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    if (!user) return;

    const myUid = user.id;

    const friendsUnsubscribe = onSnapshot(collection(db, `users/${myUid}/friends`), (friendsSnapshot) => {
      const friendsMap = {};
      friendsSnapshot.forEach(doc => {
        friendsMap[doc.id] = doc.data().customName || doc.data().originalName;
      });

      const chatroomsUnsubscribe = onSnapshot(collection(db, 'chatrooms'), (chatroomSnapshot) => {
        const now = new Date();
        const myChatrooms = [];

        for (const docSnap of chatroomSnapshot.docs) {
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
              lastMessageTime: lastMessageTime || new Date(0),
              isRead,
            });
          }
        }

        const sorted = myChatrooms.sort((a, b) => {
          if (a.isRead !== b.isRead) {
            return a.isRead ? 1 : -1;
          }
          return b.lastMessageTime - a.lastMessageTime;
        });

        setChatRooms(sorted);
      });

      return () => chatroomsUnsubscribe();
    });

    return () => friendsUnsubscribe();
    
  }, [user]);


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