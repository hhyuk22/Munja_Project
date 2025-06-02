import { View, TextInput, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../database/firebase-config';
import { useNavigation } from '@react-navigation/native';

const Body = ({ nameRef, setUpdateHandler }) => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchCurrentName = async () => {
      try {
        const userRef = doc(db, 'users', user.id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const currentName = userSnap.data().name || '';
          setName(currentName);
          nameRef.current = currentName;
        }
      } catch (err) {
        console.error('❌ 이름 불러오기 실패:', err);
      }
    };

    fetchCurrentName();
  }, []);

  useEffect(() => {
    setUpdateHandler(() => async () => {
      const trimmed = nameRef.current.trim();
      if (!trimmed) {
        Alert.alert('오류', '이름을 입력해주세요.');
        return;
      }

      try {
        await updateDoc(doc(db, 'users', user.id), {
          name: trimmed,
        });
        navigation.goBack();
      } catch (err) {
        console.error('❌ 이름 업데이트 실패:', err);
        Alert.alert('오류', '이름 변경에 실패했습니다.');
      }
    });
  }, [nameRef]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.text}
        placeholder="내 이름"
        placeholderTextColor="#979797"
        value={name}
        onChangeText={(text) => {
          setName(text);
          nameRef.current = text;
        }}
        autoFocus
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
