/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  onboardCloseModal,
  onboardOpenModal,
  onboardSaveVideo,
} from 'store/actions';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import FinsusDatePicker from 'components/base/FinsusDatePicker';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import {getDate, getDateString} from 'utils/methods';
import {SECONDARY_COLOR} from 'utils/colors';

const OnboardingSecurityCheckScreen = ({navigation}) => {
  // Constants
  const dispatch = useDispatch();

  // Redux state
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  const phoneAuth = useSelector(state => state.auth.usuario.phone);
  const phoneOB = useSelector(state => state.onboarding.userData.phone);
  const video = useSelector(state => state.onboarding.videoData.items[2].data);

  // Component state
  const [showPicker, setShowPicker] = useState(false);
  const [form, setForm] = useState({
    cp: null,
    birthdate: null,
    digits: null,
  });

  const onDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios' ? true : false);
    if (selectedDate) {
      setData('birthdate', getDateString(selectedDate, 'DD/MM/YYYY'));
    }
  };

  const setData = (id, value) => {
    setForm({
      ...form,
      [id]: value,
    });
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!form.cp) {
      isError = true;
      errorForm += ', Código Postal';
    }
    if (!form.birthdate) {
      isError = true;
      errorForm += ', Fecha de nacimiento';
    }
    if (!form.digits) {
      isError = true;
      errorForm += ', Dígitos celular';
    }
    if (!video) {
      isError = true;
      errorForm += ', Vídeo';
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
    // (Opcional)

    return {
      isError,
      errorForm,
    };
  };

  const onNext = () => {
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardOpenModal(errorForm));
      return;
    }

    // Registrar vídeo
    dispatch(
      onboardSaveVideo({
        phone: phoneOB ?? phoneAuth,
        vidAcceptance: video,
      }),
    );
  };

  const onBack = () => {
    navigation.goBack();
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  return (
    <OnboardingLevelOne
      isBackPress
      onBackPress={onBack}
      loading={loading && navigation.isFocused()}
      titleBox={null}
      noHeader={true}
      hideHelp={true}
      navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('assets/images/shieldEmpty.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>
          Para verificar tu cuenta, llena los siguientes datos:
        </Text>
        <View style={styles.row}>
          <Text style={styles.question}>Código postal</Text>
          <TextInput
            maxLength={5}
            keyboardType={'numeric'}
            contextMenuHidden
            value={form.cp}
            onChange={text => setData('cp', text)}
            style={styles.answer}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.question}>Fecha de nacimiento</Text>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => setShowPicker(!showPicker)}
            style={styles.dateContainer}>
            <Text
              style={[
                styles.answer,
                {color: form.birthdate ? '#fff' : 'gray'},
              ]}>
              {form.birthdate ?? 'dd/mm/aaaa'}
            </Text>
          </TouchableHighlight>
        </View>
        {showPicker && (
          <FinsusDatePicker
            value={
              form.birthdate
                ? getDate(
                    `${form.birthdate} 12:00`,
                    'DD/MM/YYYY HH:mm',
                  ).toDate()
                : new Date()
            }
            onDateChange={onDateChange}
            onAccept={() => setShowPicker(false)}
          />
        )}
        <View style={styles.row}>
          <Text style={styles.question}>Últimos dos dígitos de tu celular</Text>
          <TextInput
            maxLength={2}
            keyboardType={'numeric'}
            contextMenuHidden
            value={form.digits}
            onChange={text => setData('digits', text)}
            style={styles.answer}
          />
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonArea}>
          <FinsusButtonSecondary
            text={'Ok'}
            color={'rgba(0,0,0,0.25)'}
            textColor={'#fff'}
            textSize={13}
            textAlign={'center'}
            onPress={onNext}
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
  title: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    letterSpacing: 0.15,
    color: 'rgb(172,177,192)',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 50,
  },
  question: {
    width: '60%',
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
    letterSpacing: 0.15,
    color: 'rgb(172,177,192)',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  answer: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#fff',
    borderColor: SECONDARY_COLOR,
    borderWidth: 1,
    paddingVertical: 5,
  },
  dateContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonArea: {
    flex: 1,
    marginVertical: 25,
    marginHorizontal: 15,
    alignItems: 'center',
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

export default OnboardingSecurityCheckScreen;
