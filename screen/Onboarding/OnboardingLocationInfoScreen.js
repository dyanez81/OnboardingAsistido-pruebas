/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {SECONDARY_COLOR} from 'utils/colors';
import {
  onboardCloseModal,
  onboardEndLoading,
  onboardOpenModal,
  onboardStartLoading,
} from 'store/actions';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import {isMexico} from 'utils/mapsUtils';
import {GPS_CONFIG} from 'utils/env';

const OnboardingLocationInfoScreen = ({navigation}) => {
  // Parameters
  const isPending = navigation.getParam('pending', false);

  // Component state
  const [locAuth, setLocAuth] = useState(false);

  // Redux state
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);

  // Hooks
  const dispatch = useDispatch();
  useEffect(() => checkGpsPermisson(), []);

  const checkGpsPermisson = () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      setLocAuth(true);
    } else {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
        .then(response => {
          if (response == true) setLocAuth(true);
        })
        .catch(error => console.log('\nCATCH LOCATION::', error));
    }
  };

  const requestGpsPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return {result: true, message: ''};
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission)
      return {
        result: true,
        message: '',
      };

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED)
      return {
        result: true,
        message: '',
      };

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      return {
        result: false,
        message:
          'Por regulación de la CNBV es necesario registrar la ubicación al momento de registrarte.',
      };
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      return {
        result: false,
        message:
          'Por regulación de la CNBV es necesario registrar la ubicación al momento de registrarte.\n\nPor favor, ajusta los permisos de uicación en configuraciones.',
      };
    }
  };

  const goVideocall = async () => {
    if (locAuth == false) {
      dispatch(onboardOpenModal('Debes activar permiso de localización.'));
      return;
    }

    let _latitude = null;
    let _longitude = null;

    const gpsPermission = await requestGpsPermission();

    // Es obligatorio acceder a la ubicación
    if (!gpsPermission.result) {
      dispatch(onboardOpenModal(gpsPermission.message));
      return;
    }

    dispatch(onboardStartLoading());

    Geolocation.getCurrentPosition(
      position => {
        _latitude = position.coords.latitude;
        _longitude = position.coords.longitude;

        if (!_latitude || !_longitude) {
          dispatch(
            onboardOpenModal(
              'No se pudo obtener la ubicación.  Intenta de nuevo.',
            ),
          );
          return;
        } else if (!isMexico(_latitude, _longitude)) {
          dispatch(
            onboardOpenModal(
              `El registro no puede realizarse desde tu ubicación actual. \n\nLatitud: ${_latitude} \nLongitud: ${_longitude}`,
            ),
          );
          return;
        } else {
          dispatch(onboardEndLoading());
          navigation.navigate('onboardVideocallInfo', {pending: isPending});
        }
      },
      error => {
        dispatch(
          onboardOpenModal(
            'No se pudo obtener la ubicación:\n' + error.message,
          ),
        );
      },
      GPS_CONFIG,
    );
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <OnboardingLevelOne
      loading={loading && navigation.isFocused()}
      messageLoading={'Obteniendo ubicación'}
      titleBox={null}
      noHeader={true}
      hideHelp={true}
      isBackPress
      onBackPress={onBack}
      navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('assets/images/shieldWorld.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.paragraph}>
          Para continuar, es necesario que habilites el
          <Text style={styles.bold}> permiso de localización </Text>en tu
          celular, de esta forma nos ayudarás a detectar cualquier actividad
          inusual con tu cuenta.
        </Text>
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => setLocAuth(!locAuth)}
          style={styles.checkContainer}>
          <Text style={styles.paragraph}>
            Activar permiso de localización{'  '}
            <Icon
              name={locAuth ? 'check-circle' : 'radio-button-unchecked'}
              size={24}
              color={'gray'}
            />
          </Text>
        </TouchableHighlight>
        <View style={styles.buttonsContainer}>
          <FinsusButtonSecondary
            text={'Continuar'}
            color={'rgba(0,0,0,0.25)'}
            textColor={'#fff'}
            textSize={13}
            textAlign={'center'}
            onPress={goVideocall}
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

export default OnboardingLocationInfoScreen;
