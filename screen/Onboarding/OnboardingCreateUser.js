import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableHighlight, Image, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import validator from 'validator';
import {
  onboardCloseModal,
  onboardOpenModal,
  onboardingSetUser,
  onboardCreateUser,
  onboardUserStart,
  onboardUserEnd,
  onboardSetAddressData,
} from 'store/actions';
import Geolocation from '@react-native-community/geolocation';
import {useBackpress} from 'hooks/use-backpress';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusInputTextMaterial from 'components/base/FinsusInputTextMaterial';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import NumericKeyboardModal from 'components/ui/modals/NumericKeyboardModal';
import OnboardingOption from 'components/ui/screens/onboarding/OnboardingOption';
import {isMexico} from 'utils/mapsUtils';
import {hasLocationPermission} from 'utils/permissions';
import {GPS_CONFIG} from 'utils/env';
import {validateEmail} from 'utils/validations';

const OnboardingCreateUserScreen = ({navigation}) => {
  // Parameters
  const isChecking = navigation.getParam('fromCheckAddress', false);
  //Component state
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    email: '',
    acceptance: '1',
    level: levelAccount,
    emailFake: 'cuentacorreo@dominio.mx',
  });
  const _update = false;

  //Redux state
  const items = useSelector(state => state.onboarding.termsConditions.items);
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);

  //Hooks
  const dispatch = useDispatch();
  useBackpress(() => {
    return true;
  });

  const prevValueRef = useRef();
  const formRef = useRef();
  useEffect(() => {
    formRef.current = form;
  });

  //#region  Manejo del teclado numérico
  /**
   * javascript comment
   * @Author: AZozaya
   * @Date: 2020-03-25 17:01:38
   * @Desc: Evento que se dispara al hacer clic en un número del teclado
   */
  const onKeyboardPress = text => {
    if (formRef.current.phone.length < 10)
      setValuesForm('phone', formRef.current.phone.concat(text));
  };

  /**
   * javascript comment
   * @Author: AZozaya
   * @Date: 2020-04-01 16:20:37
   * @Desc: Evento que se dispara al hacer clic en Borrar
   */
  const onBackspacePress = () => {
    const oldText = formRef.current.phone;
    const newText = oldText.length > 0 ? oldText.slice(0, -1) : '';

    setValuesForm('phone', newText);
  };

  /**
   * javascript comment
   * @Author: AZozaya
   * @Date: 2020-03-25 17:04:06
   * @Desc: Acciones que se disparan al abrirse el teclado
   */
  const onOpenKeyboard = () => {
    prevValueRef.current = formRef.current.phone;
    setShowKeyboard(true);
  };

  /**
   * javascript comment
   * @Author: AZozaya
   * @Date: 2020-03-25 17:04:37
   * @Desc: Acciones que se disparan al hacer clic en Aceptar
   */
  const onAcceptKeyboard = () => {
    setShowKeyboard(false);
  };

  /**
   * javascript comment
   * @Author: AZozaya
   * @Date: 2020-03-25 17:05:01
   * @Desc: Acciones que se disparan al hacer clic en Cancelar
   */
  const onCancelKeyboard = () => {
    setValuesForm('phone', prevValueRef.current);
    setShowKeyboard(false);
  };
  //#endregion /Manejo teclado numérico

  /**
   * @author Juan de Dios
   * @description setea los valores del formulario
   * @param {String} id nombre la propiedad del formulario
   * @param {String} id valor de la propiedad del formulario
   */
  const setValuesForm = (id, value) => {
    setForm({
      ...formRef.current,
      [id]: value,
    });
  };

  /**
   * @author Juan de Dios
   * @description Validaciones del formulario
   * @returns {Object} devuelve si ocurrió un error y su mensaje.
   */
  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!form.email) {
      isError = true;
      errorForm += ', Correo electrónico';
    } else if (threeAccountLevel) {
    }
    if (!form.phone) {
      isError = true;
      errorForm += ', Teléfono';
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

    if (!validateEmail(form.email)) {
      isError = true;
      errorForm += '\n- El correo electrónico no tiene el formato correcto.';
    }
    if (!validator.isNumeric(form.phone, {no_symbols: true})) {
      isError = true;
      errorForm += '\n- El teléfono solo debe incluir números.';
    }
    if (form.phone.length !== 10) {
      isError = true;
      errorForm += '\n- El teléfono debe contener diez dígitos.';
    }

    if (errorForm.length > 0) {
      errorForm = 'Existen las siguientes inconsistencias: \n' + errorForm;
    }

    return {
      isError,
      errorForm,
    };
  };

  const onNext = () => {
    telefono = form.phone;
    if (threeAccountLevel) {
      form.email = form.emailFake;
      dispatch(
        onboardingSetUser({
          email: form.email.toLowerCase(),
          level: form.level,
        }),
      );
      navigation.goBack();
    }
    if (isChecking === true) {
      dispatch(
        onboardingSetUser({
          email: form.email.toLowerCase(),
          level: form.level,
          
        }),
      );
      navigation.goBack();
    } else {
      onRegister();
    }
  };

  /**
   * @author Juan de Dios
   * @description envia el mensaje de validación al teléfono del usuario
   */
  const onRegister = async () => {
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardOpenModal(errorForm));
      return;
    }

    let _latitude = null;
    let _longitude = null;

    const _permission = await hasLocationPermission();

    // Es obligatorio acceder a la ubicación
    if (!_permission.result) {
      dispatch(onboardOpenModal(_permission.message));
      return;
    }

    dispatch(onboardUserStart());

    Geolocation.getCurrentPosition(
      position => {
        /* INFO:
          { coords: {accuracy, altitude, heading, latitude, longitude, speed}, mocked, timestamp } */
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
          dispatch(
            onboardSetAddressData({
              latitude: _latitude,
              longitude: _longitude,
            }),
          );
          dispatch(
            onboardingSetUser({
              phone: form.phone,
              email: form.email.toLowerCase(),
            }),
          );

          dispatch(onboardUserEnd());
          dispatch(onboardCreateUser(form, true));
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

  /**
   * @author Juan de Dios
   * @description regresa a la vista anterior
   **/
  const onBackPress = () => {
    navigation.replace('onboardPickLevel');
  };

  /**
   * @author Juan de Dios
   * @description cierra el modal de error o mensaje
   */
  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  const onReadPrivacy = () => {
    if (showKeyboard) setShowKeyboard(false);
    navigation.navigate('onboardingReadLegal', {type: 'privacy'});
  };

  return (
    <OnboardingLevelOne
      title={
        threeAccountLevel
          ? showKeyboard
            ? ''
            : 'CREA EL\nEXPEDIENTE\nFINANCIERO'
          : showKeyboard
          ? ''
          : 'CREA EL\nEXPEDIENTE\nFINANCIERO'
      }
      isBackPress
      onBackPress={onBackPress}
      loading={loading && navigation.isFocused()}
      messageLoading={'Un momento...'}
      noHeader={showKeyboard}
      navigation={navigation}>
      <Image source={require('/assets/icons/curp.png')} style={styles.imagetitle}></Image>
      <View style={styles.informationTitleContainer}>
        {threeAccountLevel ? (
          <Text style={styles.informationTitle}>
            Ingresa el número de teléfono registrado:
          </Text>
        ) : (
          <Text style={styles.informationTitle}>
            Registra los siguientes datos del usuario:
          </Text>
        )}
      </View>
      {threeAccountLevel ? (
        <View style={styles.formContainer}>
          <TouchableHighlight
            underlayColor={'#c0c0c0'}
            onPress={() => {
              if (isChecking === false) onOpenKeyboard();
            }}
            style={{
              width: '100%',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <View pointerEvents="none">
              <FinsusInputTextMaterial
                icon={require('assets/icons/oldphone.png')}
                placeholder={'Teléfono celular a diez dígitos'}
                keyboardType={'numeric'}
                maxLength={10}
                editable={false}
                value={form.phone}
                styles={{borderBottomColor:'#0070CD'}}
              />
            </View>
          </TouchableHighlight>
          <View style={styles.buttonContainer}>
            <FinsusButtonSecondary
              text={'Ok'}
              onPress={onNext}
            />
          </View>

        </View>
      ) : (
        <View style={styles.formContainer}>
          <TouchableHighlight
            underlayColor={'#c0c0c0'}
            onPress={() => {
              if (isChecking === false) onOpenKeyboard();
            }}
            style={{
              width: '100%',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <View pointerEvents="none">
              <FinsusInputTextMaterial
                icon={require('assets/icons/oldphone.png')}
                placeholder={'Teléfono celular a diez dígitos'}
                keyboardType={'numeric'}
                maxLength={10}
                editable={false}
                value={form.phone}
                styles={{borderBottomColor: '#0070CD'}}
              />
            </View>
          </TouchableHighlight>
          <FinsusInputTextMaterial
            icon={require('assets/icons/sobre.png')}
            placeholder={'Correo electrónico'}
            keyboardType={'email-address'}
            maxLength={60}
            autoCapitalize={'none'}
            editable={!showKeyboard}
            value={threeAccountLevel === true ? form.emailFake : form.email}
            onChange={value => setValuesForm('email', value)}
            returnKey={'next'}
          />

          <View style={styles.buttonContainer}>
            <FinsusButtonSecondary
              text={'Ok'}
              onPress={onNext}
            />
          </View>
        </View>
      )}
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}
        text={messageError}
      />
      <NumericKeyboardModal
        showKeyboard={showKeyboard}
        onKeyPress={onKeyboardPress}
        onBackPress={onBackspacePress}
        onAccept={onAcceptKeyboard}
        onCancel={onCancelKeyboard}
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
  imagetitle:{
    marginTop:-120,
    marginLeft:'80%'
  },
  informationTitleContainer: {
    
    marginTop: 68,
    marginBottom: 28,
  },
  informationTitle: {
    fontSize: 14,
    paddingLeft:15,
    textAlign: 'left',
    color: 'black',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 6,
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checksContainer: {
    width: '90%',
    marginTop: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default OnboardingCreateUserScreen;
