import React from 'react';
import {StyleSheet, View, Text, Image, StatusBar} from 'react-native';

const LOGO_BLANCO = require('assets/images/finsusLogoBlanco.png');

const WelcomeSplash = () => {
  return (
    <View style={styles.LoadingContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0095ce" />
      <View style={styles.LoadingTextContainer}>
        <View style={{flex: 2}} />
        <Text style={styles.LoadingText}>
          {'Onboarding\nnivel 3\nAsistido'}
        </Text>
      </View>
      <View style={styles.LoadingPicContainer}>
        <Image style={styles.LoadingPicture} source={LOGO_BLANCO} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  LoadingContainer: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: '#0095ce',
  },
  LoadingTextContainer: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
  },
  LoadingText: {
    flex: 2,
    width: '100%',
    fontFamily: 'Montserrat-Light',
    color: 'white',
    fontSize: 48,
    textAlign: 'center',
  },
  LoadingPicContainer: {
    flex: 2,
    width: '65%',
    alignSelf: 'center',
  },
  LoadingPicture: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
});

export default WelcomeSplash;
