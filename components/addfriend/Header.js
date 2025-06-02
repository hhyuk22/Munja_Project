import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import vector from '../../assets/images/vector.png';
import { useNavigation } from '@react-navigation/native';

const Header = ({ onConfirm }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={vector} style={styles.vector} />
      </TouchableOpacity>
      <Text style={styles.addTitle}>구글 이메일로 추가</Text>
      <TouchableOpacity style={styles.nextWrapper} onPress={onConfirm}>
        <Text style={styles.next}>확인</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    paddingBottom: 15,
    paddingHorizontal: 35,
    flexDirection: 'row',
  },
  vector: {
    width: 10,
    height: 20,
  },
  addTitle: {
    fontFamily: 'Bold',
    fontSize: 20,
    marginLeft: 30,
    includeFontPadding: false,
    transform: [{ translateY: -5 }],
  },
  nextWrapper: {
    marginLeft: 'auto',
  },
  next: {
    fontFamily: 'Medium',
    fontSize: 15,
    includeFontPadding: false,
  },
});
