/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StatusBar,
  Linking,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNExitApp from 'react-native-exit-app';

import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import FinsusBaseModal from 'components/base/FinsusBaseModal';
import {UDIS_INFO, UDIS15_CANT, UDIS15_AMOUNT} from 'utils/env';
import {DARK_GREY_BLUE, ROYAL_BLUE, SECONDARY_COLOR} from 'utils/colors';

const OnboardingWelcomeScreen = ({navigation}) => {
  // Component state
  const [showInfo, setShowInfo] = useState(false);

  const goBanxico = () => {
    Linking.canOpenURL(UDIS_INFO).then(supported => {
      if (supported) {
        Linking.openURL(UDIS_INFO);
      }
    });
  };

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
      <Text style={{...styles.paragraph, ...styles.bold, fontSize: 16}}>
        ¡Bienvenido a Finsus!
      </Text>
      <Text style={styles.paragraph}>
        Tu cuenta ha sido creada{'\n'}con éxito.
      </Text>
      <Text style={styles.paragraph}>
        Ahora puedes depositar mensualmente hasta
        <Text style={styles.bold}> {UDIS15_AMOUNT} </Text>aproximadamente.
        <Icon
          name="info"
          size={18}
          color={SECONDARY_COLOR}
          onPress={() => setShowInfo(true)}
          style={{position: 'absolute', top: 10}}
        />
      </Text>
      <Text style={styles.paragraph}>
        Este límite se renueva cada mes{'\n'}para que tu ahorro continúe{'\n'}
        incrementándose.
      </Text>
      <View style={styles.buttonsContainer}>
        <FinsusButtonSecondary
          text={'Ok'}
          color={'rgba(0,0,0,0.25)'}
          textColor={'#fff'}
          textSize={13}
          textAlign={'center'}
          onPress={onAccept}
        />
      </View>
      <FinsusBaseModal
        cancelText={'Ok'}
        customStyle={{container: {backgroundColor: ROYAL_BLUE}}}
        done={() => setShowInfo(false)}
        visible={showInfo}>
        <View>
          <Text style={styles.modalText}>
            Por disposición oficial, en la apertura de cuenta no presencial para
            una SOFIPO, el límite para depósitos mensual es de {UDIS15_CANT}{' '}
            udis, lo que en pesos equivale aproximadamente a {UDIS15_AMOUNT}.
          </Text>
          <Text style={{...styles.modalText, marginBottom: 0}}>
            Consulta aquí el valor actual:
          </Text>
          <TouchableHighlight underlayColor={'#0002'} onPress={goBanxico}>
            <Text style={styles.modalLink}>https://www.banxico.org.mx</Text>
          </TouchableHighlight>
        </View>
      </FinsusBaseModal>
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
  iconInfo: {
    position: 'absolute',
    bottom: 25,
    right: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 60,
  },
  logo: {
    width: 110,
    height: 110,
  },
  modalText: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  modalLink: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 25,
  },
});

export default OnboardingWelcomeScreen;
