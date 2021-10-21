/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image, StatusBar, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {DARK_GREY_BLUE, SECONDARY_COLOR} from 'utils/colors';

const OnboardingCongratsScreen = ({navigation}) => {
  // Parameters
  const lvl1 = navigation.getParam('levelOne', true);

  const onAccept = () => {
    navigation.replace('onboardPickLevel');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden={true} />
      <View style={styles.logoContainer}>
        <Image
          source={require('assets/images/finsusApp.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.iconContainer}>
        <LottieView
          source={require('assets/animations/success.json')}
          autoPlay
          loop
        />
      </View>
      <Text style={{...styles.paragraph, ...styles.bold, fontSize: 16}}>
        ¡Felicidades!
      </Text>
      <Text style={styles.paragraph}>La cuenta Finsus Nivel 3 se creo de forma correcta </Text>
      <View style={styles.buttonsContainer}>
        <FinsusButtonSecondary
          text={'Inicio'}
          color={'rgba(0,0,0,0.25)'}
          textColor={'#fff'}
          textSize={13}
          textAlign={'center'}
          onPress={onAccept}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    backgroundColor: DARK_GREY_BLUE,
  },
  paragraph: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    letterSpacing: 0.15,
    color: 'rgb(172,177,192)',
    textAlign: 'center',
    marginHorizontal: 30,
    marginVertical: 10,
  },
  bold: {
    color: SECONDARY_COLOR,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  logo: {
    width: 110,
    height: 110,
  },
  iconContainer: {
    width: '100%',
    height: 100,
    alignSelf: 'center',
    left: '2%',
    marginBottom: 20,
  },
});

export default OnboardingCongratsScreen;
