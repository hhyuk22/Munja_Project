import { View, Text, StyleSheet, Linking } from 'react-native'
import React from 'react'
import ParsedText from 'react-native-parsed-text'

const ReciverMessage = ({text}) => {
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

export default ReciverMessage

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingRight:100,
    paddingLeft:25,
    flexDirection : 'row',
    justifyContent: 'space-between',
  },
  message:{
    fontFamily: "Regular",
    fontSize: 13,
    lineHeight: 35,
    flex:1,
    textAlign: 'left'
  },
  url: {
    fontFamily: "Regular",
    fontSize: 13,
    lineHeight: 35,
    flex:1,
    textAlign: 'left',
  },
})