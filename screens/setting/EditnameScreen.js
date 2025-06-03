import { View } from 'react-native';
import { useState, useRef } from 'react';
import Header from '../../components/editname/Header';
import Body from '../../components/editname/Body';

const EditnameScreen = () => {
  const [handleUpdateName, setHandleUpdateName] = useState(null);
  const nameRef = useRef('');

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Header onConfirm={() => handleUpdateName && handleUpdateName()} />
      <Body
        nameRef={nameRef}
        setUpdateHandler={setHandleUpdateName}
      />
    </View>
  );
};

export default EditnameScreen;
