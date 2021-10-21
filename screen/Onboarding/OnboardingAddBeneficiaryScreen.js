/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Text, View, ScrollView, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import validator from 'validator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  onboardBeneficiaryOpenModal,
  onboardBeneficiaryCloseModal,
  onboardSetBeneficiary,
  onboardRegisterBeneficiaries,
} from 'store/actions';
import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import AddBeneficiaryForm from 'components/ui/screens/onboarding/addBeneficiary/AddBeneficiaryForm';
import FinsusBottomButton from 'components/base/FinsusBottomButton';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';

const OnboardingAddBeneficiaryScreen = ({navigation}) => {
  // Parameteres
  const completeFile = navigation.getParam('completeFile', false);
  const onBackRefresh = navigation.getParam('onBackRefresh');
  const items = navigation.getParam('beneficiaryList', [
    {
      name: '',
      birthdate: null,
      address: '',
      phone: '',
      percent: '100',
      manual: false,
    },
  ]);

  //Redux state
  const userPhone = useSelector(state => state.onboarding.userData.phone);
  const loading = useSelector(state => state.onboarding.loading);
  const hasError = useSelector(state => state.onboarding.benefetics.hasError);
  const messageError = useSelector(state => state.onboarding.benefetics.error);
  const dispatch = useDispatch();

  //Component state
  const [beneficiaryArray, setBeneficiaryArray] = useState(items);

  const onBackScreen = () => {
    onBackRefresh(0, {
      ...beneficiaryArray[0],
      percentage: '100',
      manual: false,
    });
    navigation.goBack();
  };

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
    else navigation.pop(2);
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
      let isErrorItem = false;
      let errorItem = '';

      pctjeTotal += parseInt(beneficiaryArray[i].percentage);
      if (!validator.isNumeric(beneficiaryArray[i].phone, {no_symbols: true})) {
        isErrorItem = true;
        errorItem += '; Teléfono solo debe incluir números';
      }
      if (beneficiaryArray[i].phone.length !== 10) {
        isErrorItem = true;
        errorItem += '; Teléfono debe contener 10 caracteres';
      }
      if (
        !validator.isNumeric(beneficiaryArray[i].percentage, {no_symbols: true})
      ) {
        isErrorItem = true;
        errorItem += '; Porcentaje solo debe incluir números';
      } else if (
        parseInt(beneficiaryArray[i].percentage) < 0 ||
        parseInt(beneficiaryArray[i].percentage) > 100
      ) {
        isErrorItem = true;
        errorItem += '; Porcentaje debe estar entre 0 y 100';
      }

      // Verificar si hay algún error de un beneficiario
      if (isErrorItem) {
        isError = true;
        errorForm += `\nBeneficiario ${i + 1}: ${errorItem.substring(2)}.\n`;
      }
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

  const onCloseModal = () => {
    dispatch(onboardBeneficiaryCloseModal());
  };

  const [styleButtonOriginal, setStyleButtonOriginal] = useState({
    width: 46,
    height: 46,
    borderRadius: 56,
    display: 'flex',
    alignContent: 'center',
    flexDirection: 'column',
  });

  const [beneficiaryCount, setBeneficiaryCount] = useState(2);
  const [pointerEventsAdd, setPointerEventsAdd] = useState('auto');
  const [pointerEventsRemove, setPointerEventsRemove] = useState('auto');

  const [styleButtonAdd, setStyleButtonAdd] = useState({
    ...styleButtonOriginal,
    backgroundColor: '#3495ce',
  });

  const [styleButtonRemove, setStyleButtonRemove] = useState({
    ...styleButtonOriginal,
    backgroundColor: '#3495ce',
  });

  /**
   * @author Juan de Dios
   * @description agrega un nuevo formulario a la vista
   */
  const addNewBenefetic = () => {
    if (beneficiaryArray.length <= 2) {
      if (beneficiaryArray.length === 2) {
        setPointerEventsAdd('none');
        setStyleButtonAdd({
          ...styleButtonAdd,
          backgroundColor: 'grey',
        });
      }
      setBeneficiaryCount(prevState => beneficiaryArray.length + 1);
      const cloneArray = [
        ...beneficiaryArray,
        {
          name: '',
          birthdate: null,
          address: '',
          phone: '',
          percentage: '0',
          manual: false,
        },
      ];
      calculatePercentages(cloneArray);
      setBeneficiaryArray(cloneArray);

      setPointerEventsRemove('auto');
      setStyleButtonRemove({
        ...styleButtonRemove,
        backgroundColor: '#3495ce',
      });

      return;
    }
  };

  const subtractBenefetic = () => {
    if (beneficiaryArray.length >= 2) {
      if (beneficiaryArray.length === 2) {
        setPointerEventsRemove('none');
        setStyleButtonRemove({
          ...styleButtonRemove,
          backgroundColor: 'grey',
        });
      }
      const beneficiaryArrayClone = [...beneficiaryArray];
      beneficiaryArrayClone.pop();
      calculatePercentages(beneficiaryArrayClone);
      setBeneficiaryArray(beneficiaryArrayClone);
      setBeneficiaryCount(prevState => beneficiaryArray.length - 1);
      setPointerEventsAdd('auto');
      setStyleButtonAdd({
        ...styleButtonAdd,
        backgroundColor: '#3495ce',
      });
      return;
    }
  };

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
    // Si se está manipulando el pctje de un item específico la lógica cambia
    const percentItem =
      index > -1 && bArray[index].percentage
        ? parseInt(bArray[index].percentage)
        : 0;

    let itemsAuto = 0;
    let subtotal = 0; // Sin contar item actual
    let subtotalManual = 0;

    for (var i = 0; i < bArray.length; i++) {
      if (i !== index) {
        if (bArray[i].manual === true)
          subtotalManual += parseInt(bArray[i].percentage);
        else itemsAuto++;

        subtotal += parseInt(bArray[i].percentage);
      }
    }

    // No admite menos de 0
    if (percentItem < 0) {
      bArray[index].percentage = (100 - subtotal).toString();
      return;
    }

    // Revisar si con el porcentaje ingresado puede redistribuir o queda en ceros
    if (index > -1 && percentItem > 100 - subtotalManual) {
      bArray[index].percentage = (100 - subtotal).toString();
      return;
    }

    if (itemsAuto > 0) {
      // Si quedan items auto, dividir el restante entre itemsAuto
      const subtotalAuto = 100 - subtotalManual - percentItem;
      const newPercent = subtotalAuto / itemsAuto;

      let first = true;
      for (var i = 0; i < bArray.length; i++) {
        if (i !== index && bArray[i].manual === false) {
          if (first) {
            bArray[i].percentage = Math.ceil(newPercent).toString();
            first = false;
          } else bArray[i].percentage = Math.floor(newPercent).toString();
        }
      }
    }
  }

  return (
    <OnboardingLevelOne
      isBackPress={beneficiaryCount === 1}
      onBackPress={onBackScreen}
      loading={loading && navigation.isFocused()}
      titleBox={null}
      noHeader={true}
      navigation={navigation}>
      <View style={styles.textContainer}>
        <View>
          <View
            pointerEvents={pointerEventsRemove}
            style={styles.floatButtonContainer}>
            <View style={styleButtonRemove}>
              <Icon
                name="remove"
                size={46}
                color="white"
                onPress={subtractBenefetic}
              />
            </View>
          </View>
        </View>
        <View>
          <Text
            style={{
              ...styles.title,
              color: 'rgb(255,255,255)',
              fontSize: 21,
              marginTop: 28,
            }}>
            {beneficiaryCount}
          </Text>
          <Text style={styles.title}>{'Beneficiarios'}</Text>
        </View>
        <View>
          <View
            pointerEvents={pointerEventsAdd}
            style={styles.floatButtonContainer}>
            <View style={styleButtonAdd}>
              <Icon
                name="add"
                size={46}
                color="white"
                onPress={() => {
                  addNewBenefetic();
                  calculatePercentages(-1);
                }}
              />
            </View>
          </View>
        </View>
      </View>
      <ScrollView style={styles.formsContainer}>
        <View style={styles.container}>
          {beneficiaryArray.map((benefetic, key) => (
            <AddBeneficiaryForm
              key={key}
              index={key}
              form={benefetic}
              onUpdate={updateBeneficiary}
              onUpdatePercentage={calculatePercentages}
            />
          ))}
        </View>
      </ScrollView>
      <FinsusBottomButton onPress={onNextScreen} />
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
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  title: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    textAlign: 'center',
    color: 'rgb(0, 149, 206)',
    marginLeft: 14,
    marginRight: 14,
  },
  floatButtonContainer: {
    marginTop: 16,
    display: 'flex',
    alignContent: 'center',
    width: '100%',
  },
  formsContainer: {
    width: '100%',
    flex: 1,
    marginTop: 20,
    marginBottom: 13 + 26,
  },
});

export default OnboardingAddBeneficiaryScreen;
