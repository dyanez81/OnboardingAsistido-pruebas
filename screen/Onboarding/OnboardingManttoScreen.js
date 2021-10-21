/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image, StatusBar, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {PREREG_WEB_URL} from 'utils/env';
import {DARK_GREY_BLUE, SECONDARY_COLOR} from 'utils/colors';

const OnboardingManttoScreen = ({navigation}) => {
  const goWebRegistration = () => {
    navigation.navigate('webview', {
      url: PREREG_WEB_URL,
      onClose: () => navigation.pop(2),
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden={true} />
      <Icon
        name="close"
        size={32}
        color={'rgb(172,177,192)'}
        style={{position: 'absolute', top: 30, right: 20}}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.logoContainer}>
        <Image
          source={require('assets/images/finsusApp.png')}
          style={styles.logo}
        />
      </View>
      <Text style={styles.paragraph}>
        Estamos mejorando nuestra{'\n'}plataforma para darte un{'\n'}mejor
        servicio.
      </Text>
      <Text style={styles.paragraph}>
        Por el momento no podemos{'\n'}abrir tu cuenta.
      </Text>
      <Text style={styles.paragraph}>
        Déjanos tus datos y te{'\n'}contactaremos muy pronto{'\n'}para que
        puedas vivir la{'\n'}experiencia
        <Text style={styles.bold}>{'\n'}FINSUS App</Text>.
      </Text>
      <View style={styles.buttonsContainer}>
        <FinsusButtonSecondary
          text={'Continuar'}
          color={'rgba(0,0,0,0.25)'}
          textColor={'#fff'}
          textSize={13}
          textAlign={'center'}
          onPress={goWebRegistration}
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
    marginVertical: 80,
  },
  logo: {
    width: 110,
    height: 110,
  },
});

export default OnboardingManttoScreen;
