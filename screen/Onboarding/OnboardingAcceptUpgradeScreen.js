/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, Image, StatusBar, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {DARK_GREY_BLUE, SECONDARY_COLOR, WHITE_GREY} from 'utils/colors';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import {onboardCloseModal, onboardOpenModal} from 'store/actions';

const OnboardingAcceptUpgradeScreen = ({navigation}) => {
  //Redux state
  const dispatch = useDispatch();
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);

  // Component State
  const [form, setForm] = useState({
    contract: false,
    esContract: false,
  });

  // Methods
  const onAccept = () => {
    const {isError, errorForm} = validateForm();
    console.log('Validate form:\n', isError, errorForm);

    if (isError) {
      dispatch(onboardOpenModal(errorForm));
      return;
    }

    navigation.replace('onboardingCongratsUp');
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!form.contract) {
      isError = true;
      errorForm += ', Contrato';
    }
    if (!form.esContract) {
      isError = true;
      errorForm += ', Contrato de Servicios Electrónicos';
    }

    if (isError && errorForm.length > 0) {
      errorForm = 'Debes aceptar:\n\n' + errorForm.substring(2) + '.';
    }

    return {
      isError,
      errorForm,
    };
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
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
      <Text
        style={{
          ...styles.paragraph,
          ...styles.bold,
          fontSize: 16,
        }}>
        ¡Felicidades!
      </Text>
      <Text style={{...styles.paragraph, marginBottom: 40}}>
        Tu cuenta FINSUS ha sido validada
        {'\n'}
        correctamente.
      </Text>
      <View style={styles.row}>
        <View style={styles.columnText}>
          <Text style={styles.textContract}>Acepto contrato</Text>
        </View>
        <View styles={styles.columnIcon}>
          <Icon
            name={form.contract ? 'check-circle' : 'radio-button-unchecked'}
            size={24}
            color={'gray'}
            onPress={() =>
              setForm({
                ...form,
                contract: !form.contract,
              })
            }
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.columnText}>
          <Text style={styles.textContract}>
            Acepto contrato de Servicios Electrónicos
          </Text>
        </View>
        <View styles={styles.columnIcon}>
          <Icon
            name={form.esContract ? 'check-circle' : 'radio-button-unchecked'}
            size={24}
            color={'gray'}
            onPress={() =>
              setForm({
                ...form,
                esContract: !form.esContract,
              })
            }
          />
        </View>
      </View>
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
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}
        text={messageError}
      />
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
    width: '80%',
    marginVertical: 12,
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

export default OnboardingAcceptUpgradeScreen;
