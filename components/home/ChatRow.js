import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatRow = ({ chatroomId, displayName, lastMessage, isRead, item, setModal, setSelectedChat }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate('Message', {
          chatroomId,
          displayName,
        })
      }
      onLongPress={() => {
        setSelectedChat(item);
        setModal(true);
      }}
    >
      <View>
        <Text style={[styles.listName, isRead && styles.readListName]}>{displayName}</Text>
        <Text style={[styles.listMessage, isRead && styles.readListMessage]}>{lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listName: {
    fontFamily: 'Bold',
    fontSize: 15,
    lineHeight: 20,
    paddingBottom: 5,
  },
  listMessage: {
    fontFamily: 'Medium',
    fontSize: 13,
    lineHeight: 20,
    paddingBottom: 3,
  },
  readListName: {
    fontFamily: 'Bold',
    fontSize: 15,
    lineHeight: 20,
    paddingBottom: 5,
    color: '#808080',
  },
  readListMessage: {
    fontFamily: 'Medium',
    fontSize: 13,
    lineHeight: 20,
    paddingBottom: 3,
    color: '#808080',
  },
});
