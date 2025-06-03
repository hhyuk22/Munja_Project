import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuth } from '@clerk/clerk-expo';

const Body = ({setModal}) => {
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