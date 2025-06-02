import { View, Text } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/setting/Header'
import Body from '../../components/setting/Body'
import SignoutModal from '../../components/setting/SignoutModal'
import { useAuth } from '@clerk/clerk-expo'

const SettingScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Header />
        <Body />
    </View>
  )
}

export default SettingScreen