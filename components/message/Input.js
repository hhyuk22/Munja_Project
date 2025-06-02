import { View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import send from '../../assets/images/send.png';
import out from '../../assets/images/out.png';

const width = Dimensions.get('window').width;

const Input = ({ onSend, setModal}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper}>
      <TouchableOpacity style={styles.sendWrapper} onPress={() => setModal(true)}>
        <Image source={out} style={styles.out} />
      </TouchableOpacity>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="문자를 입력하세요"
          placeholderTextColor="#888"
          value={text}
          onChangeText={setText}
        />
      </View>
      <TouchableOpacity style={styles.sendWrapper} onPress={handleSend}>
        <Image source={send} style={styles.send} />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Input;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    width: width - 120,
    height: 38,
    backgroundColor: '#EEEEEE',
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 13,
    lineHeight: 25,
    paddingHorizontal: 5,
    fontFamily: 'Regular',
    includeFontPadding: false,
  },
  out: {
    width: 18,
    height: 20,
  },
  send: {
    width: 21,
    height: 18,
    transform: [{ translateY: -2 }],
  },
  sendWrapper: {
    width: 38,
    height: 38,
    backgroundColor: '#EEEEEE',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
