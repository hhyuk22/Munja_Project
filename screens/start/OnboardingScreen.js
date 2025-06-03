import { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@clerk/clerk-expo';

const { width } = Dimensions.get('window');

const slides = [
    "문자는 답장을 보내야 '읽음 처리'가 됩니다.\n\n편하게 연락을 확인하세요.",
    "하지만 답장은 꼭 하루 안으로 해주세요.\n\n24시간이 지나면 대화는 자동으로 마무리 됩니다.",
    "문자는 상대방에게 알림을 보내지 않습니다.\n\n여유를 가지고 답장을 적어보세요.",
    "대화하고 있다는 사실은 그 자체로 소중합니다. \n\n더 이상 사소한 것들에 신경쓰지 마세요.\n\n오늘 하루 당신에게 즐거운 문자가 있기를"
];

const OnboardingScreen = () => {
    const flatListRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigation = useNavigation();
    const { isSignedIn } = useAuth();
    
    const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };
    
    const renderItem = ({ item, index }) => (
    <View style={styles.slide}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );
  
  return (
      <View style={styles.container}>
      <FlatList
        data={slides}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        ref={flatListRef}
      />
      <View style={styles.footer}>
        {currentIndex !== slides.length - 1 && (
            <View style={styles.dotsWrapper}>
            <View style={styles.dots}>
                {slides.map((_, i) => (
                <View
                    key={i}
                    style={[
                    styles.dot,
                    i === currentIndex ? styles.dotActive : styles.dotInactive
                    ]}
                />
                ))}
            </View>
            </View>
        )}

        {currentIndex === slides.length - 1 && (
            <TouchableOpacity
                style={styles.startWrepper}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.startText}>시작하기</Text>
            </TouchableOpacity>
        )}
        </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  slide: {
    width: width,
    height: '100%',
    paddingTop: '100%',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  text: {
    fontFamily: 'Medium',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  dotsWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: '#808080',
  },
  dotInactive: {
    backgroundColor: '#EEEEEE',
  },
  startWrepper: {
    position: 'absolute',
    bottom: 25,
    right: 30,
  },
  startText: {
    fontFamily: 'Medium',
    fontSize: 15,
    color: '#000',
  },
});
