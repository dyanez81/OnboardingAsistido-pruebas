import React, {useState} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import ConfirmNumberKeyboard from 'components/ui/screens/onboarding/confirmNumber/ConfirmNumberKeyboard';
import ConfirmNumberPassword from 'components/ui/screens/onboarding/confirmNumber/ConfirmNumberPassword';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import FinsusLoading from 'components/ui/modals/FinsusLoading';

import {useKeyboard} from 'hooks/use-keyword';
import {useBackpress} from 'hooks/use-backpress';

import {
  onboardSMSOpenModal,
  onboardSMSCloseModal,
  onboardCreateUser,
  onboardSendSMS,
  onboardSetVideocallData,
} from 'store/actions';

const OnboardingConfirmNumberScreen = ({navigation}) => {
  //Constants
  const passwordNumbers = [
    {number: null},
    {number: null},
    {number: null},
    {number: null},
    {number: null},
  ];

  //Hooks
  const dispatch = useDispatch();

  useBackpress(() => {
    return true;
  });

  const {deleteNumber, pressButtonKeyboard, items} = useKeyboard(
    passwordNumbers,
  );

  //Component state
  const [itemKeys] = useState([
    [
      {
        title: '1',
        onPress: pressButtonKeyboard,
        key: 10,
      },
      {
        title: '2',
        onPress: pressButtonKeyboard,
        key: 11,
      },
      {
        title: '3',
        onPress: pressButtonKeyboard,
        key: 12,
      },
    ],
    [
      {
        title: '4',
        onPress: pressButtonKeyboard,
        key: 13,
      },
      {
        title: '5',
        onPress: pressButtonKeyboard,
        key: 14,
      },
      {
        title: '6',
        onPress: pressButtonKeyboard,
        key: 15,
      },
    ],
    [
      {
        title: '7',
        onPress: pressButtonKeyboard,
        key: 16,
      },
      {
        title: '8',
        onPress: pressButtonKeyboard,
        key: 17,
      },
      {
        title: '9',
        onPress: pressButtonKeyboard,
        key: 18,
      },
    ],
    [
      {
        title: <Icon name="backspace" size={26} color="transparent" />,
        type: 'action',
        onPress: () => {},
        key: 21,
      },
      {
        title: '0',
        onPress: pressButtonKeyboard,
        key: 19,
      },
      {
        title: (
          <Icon name="backspace" size={26} color="rgba(255,255,255, 0.6)" />
        ),
        type: 'action',
        onPress: deleteNumber,
        key: 20,
      },
    ],
  ]);

  //Redux state
  const hasError = useSelector(state => state.onboarding.sms.hasError);
  const messageError = useSelector(state => state.onboarding.sms.error);
  const loading = useSelector(state => state.onboarding.loading);
  const sending = useSelector(state => state.onboarding.userData.loading);
  const userPhone = useSelector(state => state.onboarding.userData.phone);
  const userEmail = useSelector(state => state.onboarding.userData.email);
  const userLevel = useSelector(state => state.onboarding.userData.level);
  const legalItems = useSelector(
    state => state.onboarding.termsConditions.items,
  );
  const codeSMS = useSelector(state => state.onboarding.sms.code);
  const pics = useSelector(state => state.onboarding.ineSelfieData.items);
  const savedPics = pics.filter(pic => pic.data);

  /**
   * @author Juan de Dios
   * @description Validaciones del formulario
   * @returns {Object} devuelve si ocurrió un error y su mensaje.
   */
  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    const sizeItemsSet = items.filter(item => item.number).length;
    const verificacionCode = items.map(item => item.number);

    if (sizeItemsSet < 5) {
      isError = true;
      errorForm = 'Por favor ingrese el código de verificación completo';
    } else if (parseInt(verificacionCode.join(''), 10) !== codeSMS) {
      isError = true;
      errorForm =
        'Los códigos no coinciden, valida tu número de teléfono o presiona el botón enviar nuevo SMS.';
    }

    return {
      isError,
      errorForm,
    };
  };

  const resetNumbers = () => {
    items.forEach(item => (item.number = null));
  };

  /**
   * @author Juan de Dios
   * @description realiza la petición para confirmar la contraseña
   */
  const onConfirmNumber = () => {
    const formType = navigation.getParam('type', 'createUser');
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardSMSOpenModal(errorForm));
      return;
    }

    resetNumbers();
    switch (formType) {
      case 'recordVideo':
        navigation.replace('onboardingUpInstructions', {
          type: 'video',
        });
        break;
      case 'videocall':
        //TODO: Switch para cambiar entre externo o SDK
        navigation.replace('onboardVCallWait');
        break;
      case 'scheduleCall':
        navigation.replace('onboardVCallSchedulle');
        break;
      case 'videocallPending':
        const vcInfo = {fechaInicio: '00:00', fechaFin: '00:00', status: '7'};
        dispatch(onboardSetVideocallData(vcInfo));
        navigation.pop(3);
        break;
      case 'scheduleCallPending':
        navigation.replace('onboardVCallSchedulle', {pending: true});
        break;
      default:
        const _update = savedPics.length >= 3;
        const user = {
          phone: userPhone,
          email: userEmail,
          acceptance: legalItems[2].data ? '1' : '0',
          level: userLevel,
        };
        dispatch(onboardCreateUser(user, !_update));
    }
  };

  /**
   * @author Juan de Dios
   * @description cierra el modal de error o mensaje
   */
  const onCloseModal = () => {
    dispatch(onboardSMSCloseModal());
  };

  /**
   * @author Juan de Dios
   * @description regresa a la pantalla anterior
   */
  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Icon
        name="keyboard-arrow-left"
        size={36}
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 2,
        }}
        color={'white'}
        onPress={onBackPress}
      />
      <View style={styles.subContainer}>
        <Text style={styles.informationTitle}>
          Confirma el código enviado vía SMS:
        </Text>
        <View style={styles.passwordContainer}>
          <ConfirmNumberPassword items={items} title={'Inserta el código:'} />
          <TouchableHighlight
            style={styles.resendSMS}
            underlayColor={'transparent'}
            onPress={() => {
              dispatch(onboardSendSMS(userPhone, false));
            }}>
            <Text style={styles.resendSMSText}>
              No tengo un código,{'\n'}solicitar uno nuevo.
            </Text>
          </TouchableHighlight>
        </View>
        <ConfirmNumberKeyboard items={itemKeys} />
      </View>
      <View style={styles.buttonContainer}>
        <FinsusButtonSecondary
          text={'Ok'}
          color={'rgba(0,0,0,0.25)'}
          onPress={onConfirmNumber}
        />
      </View>
      <FinsusErrorModal
        done={onCloseModal}
        text={messageError}
        visible={hasError}
      />
      <FinsusLoading loading={loading && navigation.isFocused()} key={0} />
      <FinsusLoading
        loading={sending && navigation.isFocused()}
        text={'Enviando mensaje...'}
        key={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(40, 52,96)',
  },
  subContainer: {
    width: '75%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 70,
    marginTop: 58,
  },
  passwordContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  informationTitle: {
    fontSize: 15,
    color: 'rgb(172,177, 194)',
  },
  resendSMS: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 24,
  },
  resendSMSText: {
    color: 'rgb(0, 149, 206)',
  },
  buttonContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 6,
  },
});

export default OnboardingConfirmNumberScreen;
