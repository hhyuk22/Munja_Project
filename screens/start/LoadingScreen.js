import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { View, Image } from 'react-native';
import loading from '../../assets/images/loading.png'

const LoadingScreen = () => {

  const navigation = useNavigation();

  useEffect(() => { //시작할 때 문구 3초 보여주기기
    const timeout = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <Image source={loading}
        style={{
          width: '100%',
          height: '100%',
        }}/>
    </View>
  );
};

export default LoadingScreen;

