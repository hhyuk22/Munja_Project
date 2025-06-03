import { Modal, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import message from '../../assets/images/message.png';

const MessageModal = ({ visible, onClose, onEnd }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <Image source={message} style={styles.icon} />
          <Text style={styles.title}>오늘의 문자를{'\n'}마무리 할까요?</Text>
          <Text style={styles.subtitle}>(상대방에게는 알림이 가지 않습니다.)</Text>
          <TouchableOpacity style={styles.endButton} onPress={onEnd}>
            <Text style={styles.endText}>마무리 하기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>더 대화 할래요</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default MessageModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ffffff',
    width: 250,
    height: 285,
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    width: 26,
    height: 26,
    marginTop: 45,
  },
  title: {
    fontSize: 15,
    fontFamily: 'SemiBold',
    textAlign: 'center',
    marginTop: 25,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 10,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Medium',
  },
  endButton: {
    backgroundColor: '#808080',
    borderRadius: 7,
    width: 220,
    height: 35,
    alignItems: 'center',
    marginTop: 26,
    justifyContent: 'center',
  },
  endText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Bold',
    color: 'white',
  },
  cancelText: {
    fontSize: 12,
    fontFamily: 'Medium',
    lineHeight: 30,
    marginTop: 13,
  },
});