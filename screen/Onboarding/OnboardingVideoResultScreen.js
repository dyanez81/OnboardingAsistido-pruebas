/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, Image, StatusBar, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {DARK_GREY_BLUE, ROYAL_BLUE, SECONDARY_COLOR} from 'utils/colors';
import FinsusLoading from 'components/ui/modals/FinsusLoading';
import {onboardCloseModal} from 'store/actions';
import FinsusBaseModal from 'components/base/FinsusBaseModal';
import NavigationService from 'router/NavigationService';

const OnboardingVideoResultScreen = ({navigation}) => {
  // Parameters
  const typeResult = navigation.getParam('type', 'saved');

  const dispatch = useDispatch();

  // Redux state
  const userData = useSelector(state => state.onboarding.userData);
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);

  // Component state
  const mode = useState(typeResult);

  const onNext = () => {
    // TODO: Validar Scoring Level 1, si alto, llevar Legales, sino, BackLater
    NavigationService.reset('onboardBackLater');
    // navigation.navigate('onboardingLegalList', {levelOne: false});
  };

  const onRecord = () => {
    // Volver a grabar
  };

  const onSchedule = () => {
    // Hacer una cita
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  const getResult = () => {
    switch (mode[0]) {
      case 'saved':
      case 'pending':
        return (
          <View style={styles.textContainer}>
            <Text style={styles.paragraph}>
              Tu video ha sido guardado con éxito y se encuentra en proceso de
              validación.
            </Text>
            <Text style={styles.paragraph}>
              Te notificaremos en cuanto tu cuenta quede validada.
            </Text>
            <Text style={styles.paragraph}>
              Puedes continuar con el uso normal de FINSUS app.
            </Text>
            <Text style={styles.paragraph}>¡Bienvenido de nuevo!</Text>
            <View style={styles.buttonsContainer}>
              <FinsusButtonSecondary
                text={'OK'}
                color={'rgba(0,0,0,0.25)'}
                textColor={'#fff'}
                textSize={13}
                textAlign={'center'}
                onPress={onNext}
              />
            </View>
          </View>
        );
      case 'retry':
        return (
          <View style={styles.textContainer}>
            <Text style={styles.paragraph}>
              El video que grabaste no cumple los requisitos.
            </Text>
            <Text style={styles.paragraph}>
              Por favor, graba de nuevo el video:
            </Text>
            <Text style={styles.paragraph}>
              1.- Diciendo tu nombre completo y “acepto términos y condiciones”.
            </Text>
            <Text style={styles.paragraph}>
              2.- Mostrando tu INE por ambos lados
            </Text>
            <Text style={styles.paragraph}>
              3.- Mostrando tu comprobante de domicilio
            </Text>
            <View style={styles.buttonsContainer}>
              <FinsusButtonSecondary
                text={'Continuar'}
                color={'rgba(0,0,0,0.25)'}
                textColor={'#fff'}
                textSize={13}
                textAlign={'center'}
                onPress={onRecord}
              />
            </View>
          </View>
        );
      case 'resaved':
        return (
          <View style={styles.textContainer}>
            <Text style={styles.paragraph}>
              Tu video ha sido guardado con éxito y se encuentra en proceso de
              validación.
            </Text>
            <Text style={styles.paragraph}>
              Puedes continuar con el uso normal de FINSUS app.
            </Text>
            <Text style={styles.paragraph}>¡Bienvenido de nuevo!</Text>
            <View style={styles.buttonsContainer}>
              <FinsusButtonSecondary
                text={'OK'}
                color={'rgba(0,0,0,0.25)'}
                textColor={'#fff'}
                textSize={13}
                textAlign={'center'}
                onPress={onNext}
              />
            </View>
          </View>
        );
      case 'fail':
        return (
          <View style={styles.textContainer}>
            <Text style={styles.paragraph}>
              Identificamos que el video que enviaste no cumple los requisitos.
            </Text>
            <Text style={styles.paragraph}>Deberás grabar un nuevo video.</Text>
            <Text style={styles.paragraph}>
              Es necesario agendar una cita para concluir tu grabación.
            </Text>
            <View style={styles.buttonsContainer}>
              <FinsusButtonSecondary
                text={'Agendar cita'}
                color={'rgba(0,0,0,0.25)'}
                textColor={'#fff'}
                textSize={13}
                textAlign={'center'}
                onPress={onSchedule}
              />
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden={true} />
      <Icon
        name="keyboard-arrow-left"
        size={36}
        color={'rgb(172,177,192)'}
        style={{position: 'absolute', top: 10, left: 10}}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.logoContainer}>
        <Image
          source={
            mode === 'saved' || mode === 'resaved'
              ? require('assets/images/shieldSuccess.png')
              : require('assets/images/shieldFail.png')
          }
          style={styles.logo}
        />
      </View>
      {getResult()}
      <FinsusBaseModal
        cancelText={'Ok'}
        customStyle={{container: {backgroundColor: ROYAL_BLUE}}}
        done={onCloseModal}
        visible={hasError}>
        <View>
          <Text style={styles.modalText}>{messageError}</Text>
        </View>
      </FinsusBaseModal>
      <FinsusLoading loading={loading} text={'Validando tu información'} />
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
  modalText: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 110,
    height: 110,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  helpContainer: {
    alignSelf: 'center',
  },
  helpIcon: {
    width: 40,
    height: 40,
    marginVertical: 20,
  },
});

export default OnboardingVideoResultScreen;
