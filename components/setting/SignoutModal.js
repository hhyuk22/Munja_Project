import { Modal, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import out from '../../assets/images/out.png';

const SignoutModal = ({ visible, onClose, onEnd }) => {
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
          <Image source={out} style={styles.icon} />
          <Text style={styles.title}>계정 삭제</Text>
          <Text style={styles.subtitle}>확인을 누르면 계정이 최종적으로 삭제됩니다.</Text>
          <Text style={styles.subtitle}>삭제하시겠습니까?</Text>
          <TouchableOpacity style={styles.endButton} onPress={onEnd}>
            <Text style={styles.endText}>확인</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SignoutModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ffffff',
    width: 275,
    height: 285,
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 28,
    marginTop: 38,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Bold',
    textAlign: 'center',
    marginTop: 29,
    marginBottom: 19,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Medium',
  },
  endButton: {
    backgroundColor: '#808080',
    borderRadius: 7,
    width: 240,
    height: 35,
    alignItems: 'center',
    marginTop: 25,
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