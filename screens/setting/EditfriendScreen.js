import { View } from 'react-native';
import React, { useRef, useState } from 'react';
import Header from '../../components/editfriend/Header';
import Body from '../../components/editfriend/Body';
import { useRoute } from '@react-navigation/native';

const EditfriendScreen = () => {
  const route = useRoute();
  const { friendUid, currentName } = route.params;
  const friendNicknameRef = useRef('');
  const [handleUpdateName, setHandleUpdateName] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Header onConfirm={() => handleUpdateName && handleUpdateName()} />
      <Body
        friendUid={friendUid}
        currentName={currentName}
        friendNicknameRef={friendNicknameRef}
        setUpdateHandler={setHandleUpdateName}
      />
    </View>
  );
};

export default EditfriendScreen;
