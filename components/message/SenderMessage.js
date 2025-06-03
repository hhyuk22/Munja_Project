import { View, StyleSheet, Linking } from 'react-native'
import ParsedText from 'react-native-parsed-text'

const SenderMessage = ({text}) => {
  return (
    <View style={styles.container}>
      <ParsedText
          style={styles.message}
          parse={[
            { type: 'url', style: styles.url, onPress: (url) => Linking.openURL(url) }
          ]}
        >
          {text}
      </ParsedText>
    </View>
  )
}

export default SenderMessage

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingRight:25,
    paddingLeft:100,
    flexDirection : 'row',
    justifyContent: 'space-between',
  },
  message:{
    fontFamily: "Regular",
    fontSize: 13,
    lineHeight: 35,
    flex:1,
    textAlign: 'right'
  },
  url: {
    fontFamily: "Regular",
    fontSize: 13,
    lineHeight: 35,
    flex:1,
    textAlign: 'right',
  },
})