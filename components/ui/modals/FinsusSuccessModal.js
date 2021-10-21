import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FinsusBaseModal from 'components/base/FinsusBaseModal';
import LottieView from 'lottie-react-native';

const FinsusSuccessModal = ({visible, title, text, done}) => {
  return (
    <FinsusBaseModal done={done} visible={visible} cancelText={'Ok'}>
      {title && <Text style={styles.successTitle}>{title}</Text>}
      <Text style={styles.successText}>{text}</Text>
      <View style={styles.iconContainer}>
        <LottieView
          source={require('assets/animations/check.json')}
          autoPlay
          loop
        />
      </View>
    </FinsusBaseModal>
  );
};

const styles = StyleSheet.create({
  successTitle: {
    fontSize: 24,
    letterSpacing: 0.45,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  successText: {
    fontSize: 16,
    letterSpacing: 0.3,
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  iconContainer: {
    width: '80%',
    height: 120,
    alignSelf: 'center',
    left: -8,
  },
});

export default FinsusSuccessModal;
