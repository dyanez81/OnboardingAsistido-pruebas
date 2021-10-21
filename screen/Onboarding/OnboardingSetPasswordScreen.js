import React, {useState} from 'react';
import {View, Text, Dimensions, Platform, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import validator from 'validator';

import FinsusInputTextMaterial from 'components/base/FinsusInputTextMaterial';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import {PASSWORD_PATTERN, PASSWORD_MESSAGE} from 'utils/env';
import {
  onboardSetPassword,
  onboardRegisterAccount,
  onboardPasswordOpenModal,
  onboardPasswordCloseModal,
} from 'store/actions';

const _h = Dimensions.get('window').height;
const OnboardingSetPasswordScreen = ({navigation}) => {
  const fromSignature = navigation.getParam('fromSignature', false);
  //Hooks
  const dispatch = useDispatch();

  //Redux state
  const hasError = useSelector(state => state.onboarding.securityData.hasError);
  const messageError = useSelector(
    state => state.onboarding.securityData.error,
  );
  const loading = useSelector(state => state.onboarding.securityData.loading);
  const onboardRedux = useSelector(state => state.onboarding);

  // Component style
  const [securityData, setSecurityData] = useState({
    password: null,
    confirmPassword: null,
  });

  const onBackPress = () => {
    // TODO: Revisar crash en iOS
    if (fromSignature && Platform.OS == 'android')
      Orientation.lockToLandscape();
    navigation.goBack();
  };

  const onRegister = () => {
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardPasswordOpenModal(errorForm));
      return;
    }

    const userData = {
      phone: onboardRedux.userData.phone,
      email: onboardRedux.userData.email,
      customerCode: onboardRedux.userData.customerCode,
      accountNumber: onboardRedux.userData.accountNumber,
      selfie: onboardRedux.ineSelfieData.items[0].data,
      password: securityData.password,
    };

    dispatch(onboardSetPassword({password: securityData.password}));
    dispatch(onboardRegisterAccount(userData, onboardRedux));
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!securityData.password) {
      isError = true;
      errorForm += ', Contraseña';
    }
    if (!securityData.repeatPassword) {
      isError = true;
      errorForm += ', Repetir Contraseña';
    }

    if (isError && errorForm.length > 0) {
      errorForm =
        'Los siguientes campos son obligatorios:\n\n' +
        errorForm.substring(2) +
        '.';

      return {
        isError,
        errorForm,
      };
    }

    // Otras validaciones
    if (!validator.matches(securityData.password, PASSWORD_PATTERN)) {
      isError = true;
      errorForm = PASSWORD_MESSAGE;
    } else if (
      !validator.equals(securityData.password, securityData.repeatPassword)
    ) {
      isError = true;
      errorForm = 'Las contraseñas no coinciden.';
    }

    return {
      isError,
      errorForm,
    };
  };

  const onCloseModal = () => {
    dispatch(onboardPasswordCloseModal());
  };

  return (
    <OnboardingLevelOne
      title={''}
      isBackPress
      onBackPress={onBackPress}
      loading={loading}
      messageLoading={'Registrando...'}
      noHeader={true}
      navigation={navigation}>
      <View style={styles.informationTitleContainer}>
        <Text style={styles.informationTitle}>
          Tu contraseña será tu firma digital:
        </Text>
        <Text style={[styles.informationSubtitle, {textAlign: 'center'}]}>
          Para que tu contraseña sea segura,{'\n'}debe contener lo siguiente:
        </Text>
        <Text style={styles.informationSubtitle}>
          • 8 caracteres.{'\n'}• Mínimo una letra mayúscula.{'\n'}• Un número
          como mínimo.
        </Text>
      </View>
      <View style={styles.formContainer}>
        <FinsusInputTextMaterial
          placeholder={'Elige una contraseña de 8 caracteres'}
          secureTextEntry={true}
          maxLength={8}
          value={securityData.password}
          onChange={text => {
            setSecurityData({...securityData, password: text});
          }}
        />
        <FinsusInputTextMaterial
          placeholder={'Repite la contraseña      '}
          secureTextEntry={true}
          maxLength={8}
          value={securityData.repeatPassword}
          onChange={text => {
            setSecurityData({...securityData, repeatPassword: text});
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <FinsusButtonSecondary
          text={'Ok'}
          color={'rgba(0,0,0,0.25)'}
          onPress={onRegister}
        />
      </View>
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError}
        text={messageError}
      />
    </OnboardingLevelOne>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  informationTitleContainer: {
    marginTop: '18%',
    marginBottom: 68,
  },
  informationTitle: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgb(172,177, 194)',
    marginBottom: 20,
  },
  informationSubtitle: {
    fontSize: 12,
    color: 'rgb(172,177, 194)',
    marginBottom: 16,
    width: '58%',
    alignSelf: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    top: _h - 100,
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingSetPasswordScreen;
