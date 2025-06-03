import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../database/firebase-config';
import { useNavigation } from '@react-navigation/native';

const Body = ({ friendUid, currentName, setUpdateHandler }) => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [newName, setNewName] = useState(currentName || '');

  useEffect(() => {
    setUpdateHandler(() => async () => {
      if (!newName.trim()) {
        Alert.alert('오류', '이름을 입력해주세요.');
        return;
      }

      try {
        await updateDoc(doc(db, `users/${user.id}/friends`, friendUid), {
          customName: newName.trim(),
        });
        navigation.goBack();

      } catch (err) {
        console.error('이름 업데이트 실패:', err);
        Alert.alert('오류', '이름 변경에 실패했습니다.');
      }
    });
  }, [newName]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.text}
        placeholder="친구 이름"
        placeholderTextColor="#979797"
        value={newName}
        onChangeText={setNewName}
        autoFocus={true}
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
