/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {SECONDARY_COLOR} from 'utils/colors';
import {onboardCloseModal, onboardScheduleVCall} from 'store/actions';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';

const OnboardingVideocallWaitScreen = ({navigation}) => {
  // Parameters
  const isPending = navigation.getParam('pending', false);

  // Redux state
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  const userData = useSelector(state => state.onboarding.userData);

  // Hooks
  const dispatch = useDispatch();
  useEffect(() => onSchedule(), []);

  const onSchedule = () => {
    if (!isPending) {
      const _now = moment().format('DD/MM/YYYY HH:mm:ss');
      dispatch(onboardScheduleVCall(userData, _now, _now, '5'));
    }
  };

  const onCancel = () => {
    navigation.goBack();
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  return (
    <OnboardingLevelOne
      loading={loading && navigation.isFocused()}
      messageLoading={'Solicitando videollamada'}
      titleBox={null}
      noHeader={true}
      hideHelp={true}
      navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('assets/images/clock-blue.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.paragraph}>
          Espera un momento, en breve un asesor te contactará para realizar tu
          videollamada.
        </Text>
        <Text style={styles.paragraph}>
          Asegúrate de tener una buena conexión a internet y tu documentación a
          la mano.
        </Text>
        <View style={styles.buttonsContainer}>
          <FinsusButtonSecondary
            text={'Volver más tarde'}
            color={'rgba(0,0,0,0.25)'}
            textColor={'#fff'}
            textSize={13}
            textAlign={'center'}
            onPress={onCancel}
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
    marginHorizontal: 60,
    marginVertical: 12,
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
    marginTop: 80,
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

export default OnboardingVideocallWaitScreen;
