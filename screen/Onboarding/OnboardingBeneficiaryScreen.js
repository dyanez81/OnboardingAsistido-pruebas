import React, {useState} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux';
import validator from 'validator';

import {
  onboardBeneficiaryOpenModal,
  onboardBeneficiaryCloseModal,
  onboardSetBeneficiary,
  onboardRegisterBeneficiaries,
} from 'store/actions';
import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import SelfieAvatar from 'components/ui/screens/onboarding/selfie/SelfieAvatar';
import AddBeneficiaryForm from 'components/ui/screens/onboarding/addBeneficiary/AddBeneficiaryForm';
import FinsusBottomButton from 'components/base/FinsusBottomButton';
import FinsusBaseModal from 'components/base/FinsusBaseModal';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';

const OnboardingBeneficiaryScreen = ({navigation}) => {
  // Parameteres
  const completeFile = navigation.getParam('completeFile', false);

  //Redux state
  const userPhone = useSelector(state => state.onboarding.userData.phone);
  const hasError = useSelector(state => state.onboarding.benefetics.hasError);
  const messageError = useSelector(state => state.onboarding.benefetics.error);
  const loading = useSelector(state => state.onboarding.loading);
  const imgSelfie = useSelector(
    state => state.onboarding.ineSelfieData.items[0].data,
  );
  const items = useSelector(state => state.onboarding.benefetics.items);
  const dispatch = useDispatch();

  //Component state
  const [showInfo, setShowInfo] = useState(false);
  const [beneficiaryArray, setBeneficiaryArray] = useState(items);

  function updateBeneficiary(
    index,
    newValue,
    isPctje = false,
    endedEdit = true,
  ) {
    const beneficiaryArrayClone = [...beneficiaryArray];
    beneficiaryArrayClone[index] = newValue;

    if (isPctje && endedEdit)
      calculatePercentages(beneficiaryArrayClone, index);

    setBeneficiaryArray(beneficiaryArrayClone);
  }

  function calculatePercentages(bArray, index = -1) {
    // Se obtiene el nuevo porcentaje
    const percentageItems = 100 / bArray.length;
    let newPercentage = 0;
    // Se actualiza el porcentaje
    for (var i = 0; i < bArray.length; i++) {
      if (i === 0) newPercentage = Math.ceil(percentageItems);
      else newPercentage = Math.floor(percentageItems);

      // Se actualiza el state
      bArray[i].percentage = newPercentage.toString();
      bArray[i].manual = false; //En esta pantalla no usar modo manual
    }
  }

  const onNextScreen = () => {
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardBeneficiaryOpenModal(errorForm));
      return;
    }

    dispatch(onboardSetBeneficiary(beneficiaryArray));
    // Si viene de completar expediente regresar
    if (!completeFile)
      dispatch(onboardRegisterBeneficiaries(userPhone, beneficiaryArray));
    else navigation.goBack();
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    for (var i = 0; i < beneficiaryArray.length; i++) {
      let isErrorItem = false;
      let errorItem = '';

      if (!beneficiaryArray[i].name) {
        isErrorItem = true;
        errorItem += ', Nombre';
      }
      if (!beneficiaryArray[i].birthdate) {
        isErrorItem = true;
        errorItem += ', Fecha de nacimiento';
      }
      if (!beneficiaryArray[i].address) {
        isErrorItem = true;
        errorItem += ', Dirección';
      }
      if (!beneficiaryArray[i].phone) {
        isErrorItem = true;
        errorItem += ', Teléfono';
      }
      if (!beneficiaryArray[i].percentage) {
        isErrorItem = true;
        errorItem += ', Porcentaje';
      }

      // Verificar si hay algún error de un beneficiario
      if (isErrorItem) {
        isError = true;
        errorForm += `\nBeneficiario ${i + 1}: ${errorItem.substring(2)}.`;
      }
    }

    if (isError && errorForm.length > 0) {
      errorForm = 'Los siguientes campos son obligatorios:\n' + errorForm;

      return {
        isError,
        errorForm,
      };
    }

    // Otras validaciones
    let pctjeTotal = 0;
    for (var i = 0; i < beneficiaryArray.length; i++) {
      let errorItem = '';
      pctjeTotal += parseInt(beneficiaryArray[i].percentage);
      if (!validator.isNumeric(beneficiaryArray[i].phone, {no_symbols: true})) {
        isError = true;
        errorItem += '; Teléfono solo debe incluir números';
      }
      if (beneficiaryArray[i].phone.length !== 10) {
        isError = true;
        errorItem += '; Teléfono debe contener 10 caracteres';
      }
      if (
        !validator.isNumeric(beneficiaryArray[i].percentage, {no_symbols: true})
      ) {
        isError = true;
        errorItem += '; Porcentaje solo debe incluir números';
      } else if (
        parseInt(beneficiaryArray[i].percentage) < 0 ||
        parseInt(beneficiaryArray[i].percentage) > 100
      ) {
        isError = true;
        errorItem += '; Porcentaje debe estar entre 0 y 100';
      }
      if (isError) errorForm += `\n${i + 1}: ${errorItem.substring(2)}.\n`;
    }

    if (pctjeTotal !== 100) {
      isError = true;
      errorForm +=
        '\n\n- La suma del porcentaje de los beneficiarios debe ser 100%.';
    }

    return {
      isError,
      errorForm,
    };
  };

  /**
   * @author Juan de Dios
   * @description agrega un nuevo formulario a la vista
   */
  const addNewBenefetic = () => {
    const cloneArray = [
      {
        ...beneficiaryArray[0],
        percentage: '50',
      },
      {
        name: '',
        birthdate: null,
        address: '',
        phone: '',
        percentage: '50',
        manual: false,
      },
    ];
    setBeneficiaryArray(cloneArray);

    navigation.push('onboardingAddBeneficiary', {
      onBackRefresh: updateBeneficiary,
      beneficiaryList: cloneArray,
      completeFile,
    });
  };

  const onCloseModal = () => {
    dispatch(onboardBeneficiaryCloseModal());
  };

  return (
    <OnboardingLevelOne
      isBackPress
      onBackPress={() => navigation.goBack()}
      loading={loading && navigation.isFocused()}
      titleBox={
        <SelfieAvatar
          image={
            imgSelfie
              ? {uri: `data:image/jpg;base64,${imgSelfie}`}
              : require('assets/images/user-logo.png')
          }
        />
      }
      navigation={navigation}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {'Por favor registra de 1 a 3 \nbeneficiarios.'}
        </Text>
        <TouchableHighlight
          onPress={() => setShowInfo(true)}
          style={styles.iconInfo}
          underlayColor={'transparent'}>
          <Image source={require('assets/icons/informacion.png')} />
        </TouchableHighlight>
      </View>
      <ScrollView style={styles.formsContainer}>
        <View style={styles.container}>
          {beneficiaryArray.map((beneficiary, key) => (
            <AddBeneficiaryForm
              key={key}
              index={key}
              form={beneficiary}
              onUpdate={updateBeneficiary}
            />
          ))}
          <View style={styles.floatButtonContainer}>
            <View style={styles.floatButton}>
              <Icon
                name="add"
                size={56}
                color="white"
                onPress={addNewBenefetic}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <FinsusBottomButton onPress={onNextScreen} />
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}
        text={messageError}
      />
      <FinsusBaseModal done={() => setShowInfo(false)} visible={showInfo}>
        <View>
          <Text style={styles.infoModalTitle}>
            Los beneficiarios asignados recibirán una parte o el total de los
            fondos de la cuenta tras el fallecimiento del titular de la misma.
          </Text>
          <Text style={styles.infoModalTitle}>
            Asigna un porcentaje de participación a uno, dos o tres
            beneficiarios.
          </Text>
        </View>
      </FinsusBaseModal>
    </OnboardingLevelOne>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    textAlign: 'center',
    color: 'rgb(172, 177, 192)',
    marginTop: 8,
    marginBottom: 42,
  },
  floatButtonContainer: {
    marginVertical: 16,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  floatButton: {
    width: 56,
    height: 56,
    borderRadius: 56,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#3495ce',
  },
  formsContainer: {
    width: '100%',
    flex: 1,
  },
  iconInfo: {
    position: 'absolute',
    bottom: 25,
    right: 50,
  },
  infoModalTitle: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
});

export default OnboardingBeneficiaryScreen;
