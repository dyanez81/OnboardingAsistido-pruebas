/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Text, View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import getRealm from 'repository/offline/realm';
import {RepositoryFactory} from 'repository/RepositoryFactory';
import {
  onboardCloseModal,
  onboardOpenModal,
  onboardSaveAddressProof,
} from 'store/actions';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusBottomButton from 'components/base/FinsusBottomButton';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import {DARK_GREY_BLUE, ROYAL_BLUE} from 'utils/colors';

const OnboardingCheckNewAddressScreen = ({navigation}) => {
  // Constants
  const dispatch = useDispatch();

  // Redux state
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  const addressData = useSelector(state => state.onboarding.address2Data);
  const prevAddData = useSelector(state => state.onboarding.addressData);
  const rfcData = useSelector(state => state.onboarding.rfcData);
  const items = useSelector(state => state.onboarding.videoData.items);
  const userAuth = useSelector(state => state.auth.usuario);
  const phoneOB = useSelector(state => state.onboarding.userData.phone);

  const getfullAddress = () => {
    return `Calle ${addressData.street} núm. ${
      addressData.externalNumber
    } int. ${addressData.internalNumber}, ${addressData.suburb},\n${
      addressData.municipality
    }, ${addressData.federalEntity}, ${addressData.country},\n${
      addressData.cp
    }`;
  };

  const editAddress = () => {
    navigation.push('onboardingConfirmAddress', {fromCheckAddress2: true});
  };

  const onNextScreen = () => {
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardOpenModal(errorForm));
      return;
    }

    //TODO: Test Scoring
    // scoreData();

    dispatch(
      onboardSaveAddressProof({
        phone: phoneOB ?? userAuth.phone,
        rfc: items[1].data,
        address: addressData,
        image64: items[0].data,
        verifierCode: rfcData.verifierCodeRfc,
      }),
    );
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!addressData.street || !addressData.externalNumber) {
      isError = true;
      errorForm += ', Dirección';
    }
    if (!items[0].data) {
      isError = true;
      errorForm += ', Comprobante de domicilio';
    }
    if (!items[1].data) {
      isError = true;
      errorForm += ', RFC con homoclave';
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

  /**
   * javascript comment
   * @Desc: Calificar información capturada VS OCR y/o RENAPO
   */
  const scoreData = async () => {
    const realm = await getRealm();
    const ScoreRepo = RepositoryFactory.getRealm('scoring', realm);
    const fAddRfc = rfcData.fullAddress;

    const oRfc = ScoreRepo.getOne({type: 'rfcval'});
    const oAddOCR = ScoreRepo.getOne({type: 'odomicile'});
    const oAddPrev = ScoreRepo.getOne({type: 'pdomicile'});
    const oAddMod = ScoreRepo.getOne({type: 'mdomicile'});

    const scrRFC = rfcData.valid === true ? 100 : 0;
    if (oRfc) ScoreRepo.update(oRfc, {type: 'rfcval', score: scrRFC});
    else ScoreRepo.create({type: 'rfcval', score: scrRFC});

    if (addressData.ocr === true) {
      if (oAddOCR) ScoreRepo.update(oAddOCR, {type: 'odomicile', score: 100});
      else ScoreRepo.create({type: 'odomicile', score: 100});
      // OCR vs Previous
      let scrPrev = 0;
      scrPrev += getScore(prevAddData.country, rfcData.country);
      scrPrev += getScore(prevAddData.federalEntity, rfcData.entity);
      scrPrev += getScore(prevAddData.municipality, rfcData.municipality);
      scrPrev += getIScore(fAddRfc, prevAddData.suburb);
      scrPrev += getIScore(fAddRfc, prevAddData.cp);
      scrPrev += getIScore(fAddRfc, prevAddData.street);
      scrPrev += getIScore(fAddRfc, prevAddData.externalNumber);
      scrPrev /= 7;

      if (oAddPrev)
        ScoreRepo.update(oAddPrev, {type: 'pdomicile', score: scrPrev});
      else ScoreRepo.create({type: 'pdomicile', score: scrPrev});
      // OCS vs Customer Modif
      let scrMod = 0;
      scrMod += getScore(addressData.country, rfcData.country);
      scrMod += getScore(addressData.federalEntity, rfcData.entity);
      scrMod += getScore(addressData.municipality, rfcData.municipality);
      scrMod += getIScore(fAddRfc, addressData.suburb);
      scrMod += getIScore(fAddRfc, addressData.cp);
      scrMod += getIScore(fAddRfc, addressData.street);
      scrMod += getIScore(fAddRfc, addressData.externalNumber);
      scrMod /= 7;

      if (oAddMod)
        ScoreRepo.update(oAddMod, {type: 'mdomicile', score: scrMod});
      else ScoreRepo.create({type: 'mdomicile', score: scrMod});
    } else {
      // Si no se obtuvo datos por OCR todas las comparaciones dan 0
      if (oAddOCR) ScoreRepo.update(oAddOCR, {type: 'odomicile', score: 0});
      else ScoreRepo.create({type: 'odomicile', score: 0});

      // OCR vs Previous
      if (oAddPrev) ScoreRepo.update(oAddPrev, {type: 'pdomicile', score: 0});
      else ScoreRepo.create({type: 'pdomicile', score: 0});

      // OCR vs Customer Modif
      if (oAddMod) ScoreRepo.update(oAddMod, {type: 'mdomicile', score: 0});
      else ScoreRepo.create({type: 'mdomicile', score: 0});
    }

    // TODO: Se guarda la calificación. Falta ponderación y envío N2 (¿dónde?)
    // Comprobante 30% | OCR vs Domicilio N1 30% | RFC Válido 10% | OCR vs Captura 30%
  };

  /**
   * javascript comment
   * @Desc: Compara dos cadenas caracter por caracter y devuelve el número de diferencias.
   */
  const getScore = (ori, mod) => {
    if (!ori || !mod) return 0;
    let count = 0;

    if (ori.length >= mod.length) {
      // El texto original es más grande
      count += ori.length - mod.length;
      for (let i = 0; i < mod.length; i++) {
        if (mod.charAt(i).toUpperCase() !== ori.charAt(i).toUpperCase())
          count++;
      }
    } else {
      // El texto modificado es más grande
      count += mod.length - ori.length;
      for (let j = 0; j < ori.length; j++) {
        if (ori.charAt(i).toUpperCase() !== mod.charAt(i).toUpperCase())
          count++;
      }
    }

    // Porcentaje
    if (count === 0) return 100;
    else if (count <= MAX_MISTAKES_50PC) return 50;
    else return 0;
  };

  /**
   * javascript comment
   * @Desc: Verifica si una cadena incluye otra
   */
  const getIScore = (fullString, searchString) => {
    if (!fullString || !searchString) return 0;

    return fullString.toUpperCase().includes(searchString.toUpperCase())
      ? 100
      : 0;
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
        <Text style={{...styles.dataText, textAlign: 'center'}}>
          {'Por favor\nconfirma tu dirección:'}
        </Text>
        <Text style={styles.dataText}>
          {getfullAddress()}
          {'   '}
          <Icon
            name={'edit'}
            size={18}
            color={ROYAL_BLUE}
            onPress={editAddress}
          />
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <FinsusBottomButton text={'Ok'} onPress={onNextScreen} />
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
  dataLabel: {
    color: '#ACB1C0',
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  dataText: {
    color: '#ACB1C0',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    letterSpacing: 0.26,
    lineHeight: 20,
    width: '70%',
    alignSelf: 'center',
    marginVertical: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: DARK_GREY_BLUE,
  },
});

export default OnboardingCheckNewAddressScreen;
