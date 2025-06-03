import { Modal, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';

const HomeModal = ({ visible, onClose, onEditName, displayName }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{displayName}</Text>
          <TouchableOpacity style={styles.button} onPress={onEditName}>
            <Text style={styles.text}>친구 이름 바꾸기</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default HomeModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 12,
    width: 260,
    height: 125,
    alignItems: 'left',
  },
  title: {
    fontSize: 17,
    fontFamily: 'Bold',
    paddingBottom: 25,
    lineHeight: 20,
  },
  button: {
    alignItems: 'left',
  },
  text: {
    fontSize: 14,
    fontFamily: 'Medium',
    lineHeight: 20,
  },
});
