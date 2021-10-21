/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {MAX_CURP_ATTEMPTS} from 'utils/env';
import {DARK_GREY_BLUE, ROYAL_BLUE, SECONDARY_COLOR} from 'utils/colors';
import FinsusLoading from 'components/ui/modals/FinsusLoading';
import {
  onboardOpenModal,
  onboardCloseModal,
  onboardValidateCurp,
} from 'store/actions';
import FinsusBaseModal from 'components/base/FinsusBaseModal';

const OnboardingValidateCurpScreen = ({navigation}) => {
  const dispatch = useDispatch();

  // Redux state
  const userData = useSelector(state => state.onboarding.userData);
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  const tries = useSelector(state => state.onboarding.attempts.curp);

  // Hooks
  useEffect(() => {
    const timer = setTimeout(() => onValidate(), 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const onValidate = () => {
    if (!userData.curp) {
      dispatch(onboardOpenModal('No se pudo recuperar el CURP para validar.'));
      return;
    }

    const user = {curp: userData.curp};
    dispatch(onboardValidateCurp(user));
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden={true} />
      {!loading && (
        <Icon
          name="keyboard-arrow-left"
          size={36}
          color={'rgb(172,177,192)'}
          style={{position: 'absolute', top: 10, left: 10}}
          onPress={() => navigation.goBack()}
        />
      )}
      <Text style={[styles.paragraph, {marginTop: 80}]}>
        Estamos validando tus datos para continuar con tu registro. Espera un
        momento.{'\n'}(esto puede tardar hasta
        <Text style={styles.bold}> 1 </Text>minuto)
      </Text>
      <View style={styles.logoContainer}>
        <Image
          source={
            tries == 0
              ? require('assets/images/shieldSuccess.png')
              : require('assets/images/shieldFail.png')
          }
          style={styles.logo}
        />
      </View>
      {tries > 0 && tries < MAX_CURP_ATTEMPTS && (
        <Text style={styles.paragraph}>
          Lo sentimos, tus datos no pudieron{'\n'}ser validados.{'\n\n'}
          Asegúrate de tener buena iluminación{'\n'}y que la foto de tu INE se
          {'\n'}
          vea claramente.
        </Text>
      )}
      {tries >= MAX_CURP_ATTEMPTS && (
        <View style={styles.failSupport}>
          <Text style={styles.paragraph}>
            Lo sentimos, tus datos no pudieron ser validados.{'\n'}Contacta a
            soporte para que te ayudemos a completar tu registro.
          </Text>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => {
              navigation.navigate('help');
            }}
            style={styles.helpContainer}>
            <Image
              source={require('assets/icons/help.png')}
              style={styles.helpIcon}
            />
          </TouchableHighlight>
        </View>
      )}
      <FinsusBaseModal
        cancelText={'Ok'}
        customStyle={{container: {backgroundColor: ROYAL_BLUE}}}
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}>
        <View>
          <Text style={styles.modalText}>{messageError}</Text>
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
    backgroundColor: 'white',
  },
  paragraph: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    letterSpacing: 0.15,
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 60,
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
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 110,
    height: 110,
  },
  failSupport: {
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

export default OnboardingValidateCurpScreen;
