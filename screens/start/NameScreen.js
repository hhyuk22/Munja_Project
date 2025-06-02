import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../database/firebase-config'
import { useUser } from '@clerk/clerk-expo'

const NameScreen = () => {
  const navigation = useNavigation()
  const { user } = useUser()
  const [name, setName] = useState('')

  const isComplete = name.trim() !== ''

  const updateName = async () => {
    try {
      if (!user?.id) {
        console.warn('❌ Clerk 유저 ID 없음')
        return
      }

      await setDoc(
        doc(db, 'users', user.id),
        { name },
        { merge: true }
      )
      console.log('✅ Firestore에 이름 저장 완료:', name)
      navigation.navigate('Home')
    } catch (err) {
      console.error('❌ 이름 저장 실패:', err.message ?? err)
    }
  }

  const onSubmit = () => {
    if (!isComplete) return
    updateName()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.ment}>문자에서 사용할 이름을 정해주세요</Text>
      <TextInput
        style={styles.name}
        placeholder="이름"
        placeholderTextColor="#979797"
        autoFocus={true}
        value={name}
        onChangeText={setName}
        maxLength={20}
      />
      <TouchableOpacity style={styles.nextWrapper} onPress={onSubmit}>
        <Text style={isComplete ? styles.nextActive : styles.next}>확인</Text>
      </TouchableOpacity>
    </View>
  )
}

export default NameScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  ment: {
    fontFamily: 'SemiBold',
    fontSize: 14,
    includeFontPadding: false,
    paddingBottom: 50,
  },
  name: {
    fontFamily: 'Regular',
    fontSize: 23,
    lineHeight: 30,
    includeFontPadding: false,
  },
  nextWrapper: {
    position: 'absolute',
    bottom: 25,
    right: 30,
  },
  next: {
    fontFamily: 'Medium',
    fontSize: 15,
    color: '#979797',
  },
  nextActive: {
    fontFamily: 'Medium',
    fontSize: 15,
    color: '#000',
  },
})
