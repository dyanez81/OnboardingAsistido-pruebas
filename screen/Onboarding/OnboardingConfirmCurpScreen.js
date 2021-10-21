/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, TextInput, StatusBar,Image, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import validator from 'validator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  onboardOpenModal,
  onboardCloseModal,
  onboardingSetUser,
} from 'store/actions';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import FinsusLoading from 'components/ui/modals/FinsusLoading';
import FinsusBaseModal from 'components/base/FinsusBaseModal';
import {CURP_PATTERN} from 'utils/env';
import {
  DARK_GREY_BLUE,
  ROYAL_BLUE,
  SECONDARY_COLOR,
  WHITE_GREY,
} from 'utils/colors';

const OnboardingConfirmCurpScreen = ({navigation}) => {
  const dispatch = useDispatch();

  // Redux state
  const userData = useSelector(state => state.onboarding.userData);
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);

  // Component state
  const [form, setForm] = useState({
    curp: userData.curp,
    phone: userData.phone
  });

  const onContinue = () => {
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardOpenModal(errorForm));
      return;
    }

    dispatch(
      onboardingSetUser({
        curp: form.curp.toUpperCase(),
        phone: form.phone,
      }),
    );
    navigation.navigate('onboardValidCurp');
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!form.curp) {
      isError = true;
      errorForm += ', CURP';
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

    // Validaciones de formato
    if (form.curp.length != 18) {
      isError = true;
      errorForm += '\n- CURP debe tener 18 caracteres.';
    } else if (!validator.matches(form.curp, CURP_PATTERN)) {
      isError = true;
      errorForm += '\n- El formato del CURP no es válido.';
    }

    if (errorForm)
      errorForm =
        'Se encontraron las siguientes inconsistencias:\n' + errorForm;

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
      <Icon
        name="keyboard-arrow-left"
        size={36}
        color={WHITE_GREY}
        style={{position: 'absolute', top: 10, left: 10}}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.viewImage}>
          <Text style={{...styles.paragraph, marginVertical: 65}}>
            {'Por favor,\nconfirma el\nCURP del usuario.'}
          </Text>
        <Image source={require('/assets/icons/home-blue.png')} style={styles.iconimage}></Image>
      </View>
      <TextInput
        value={form.curp}
        placeholder={'CURP'}
        onChangeText={text => setForm({...form, curp: text})}
        placeholderTextColor={'gray'}
        style={styles.input}
        maxLength={18}
        autoCapitalize={'characters'}
      />
      <View style={styles.buttonsContainer}>
        <FinsusButtonSecondary
          text={'OK'}
          color={'#0070CD'}
          textColor={'#fff'}
          textSize={13}
          textAlign={'center'}
          onPress={onContinue}
        />
      </View>
      <FinsusBaseModal
        cancelText={'Ok'}
        customStyle={{container: {backgroundColor: ROYAL_BLUE}}}
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}>
        <View>
          <Text style={styles.modalText}>{messageError}</Text>
        </View>
      </FinsusBaseModal>
      <FinsusLoading
        loading={loading && navigation.isFocused()}
        text={'Validando tu información'}
      />
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
    fontFamily: 'Montserrat-Medium',
    fontSize: 20,
    letterSpacing: 0.15,
    color: 'black',
    textAlign: 'left',
  },
  bold: {
    color: SECONDARY_COLOR,
  },
  iconimage:{
    width:50,
    height:50,
    marginVertical:65,
    marginLeft:'20%'

  },
  viewImage:{
    display: 'flex',
    flexDirection:'row',
    alignContent:'space-between',
    position:'relative'
  },
  input: {
    width: '75%',
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    letterSpacing: 0.27,
    color: 'black',
    textAlign: 'center',
    paddingBottom: 5.5,
    paddingHorizontal: 16,
    paddingTop: 128,
    borderBottomColor: 'black',
    borderBottomWidth: 1.5,
    marginBottom: 30,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalText: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
});

export default OnboardingConfirmCurpScreen;
