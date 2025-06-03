import { useEffect, useState, useRef } from 'react';
import { View, FlatList } from 'react-native';
import Header from '../components/message/Header';
import SenderMessage from '../components/message/SenderMessage';
import ReciverMessage from '../components/message/ReciverMessage';
import Input from '../components/message/Input';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../database/firebase-config';
import { doc, collection, addDoc, updateDoc, getDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import MessageModal from '../components/message/MessageModal';

const MessageScreen = () => {
  const { user } = useUser();
  const route = useRoute();
  const { chatroomId, displayName } = route.params;
  const flatListRef = useRef();
  const [messages, setMessages] = useState([]);
  const [modal, setModal] = useState(false);
  const [friendUid, setFriendUid] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFriendUid = async () => {
      const chatroomRef = doc(db, 'chatrooms', chatroomId);
      const chatroomSnap = await getDoc(chatroomRef);
      const users = chatroomSnap.data().users;
      const uid = users.find((uid) => uid !== user.id);
      setFriendUid(uid);
    };

    fetchFriendUid();
  }, [chatroomId, user.id]);

  useEffect(() => {
    const messagesRef = collection(db, `chatrooms/${chatroomId}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [chatroomId]);

  const sendMessage = async (text) => {
    const newMessage = {
      uid: user.id,
      text,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, `chatrooms/${chatroomId}/messages`), newMessage);

      if (friendUid) {
        await updateDoc(doc(db, 'chatrooms', chatroomId), {
          lastMessage: text,
          lastMessageSender: user.id,
          lastMessageTime: new Date(),
          [`finished.${user.id}`]: false,
          [`finished.${friendUid}`]: false,
        });
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  const handleFinishConversation = async () => {
    try {
      const myUid = user.id;
      const chatroomRef = doc(db, 'chatrooms', chatroomId);

      await updateDoc(chatroomRef, {
        [`finished.${myUid}`]: true,
      });

      console.log('읽음 처리 완료');
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Header title={displayName} />
      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item.uid === user.id ? (
            <SenderMessage text={item.text} />
          ) : (
            <ReciverMessage text={item.text} />
          )
        }
      />
      <Input onSend={sendMessage} setModal={setModal} />
      <MessageModal
        visible={modal}
        onClose={() => setModal(false)}
        onEnd={() => {
          handleFinishConversation();
          setModal(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default MessageScreen;
