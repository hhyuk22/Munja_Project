import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { db } from '../../database/firebase-config';
import { useUser } from '@clerk/clerk-expo';
import { collection, doc, getDocs, query, where, setDoc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Body = ({ setAddFriendHandler }) => {
  const { user: clerkUser } = useUser();
  const [friendEmail, setFriendEmail] = useState('');
  const [friendNickname, setFriendNickname] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const handleAddFriend = async () => {
      try {
        if (!friendEmail || !friendNickname) {
          Alert.alert('입력 오류', '이름과 이메일을 모두 입력하세요.');
          return;
        }

        const q = query( //친구 찾기
          collection(db, 'users'),
          where('email', '==', friendEmail)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          Alert.alert('오류', '해당 이메일의 사용자를 찾을 수 없습니다.');
          return;
        }

        const friendDoc = querySnapshot.docs[0];
        const friendData = friendDoc.data();
        const friendUid = friendData.uid;
        const friendName = friendData.name;
        const myUid = clerkUser?.id;
        const mySnap = await getDoc(doc(db, 'users', myUid));
        const myName = mySnap.exists() ? mySnap.data().name : '';
        const myFriendRef = doc(db, `users/${myUid}/friends`, friendUid);
        const myFriendSnap = await getDoc(myFriendRef);
        if (myFriendSnap.exists()) {
          Alert.alert('중복 추가', '이미 친구로 등록된 사용자입니다.');
          return;
        }

        await setDoc(myFriendRef, { //친구 등록
          email: friendEmail,
          originalName: friendName,
          customName: friendNickname,
        });
        await setDoc(doc(db, `users/${friendUid}/friends`, myUid), {
          email: clerkUser?.primaryEmailAddress?.emailAddress || '',
          originalName: myName,
          customName: myName,
        });
        
        const chatroomId = [myUid, friendUid].sort().join('_'); //바로 채팅방 생성
        const chatroomRef = doc(db, 'chatrooms', chatroomId);
        const chatroomSnap = await getDoc(chatroomRef);

        if (!chatroomSnap.exists()) {
          const finishedState = {
            [myUid]: true,
            [friendUid]: true,
          };

          await setDoc(chatroomRef, {
            users: [myUid, friendUid],
            lastMessage: '',
            lastMessageSender: '',
            lastMessageTime: new Date(),
            finished: finishedState,
            createdAt: new Date().toISOString(),
            isAllowedToReceivePush: {
                [myUid]: true,
                [friendUid]: true,
            }
          });
          console.log('채팅방 생성 및 초기 필드 생성 완료:', chatroomId);
        } else {
          console.log('이미 채팅방 존재:', chatroomId);
        }

        navigation.goBack();
        setFriendEmail('');
        setFriendNickname('');
      } catch (error) {
        console.error('친구 추가 중 오류:', error);
        Alert.alert('오류', '친구 추가 중 문제가 발생했어요.');
      }
    };

    setAddFriendHandler(handleAddFriend);
  }, [friendEmail, friendNickname]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.text}
        placeholder="친구 이름"
        placeholderTextColor="#979797"
        autoFocus={true}
        value={friendNickname}
        onChangeText={setFriendNickname}
      />
      <View style={styles.divider} />
      <TextInput
        style={styles.text}
        placeholder="친구 구글 이메일"
        placeholderTextColor="#979797"
        keyboardType="email-address"
        autoCapitalize="none"
        value={friendEmail}
        onChangeText={setFriendEmail}
      />
      <View style={styles.divider} />
    </View>
  );
};

export default Body;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 35,
  },
  text: {
    fontFamily: 'Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
    marginBottom: 30,
    marginTop: 5,
    width: '100%',
  },
});
