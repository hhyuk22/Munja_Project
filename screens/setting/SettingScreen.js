import { View } from 'react-native'
import Header from '../../components/setting/Header'
import Body from '../../components/setting/Body'

const SettingScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Header />
        <Body />
    </View>
  )
}

export default SettingScreen