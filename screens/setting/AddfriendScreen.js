import { View } from 'react-native';
import React, { useRef } from 'react';
import Header from '../../components/addfriend/Header';
import Body from '../../components/addfriend/Body';

const AddfriendScreen = () => {
  const friendEmailRef = useRef('');
  const friendNicknameRef = useRef('');
  const handleAddFriend = { current: null }; // Header에서 호출할 수 있게 전달

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Header
        onConfirm={() => handleAddFriend.current && handleAddFriend.current()}
      />
      <Body
        friendEmailRef={friendEmailRef}
        friendNicknameRef={friendNicknameRef}
        setAddFriendHandler={(fn) => { handleAddFriend.current = fn; }}
      />
    </View>
  );
};

export default AddfriendScreen;
