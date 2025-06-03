import { View } from 'react-native'
import { useState } from 'react'
import Header from '../components/home/Header'
import ChatList from '../components/home/ChatList'
import HomeModal from '../components/home/HomeModal'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
  const [modal, setModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff'}}>
      <Header />
      <ChatList setModal={setModal} setSelectedChat={setSelectedChat}/>
      <HomeModal //채팅방 나가기, 친구 차단 추가 예정
        visible={modal}
        onClose={() => setModal(false)}
        onEditName={() => {
          setModal(false);
          if (selectedChat) {
            navigation.navigate('Editfriend', {
              friendUid: selectedChat.friendUid,
              currentName: selectedChat.displayName,
            });
          }
        }}
        displayName={selectedChat?.displayName}
      />
    </View>
  )
}

export default HomeScreen