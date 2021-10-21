/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import NavigationService from 'router/NavigationService';
import RNExitApp from 'react-native-exit-app';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {SECONDARY_COLOR} from 'utils/colors';
import {onboardCloseModal} from 'store/actions';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';

const OnboardingVideocallSavedScreen = ({navigation}) => {
  // Parameters
  const isSchedule = navigation.getParam('schedule', false);

  // Redux state
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  const userData = useSelector(state => state.onboarding.userData);
  const logged = useSelector(state => state.auth.logged);

  // Hooks
  const dispatch = useDispatch();

  const goNext = async () => {
    if (logged === true) NavigationService.reset('main');
    else RNExitApp.exitApp();
  };

  /**
   * @Desc: Validar si el cliente tiene nivel 1 o 2
   * @date 2021-01-29 10:06:42
   */
  const hasLevel = () => {
    return userData.level == '1' || userData.level == '2';
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
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
            source={require('assets/images/shieldWorld.png')}
            style={styles.logo}
          />
        </View>
        {!isSchedule && (
          <>
            <Text style={styles.paragraph}>
              La información de videollamada ha sido guardada con éxito y se
              encuentra en proceso de validación.
            </Text>
            <Text style={styles.paragraph}>
              Te notificaremos en cuanto tu cuenta quede validada y puedas
              operar en nivel 2.
            </Text>
          </>
        )}
        {isSchedule && (
          <>
            <Text style={styles.paragraph}>
              Tu cita se ha registrado correctamente.
            </Text>
            <Text style={styles.paragraph}>
              Te contactaremos para tu videollamada en el día y horario que
              proporcionaste.
            </Text>
          </>
        )}
        {hasLevel() && (
          <Text style={styles.paragraph}>
            Puedes continuar con el uso de FINSUS App.
          </Text>
        )}
        {!hasLevel() && (
          <Text style={styles.paragraph}>
            Puedes continuar con el registro.
          </Text>
        )}
        <View style={styles.buttonsContainer}>
          <FinsusButtonSecondary
            text={logged === true ? 'Ok' : 'Cerrar'}
            color={'rgba(0,0,0,0.25)'}
            textColor={'#fff'}
            textSize={13}
            textAlign={'center'}
            onPress={goNext}
          />
        </View>
      </View>
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}
        text={messageError}
      />
    </OnboardingLevelOne>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
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
    marginVertical: 5,
  },
  bold: {
    color: SECONDARY_COLOR,
  },
  checkContainer: {
    marginVertical: 60,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 110,
    height: 110,
  },
});

export default OnboardingVideocallSavedScreen;
