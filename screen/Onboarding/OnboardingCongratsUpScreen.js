/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, Image, StatusBar, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import RNExitApp from 'react-native-exit-app';

import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {DARK_GREY_BLUE, SECONDARY_COLOR, WHITE_GREY} from 'utils/colors';
import {UDIS20_AMOUNT, UDIS20_CANT} from 'utils/env';

const OnboardingCongratsUpScreen = ({navigation}) => {
  // Parameters
  const review = navigation.getParam('review', true);

  // Component state
  const [accept, setAccept] = useState(false);

  const onAccept = () => {
    RNExitApp.exitApp();
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
      <Text style={{...styles.paragraph, ...styles.blue, fontSize: 16}}>
        ¡Felicidades!
      </Text>
      <Text style={styles.paragraph}>
        Ahora eres cliente<Text style={styles.bold}> nivel 2</Text>
        {'\n'}de Financiera Sustentable.
      </Text>
      <Text style={styles.paragraph}>
        {`Ahora puedes depositar e\ninvertir hasta ${UDIS20_CANT} UDIS,\nlo que son\naproximadamente\n${UDIS20_AMOUNT}`}
      </Text>
      {review && (
        <View style={styles.row}>
          <View style={styles.columnText}>
            <Text style={styles.textContract}>
              Entiendo las nuevas condiciones de uso
            </Text>
          </View>
          <View styles={styles.columnIcon}>
            <Icon
              name={accept ? 'check-circle' : 'radio-button-unchecked'}
              size={36}
              color={'gray'}
              onPress={() => setAccept(!accept)}
            />
          </View>
        </View>
      )}
      <View style={styles.buttonsContainer}>
        <FinsusButtonSecondary
          text={'Continuar'}
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
    width: '80%',
  },
  blue: {
    color: SECONDARY_COLOR,
  },
  bold: {
    fontFamily: 'Montserrat-Bold',
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
  row: {
    flexDirection: 'row',
    width: '60%',
    marginVertical: 32,
  },
  columnText: {
    flex: 1,
  },
  columnIcon: {},
  textContract: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    letterSpacing: 0.26,
    color: WHITE_GREY,
  },
});

export default OnboardingCongratsUpScreen;
