/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {ROYAL_BLUE, SECONDARY_COLOR} from 'utils/colors';
import {
  onboardSendSMS,
  onboardSetUserCloseModal,
  onboardSetUserOpenModal,
} from 'store/actions';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import FinsusBaseModal from 'components/base/FinsusBaseModal';
import moment from 'moment';

const OnboardingVideocallIndicationScreen = ({navigation}) => {
  // Parameters
  const isPending = navigation.getParam('pending', false);

  // Constants
  const _start = moment('09:00', 'HH:mm');
  const _end = moment('23:00', 'HH:mm');

  // Redux state
  const hasError = useSelector(state => state.onboarding.userData.hasError);
  const messageError = useSelector(state => state.onboarding.userData.error);
  const loading = useSelector(state => state.onboarding.userData.loading);
  const userPhone = useSelector(state => state.onboarding.userData.phone);

  // Component state
  const [manifest, setManifest] = useState(false);
  const [showSchedule, setSchedule] = useState(false);

  // Hooks
  const dispatch = useDispatch();

  const onLater = () => {
    if (showSchedule) setSchedule(false);
    navigation.goBack();
  };

  const onSchedule = () => {
    const {isError, errorForm} = validateForm();
    if (isError) {
      dispatch(onboardSetUserOpenModal(errorForm));
      return;
    }

    if (showSchedule) setSchedule(false);
    dispatch(
      onboardSendSMS(
        userPhone,
        true,
        isPending ? 'scheduleCallPending' : 'scheduleCall',
      ),
    );
  };

  const onVideocall = () => {
    if (checkTimes()) {
      setSchedule(true);
      return;
    }

    const {isError, errorForm} = validateForm();
    if (isError) {
      dispatch(onboardSetUserOpenModal(errorForm));
      return;
    }

    dispatch(
      onboardSendSMS(
        userPhone,
        true,
        isPending ? 'videocallPending' : 'videocall',
      ),
    );
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    if (manifest == false) {
      isError = true;
      errorForm += '\nDebes aceptar la grabación de audio e imagen.';
    }

    return {
      isError,
      errorForm,
    };
  };

  const checkTimes = () => {
    const _now = moment();
    return _now.isBefore(_start) || _now.isAfter(_end);
  };

  const onCloseModal = () => {
    dispatch(onboardSetUserCloseModal());
  };

  return (
    <OnboardingLevelOne
      loading={loading && navigation.isFocused()}
      titleBox={null}
      noHeader={true}
      hideHelp={true}
      navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('assets/images/shieldSuccess.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.paragraph}>
          En<Text style={styles.bold}> FINSUS </Text>nos preocupamos por tu
          seguridad, y para ofrecerte mayor
          <Text style={styles.bold}> protección </Text>necesitamos agregar
          validaciones. Por lo anterior te pedimos tu autorización para realizar
          la siguiente comunicación por
          <Text style={styles.bold}> videollamada</Text>, en la cual grabaremos
          audio e imagen.
        </Text>
        <Text style={[styles.paragraph, styles.point]}>
          <Text style={styles.bold}>1.- </Text>Deberás responder las preguntas
          del ejecutivo.
        </Text>
        <Text style={[styles.paragraph, styles.point]}>
          <Text style={styles.bold}>2.- </Text>Deberás mostrar la documentación
          con la que te registraste (INE y comprobante de domicilio.
        </Text>
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => {}}
          style={{marginVertical: 10}}>
          <Text style={[styles.label10, styles.link]}>
            Términos y condiciones
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => setManifest(!manifest)}
          style={{marginVertical: 10}}>
          <Text style={styles.label10}>
            Acepto comunicación por audio e imagen{'  '}
            <Icon
              name={manifest ? 'check-circle' : 'radio-button-unchecked'}
              size={20}
              color={'gray'}
            />
          </Text>
        </TouchableHighlight>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonsSubContainer}>
            <FinsusButtonSecondary
              text={'Realizar videollamada ahora'}
              color={'rgba(0,0,0,0.25)'}
              textColor={'#fff'}
              textSize={13}
              textAlign={'center'}
              onPress={onVideocall}
            />
            <FinsusButtonSecondary
              text={'Agendar cita'}
              color={'rgba(0,0,0,0.25)'}
              textColor={'#fff'}
              textSize={13}
              textAlign={'center'}
              onPress={onSchedule}
            />
          </View>
          <FinsusButtonSecondary
            text={'Volver después'}
            color={'rgba(0,0,0,0.25)'}
            textColor={'#fff'}
            textSize={13}
            textAlign={'center'}
            onPress={onLater}
          />
        </View>
      </View>
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}
        text={messageError}
      />
      <FinsusBaseModal
        visible={showSchedule && navigation.isFocused()}
        cancelText={'Volver\ndespués'}
        done={onLater}
        showAccept={true}
        acceptText={'Agendar\ncita'}
        onAccept={onSchedule}
        customStyle={modalStyle}>
        <Text style={styles.modalText}>
          Por el momento no podemos conectarte con un agente.
        </Text>
        <Text style={styles.modalText}>
          El horario de atención es de {_start.format('h:mma')} a{' '}
          {_end.format('h:mma')} de Lunes a Viernes.
        </Text>
      </FinsusBaseModal>
    </OnboardingLevelOne>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  point: {
    textAlign: 'left',
  },
  bold: {
    color: SECONDARY_COLOR,
  },
  label10: {
    fontFamily: 'Montserrat-Light',
    fontSize: 10,
    color: 'rgb(172,177,192)',
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
  },
  titleBoxContainer: {},
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 26,
  },
  buttonsSubContainer: {
    width: '75%',
    alignItems: 'center',
    marginVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 26,
  },
  logo: {
    width: 110,
    height: 110,
  },
  modalText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 15,
    letterSpacing: 0.15,
    textAlign: 'center',
    color: '#fff',
    width: '80%',
    marginBottom: 15,
  },
});

const modalStyle = StyleSheet.create({
  container: {
    backgroundColor: ROYAL_BLUE,
    alignItems: 'center',
  },
  button: {
    height: 50,
    width: '90%',
  },
  text: {
    fontSize: 12,
  },
});

export default OnboardingVideocallIndicationScreen;
