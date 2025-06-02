import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import union from '../../assets/images/union.png'
import friend from '../../assets/images/friend.png'
import set from '../../assets/images/set.png'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@clerk/clerk-expo'

const Header = () => {
  const navigation = useNavigation();
  const gotoAdd = () =>{
    navigation.navigate('Addfriend');
  }
  const gotoSet = () =>{
    navigation.navigate('Setting');
  }
  return (
    <View style={styles.container}>
      <Text style={styles.homeTitle}>문자</Text>
      <View style={styles.iconWrapper}>
        <TouchableOpacity onPress={gotoAdd}>
          <Image source={friend} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={gotoSet}>
          <Image source={set} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    paddingBottom: 15,
    paddingHorizontal: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  homeTitle:{
    fontFamily: "Heavy",
    fontSize: 22,
    lineHeight: 30,
  },
  icon:{
    width: 20,
    height: 20,
    marginLeft: 12
  },
  iconWrapper: {
    flexDirection: 'row',
    paddingTop: 6,
  },
})