import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo';
import { db } from '../../database/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Body = () => {
    const {user} = useUser()
    const navigation = useNavigation()
    const myUid = user?.id;
    const email = user?.primaryEmailAddress?.emailAddress;
    const [name, setName] = useState('');
    useFocusEffect(
        useCallback(() => {
        const fetchName = async () => {
            if (!user?.id) return;
            const ref = doc(db, 'users', user.id);
            const snap = await getDoc(ref);
            if (snap.exists()) {
            setName(snap.data().name || '');
            }
        };
        fetchName();
        }, [user?.id])
    );

    const gotoname = () => {
        navigation.navigate('Editname');
    }
    const gotoonboard = () => {
        navigation.navigate('Setonboarding');
    }
    const gotosignout = () => {
        navigation.navigate('Signout');
    }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
      <TouchableOpacity>
        <Text style={styles.text} onPress={gotoname}>이름 바꾸기</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.text} onPress={gotoonboard}>문자 시작 가이드</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.text}>공지사항</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.text} onPress={() => Linking.openURL('https://artistic-form-8f2.notion.site/1f9ac3095aae804897b4c40bc1bc1f3e')}>개인정보 처리방침</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.text} onPress={gotosignout}>계정 관리</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Body

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 35,
  },
  name: {
    fontFamily: 'Bold',
    fontSize: 17,
    lineHeight: 25,
  },
  email: {
    fontFamily: 'Regular',
    fontSize: 15,
    lineHeight: 25,
  },
  text:{
    fontFamily: 'Regular',
    fontSize: 17,
    lineHeight: 25,
    paddingTop: 30
  }
});