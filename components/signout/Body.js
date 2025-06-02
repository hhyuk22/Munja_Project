import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo';
import { db } from '../../database/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Body = ({setModal}) => {
    const {user} = useUser()
    const {signOut} = useAuth()
    const handleSignOut = async() => {
        await signOut();
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text style={styles.text} onPress={handleSignOut}>로그아웃</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.text} onPress={() => setModal(true)}>계정 삭제</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Body

const styles = StyleSheet.create({
  container: {
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