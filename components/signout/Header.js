import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import vector from '../../assets/images/vector.png'
import { useNavigation } from '@react-navigation/native'

const Header = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.vectorWrapper}
            onPress={() => navigation.goBack()}>
            <Image source={vector} style={styles.vector} />
        </TouchableOpacity>
        <Text style={styles.settingTitle}>계정 관리</Text>
        <View style={{flex: 1}}/>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    paddingBottom: 15,
    paddingHorizontal: 35,
    flexDirection : 'row',
    justifyContent: 'space-between',
  },
  vectorWrapper:{
    flex:1
  },
  vector:{
    width: 10,
    height: 20,
  },
  settingTitle:{
    fontFamily: "Bold",
    fontSize: 18,
    lineHeight: 20,
    flex:1,
    textAlign: 'center'
  },
  
})