import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth, useAuth } from '@clerk/clerk-expo';
import GoogleLogo from '../assets/images/google_logo.png';
import { useNavigation } from '@react-navigation/native';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../database/firebase-config';
import ParsedText from 'react-native-parsed-text';

// 클럭 세션 처리를 위해 필요
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { getToken } = useAuth();

  const handleLogin = async () => {
  try {
    const { createdSessionId, setActive } = await startOAuthFlow();
    if (createdSessionId && setActive) {
      await setActive({ session: createdSessionId });
    }
  } catch (err) {
    console.error('로그인 오류:', err);
  }
  };
  const link = () => {
    Linking.openURL('https://artistic-form-8f2.notion.site/1f9ac3095aae804897b4c40bc1bc1f3e')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginTitle}>문자</Text>
      <Text style={styles.loginText}>우리의 연락은 원래</Text>
      <Text style={styles.loginText}>서로에게 힐링이었다</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Image source={GoogleLogo} style={styles.logo} />
        <Text style={styles.googleText}>구글로 계속하기</Text>
      </TouchableOpacity>
      <ParsedText
        style={styles.policyText1}
        parse={[
          {
            pattern: /개인정보 처리방침/,
            style: styles.policy,
            onPress: link
          },
        ]}
      >
        계정 가입은 개인정보 처리방침에
      </ParsedText>
      <Text style={styles.policyText2}>동의하는 것으로 간주합니다.</Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  loginTitle:{
    fontFamily: "Bold",
    fontSize: 38,
  },
  loginText:{
    fontFamily: "Regular",
    fontSize: 13,
    lineHeight: 20,
  },
  googleText:{
    fontFamily: "SemiBold",
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 50
  },
  policyText1:{
    fontFamily: "Regular",
    fontSize: 10,
    position: 'absolute',
    bottom: 35,
    color: '#434343'
  },
  policyText2:{
    fontFamily: "Regular",
    fontSize: 10,
    position: 'absolute',
    bottom: 20,
    color: '#434343'
  },
  policy:{
    fontFamily: "Medium",
    fontSize: 10,
    position: 'absolute',
    bottom: 35,
    color: '#434343',
    textDecorationLine: 'underline',
  },
  logo: {
    width: 32,
    height: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 60,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 80,
  },
})