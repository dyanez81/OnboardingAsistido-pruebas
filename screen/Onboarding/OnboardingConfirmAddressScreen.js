import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import validator from 'validator';
import getRealm from 'repository/offline/realm';
import {RepositoryFactory} from 'repository/RepositoryFactory';
import {
  onboardAddressOpenModal,
  onboardAddressCloseModal,
  onboardSetAddressData,
  onboardRegisterAddress,
  onboardSetAddress2Data,
  onboardStartLoading,
  onboardEndLoading,
} from 'store/actions';
import Icon from 'react-native-vector-icons/MaterialIcons';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import SelfieAvatar from 'components/ui/screens/onboarding/selfie/SelfieAvatar';
import FinsusInputTextMaterial from 'components/base/FinsusInputTextMaterial';
import FinsusBottomButton from 'components/base/FinsusBottomButton';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import FinsusProgressBar from 'components/base/FinsusProgressBar';
import FinsusDropdownMaterial from 'components/base/FinsusDropdownMaterial';
import {WHITE_GREY} from 'utils/colors';
import {MAX_MISTAKES_50PC} from 'utils/env';
import {isNullorNA} from 'utils/methods';
import {processGoogleAddress} from 'utils/mapsUtils';

const OnboardRepository = RepositoryFactory.get('onboard');
const GeocodeRepo = RepositoryFactory.get('geocode');
const OnboardingConfirmAddressScreen = ({navigation}) => {
  const fromCheck = navigation.getParam('fromCheckAddress', false);
  const fromCheckTwo = navigation.getParam('fromCheckAddress2', false);

  //Redux state
  const hasError = useSelector(state => state.onboarding.addressData.hasError);
  const messageError = useSelector(state => state.onboarding.addressData.error);
  const loading = useSelector(state => state.onboarding.loading);
  const imgSelfie = useSelector(
    state => state.onboarding.ineSelfieData.items[0].data,
  );
  const firstName = useSelector(state => state.onboarding.userData.name);
  const reduxUser = useSelector(state => state.onboarding.userData);
  const reduxAddress = useSelector(state => state.onboarding.addressData);
  const ineRedux = useSelector(state => state.onboarding.ineData);
  const curpRedux = useSelector(state => state.onboarding.curpData);
  const rfcRedux = useSelector(state => state.onboarding.rfcData);
  const addressTwo = useSelector(state => state.onboarding.address2Data);
  const dispatch = useDispatch();

  // Component state
  const [addressData, setAddressData] = useState(
    fromCheckTwo ? addressTwo : reduxAddress,
  );
  const [inputs] = useState({});
  const [percent, setPercent] = useState(0);
  const [suburbs, setSuburbs] = useState([]);

  useEffect(() => setPercent(getPercentage()), [addressData]);

  /**
   * @author Juan de Dios
   * @description navega hacia la otra vista
   */
  const onNextScreen = () => {
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardAddressOpenModal(errorForm));
      return;
    }

    if (!fromCheckTwo) {
      saveScore();
    } else {
      dispatch(onboardSetAddress2Data(addressData));
      navigation.goBack();
    }
  };

  const setForm = (id, value) => {
    setAddressData({
      ...addressData,
      [id]: value,
    });
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!addressData.cp) {
      isError = true;
      errorForm += ', Código Postal';
    }
    if (!addressData.country) {
      isError = true;
      errorForm += ', País';
    }
    if (!addressData.federalEntity) {
      isError = true;
      errorForm += ', Entidad Federativa';
    }
    if (!addressData.city) {
      isError = true;
      errorForm += ', Ciudad';
    }
    if (!addressData.municipality) {
      isError = true;
      errorForm += ', Delegación o municipio';
    }
    if (!addressData.suburb) {
      isError = true;
      errorForm += ', Colonia';
    }
    if (!addressData.street) {
      isError = true;
      errorForm += ', Calle';
    }
    if (!addressData.externalNumber) {
      isError = true;
      errorForm += ', Número exterior';
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

    if (
      !validator.isNumeric(addressData.cp, {
        no_symbols: true,
      })
    ) {
      isError = true;
      errorForm += '\n- Código Postal solo debe incluir números';
    }
    if (addressData.cp.length !== 5) {
      isError = true;
      errorForm += '\n- Código Postal debe tener 5 caracteres';
    }

    if (errorForm)
      errorForm =
        'Se encontraron las siguientes inconsistencias:\n' + errorForm;

    return {
      isError,
      errorForm,
    };
  };

  /**
   * javascript comment
   * @Desc: Calificar información capturada VS OCR y/o RENAPO
   */
  const saveScore = useCallback(async () => {
    const fAddress = ineRedux.fullAddress;
    dispatch(onboardStartLoading());

    try {
      // Address
      const scrCountry = getScore(ineRedux.country, addressData.country);
      const scrState = getScore(
        ineRedux.federalEntity,
        addressData.federalEntity,
      );
      const scrMunicipal = getScore(ineRedux.city, addressData.municipality);
      const scrSuburb = getIScore(fAddress, addressData.suburb);
      const scrCp = getIScore(fAddress, addressData.cp);
      const scrStreet = getIScore(fAddress, addressData.street);
      const scrNumber = getIScore(fAddress, addressData.externalNumber);

      // CURP & RENAPO
      const scrCurp = getScore(ineRedux.curp, reduxUser.curp);
      const scrRenapo = isNullorNA(curpRedux.verifierCodeCurp) ? 0 : 100;

      // INE vs Captura
      const scrNameI = getScore(ineRedux.name, reduxUser.name);
      const scrPaternI = getScore(ineRedux.paternal, reduxUser.paternal);
      const scrMaternI = getScore(ineRedux.maternal, reduxUser.maternal);
      const scrBdateI = getScore(ineRedux.birthdate, reduxUser.birthdate);
      const scrGenderI = getScore(ineRedux.gender, reduxUser.gender);

      // CURP vs Captura
      const scrNameC = getScore(curpRedux.name, reduxUser.name);
      const scrPaternC = getScore(curpRedux.paternal, reduxUser.paternal);
      const scrMaternC = getScore(curpRedux.maternal, reduxUser.maternal);
      const scrBdateC = getScore(curpRedux.birthdate, reduxUser.birthdate);
      // const scrBEntityC = getScore(
      //   curpRedux.birthEntity,
      //   reduxUser.birthEntity,
      // );
      const scrGenderC = getScore(curpRedux.gender, reduxUser.gender);

      // INE vs CURP
      const scrNameIC = getScore(ineRedux.name, curpRedux.name);
      const scrPaternIC = getScore(ineRedux.paternal, curpRedux.paternal);
      const scrMaternIC = getScore(ineRedux.maternal, curpRedux.maternal);
      const scrBdateIC = getScore(ineRedux.birthdate, curpRedux.birthdate);
      const scrGenderIC = getScore(ineRedux.gender, curpRedux.gender);

      // Calculo de Score total
      let total = 0;
      total += (scrCurp * 5) / 100; //CURP 5%
      total += 17 + 19; //PLANTILLA INE OCR 17% | MatchFace 19%
      total += 5; //INE Existe y vigente 5%
      total += (scrRenapo * 17) / 100; //CURP RENAPO 17%
      total += (((8 + 1) / 7) * 2) / 100; //OCR Domicilio 2%

      if (scrRenapo === 100) {
        const _C = (scrNameC + scrPaternC + scrMaternC + scrBdateC) / 4;
        const _IC = (scrNameIC + scrPaternIC + scrMaternIC + scrBdateIC) / 4;

        const scoreNamesC = (_C * 18) / 100; //Nombres Renapo vs Captura 18%
        const scoreNamesIC = (_IC * 17) / 100; //Nombres Renapo vs OCR 17%
        total += scoreNamesC + scoreNamesIC;
      } else {
        const namesI = (scrNameI + scrPaternI + scrMaternI + scrBdateI) / 4;
        total += (namesI * 35) / 100; // Modificado vs OCR 35%
      }

      const totalScore = Math.trunc(total);

      //#region Guardar Storage
      const realm = await getRealm();
      const ScoreRepo = RepositoryFactory.getRealm('scoring', realm);
      const oTotalScr = ScoreRepo.getOne({
        type: 'total',
      });
      const nTotalScr = {
        type: 'total',
        score: totalScore,
      };

      if (oTotalScr) ScoreRepo.update(oTotalScr, nTotalScr);
      else ScoreRepo.create(nTotalScr);
      //#endregion /Guardar Storage

      const {data} = await OnboardRepository.GetScoring({
        phone: reduxUser.phone,
      });

      if (data.statusCode !== '000') {
        dispatch(
          onboardAddressOpenModal(
            `No se pudo obtener calificación previa:\n${data.messageCode}`,
          ),
        );
        return;
      }

      const rScore = {
        id: data.preScore.id,
        phone: reduxUser.phone,
        name:
          scrRenapo == 100
            ? getScoreColor((scrNameC + scrNameIC) / 2)
            : getScoreColor(scrNameI),
        paternal:
          scrRenapo == 100
            ? getScoreColor((scrPaternC + scrPaternIC) / 2)
            : getScoreColor(scrPaternI),
        maternal:
          scrRenapo == 100
            ? getScoreColor((scrMaternC + scrMaternIC) / 2)
            : getScoreColor(scrMaternI),
        curp: getScoreColor(scrCurp),
        birthdate:
          scrRenapo == 100
            ? getScoreColor((scrBdateC + scrBdateIC) / 2)
            : getScoreColor(scrBdateI),
        birthEntity: 'amarillo',
        gender:
          scrRenapo == 100
            ? getScoreColor((scrGenderC + scrGenderIC) / 2)
            : getScoreColor(scrGenderI),
        street: getScoreColor(scrStreet),
        externalNumber: getScoreColor(scrNumber),
        cp: getScoreColor(scrCp),
        colony: getScoreColor(scrSuburb),
        municipality: getScoreColor(scrMunicipal),
        entity: getScoreColor(scrState),
        country: getScoreColor(scrCountry),
        imageIdFront: 'verde',
        imageIdBack: 'verde',
        imageSelfie: 'verde',
        rfc: 'verde',
        video: 'verde',
        file_upload_domicile_comprobant: 'verde',
        total_score_preview: totalScore,
      };

      const {data: scoreResult} = await OnboardRepository.UpdateScoring(rScore);

      if (scoreResult.statusCode == '000') {
        dispatch(onboardEndLoading());

        dispatch(onboardSetAddressData(addressData));

        // Registrar dirección
        dispatch(
          onboardRegisterAddress(
            reduxUser,
            addressData,
            curpRedux,
            rfcRedux,
            fromCheck,
          ),
        );
      } else {
        dispatch(
          onboardAddressOpenModal(
            `No se pudo guardar el Score:\n${scoreResult.messageCode}`,
          ),
        );
        console.log('\nELSE SCORE:: ', scoreResult);
      }
    } catch (err) {
      dispatch(
        onboardAddressOpenModal(
          'No se pudo validar la información. Intenta de nuevo.',
        ),
      );
      console.log('\nCATCH SAVE SCORE:: ', err);
    }
  });

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
        if (ori.charAt(j).toUpperCase() !== mod.charAt(j).toUpperCase())
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

  /**
   * @Desc: Devuelve un color dependiendo del Score
   */
  const getScoreColor = score => {
    if (score >= 90) return 'verde';
    else if (score >= 50) return 'amarillo';
    else return 'rojo';
  };

  const getName = firstName => {
    const name = firstName.trim().split(' ')[0];

    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const getPercentage = () => {
    let nn = 0;
    if (addressData.cp) ++nn;
    if (addressData.country) ++nn;
    if (addressData.federalEntity) ++nn;
    if (addressData.city) ++nn;
    if (addressData.municipality) ++nn;
    if (addressData.suburb) ++nn;
    if (addressData.street) ++nn;
    if (addressData.externalNumber) ++nn;

    return 50 + (nn * 50) / 8;
  };

  /**
   * @Desc: Valida los campos necesarios para la búsqueda
   * @date 2021-05-06 17:37:25
   */
  const validateSearch = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!addressData.cp) {
      isError = true;
      errorForm += ', Código Postal';
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

    if (
      !validator.isNumeric(addressData.cp, {
        no_symbols: true,
      })
    ) {
      isError = true;
      errorForm += '\n- Código Postal solo debe incluir números';
    }
    if (addressData.cp.length !== 5) {
      isError = true;
      errorForm += '\n- Código Postal debe tener 5 caracteres';
    }

    if (errorForm)
      errorForm =
        'Se encontraron las siguientes inconsistencias:\n' + errorForm;

    return {
      isError,
      errorForm,
    };
  };

  /**
   * @Desc: Buscar dirección por CP
   * @date 2021-05-06 17:21:35
   */
  const searchByCP = useCallback(
    async manualSearch => {
      const {isError, errorForm} = validateSearch();

      if (isError) {
        if (manualSearch) dispatch(onboardAddressOpenModal(errorForm));
        return;
      }

      dispatch(onboardStartLoading());

      try {
        const {data: geodata} = await GeocodeRepo.getAddressByCP({
          cp: addressData.cp,
        });

        if (geodata.status === 'OK') {
          const _address = processGoogleAddress(geodata);

          const _multiple =
            _address.neighborhoods && _address.neighborhoods.length > 0;

          let _suburbs = [];
          if (_multiple == true) {
            _suburbs = _address.neighborhoods
              .map(item => {
                return {
                  label: item,
                  value: item,
                };
              })
              .sort((a, b) => (a.label > b.label ? 1 : -1));
          }

          setAddressData({
            ...addressData,
            country: _address.country,
            federalEntity: _address.federalEntity,
            city: _address.city,
            municipality: _address.municipality,
            suburb: _multiple ? '' : _address.suburb,
            street: _address.street,
            externalNumber: _address.externalNumber,
          });

          setSuburbs(_suburbs);

          dispatch(onboardEndLoading());
        } else if (geodata.status !== 'ZERO_RESULTS') {
          dispatch(
            onboardAddressOpenModal(geodata.error_message ?? geodata.status),
          );
        }
      } catch (err) {
        dispatch(
          onboardAddressOpenModal(
            `No se encontró información de ese CP:\n${err.toString()}`,
          ),
        );
      }
    },
    [addressData.cp],
  );

  const searchByGPS = useCallback(async () => {
    setAddressData({...addressData, suburb: ''});
    setSuburbs([]);
    dispatch(onboardStartLoading());

    try {
      const {data: geodata} = await GeocodeRepo.getAddressByGPS({
        latitude: reduxAddress.latitude,
        longitude: reduxAddress.longitude,
      });

      if (geodata.status === 'OK') {
        const _address = processGoogleAddress(geodata);

        const _multiple =
          _address.neighborhoods && _address.neighborhoods.length > 0;

        if (_multiple == true) {
          const _suburbs = _address.neighborhoods
            .map(item => {
              return {
                label: item,
                value: item,
              };
            })
            .sort((a, b) => (a.label > b.label ? 1 : -1));

          setSuburbs(_suburbs);
        }

        setAddressData({
          ...addressData,
          cp: _address.cp,
          country: _address.country,
          federalEntity: _address.federalEntity,
          city: _address.city,
          municipality: _address.municipality,
          ...(_multiple == false && {suburb: _address.suburb}),
          street: _address.street,
          externalNumber: _address.externalNumber,
        });

        dispatch(onboardEndLoading());
      } else if (geodata.status !== 'ZERO_RESULTS') {
        dispatch(
          onboardAddressOpenModal(geodata.error_message ?? geodata.status),
        );
      }
    } catch (err) {
      dispatch(
        onboardAddressOpenModal(
          `No se encontró información de ese CP:\n${err.toString()}`,
        ),
      );
    }
  }, []);

  const onCloseModal = () => {
    dispatch(onboardAddressCloseModal());
  };

  return (
    <OnboardingLevelOne
      isBackPress
      onBackPress={() => navigation.goBack()}
      loading={loading && navigation.isFocused()}
      titleBox={
        !fromCheckTwo ? (
          <SelfieAvatar
            image={
              imgSelfie
                ? {
                    uri: `data:image/jpg;base64,${imgSelfie}`,
                  }
                : require('assets/images/user-logo.png')
            }
            title={firstName ? getName(firstName) + ', ' : ''}
            subtitle={'Verifica y completa tu dirección.'}
          />
        ) : null
      }
      noHeader={fromCheckTwo}
      navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.cpContainer}>
          <TextInput
            value={addressData.cp}
            placeholder={'Código Postal'}
            onChangeText={text => setForm('cp', text)}
            placeholderTextColor={'gray'}
            style={styles.cp}
            keyboardType={'numeric'}
            maxLength={5}
            contextMenuHidden={true}
            returnKey={'next'}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              inputs['country'].focus();
              searchByCP(false);
            }}
          />
          <Icon
            name="search"
            size={28}
            style={styles.cpIcon}
            color={'white'}
            onPress={() => searchByCP(true)}
          />
        </View>
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'País'}
          placeholderTextColor={'gray'}
          value={addressData.country}
          onChange={text => setForm('country', text)}
          returnKey={'next'}
          blurOnSubmit={false}
          getRef={input => (inputs['country'] = input.current)}
          onSubmitEditing={() => inputs['state'].focus()}
        />
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'Entidad Federativa'}
          placeholderTextColor={'gray'}
          value={addressData.federalEntity}
          onChange={text => setForm('federalEntity', text)}
          returnKey={'next'}
          blurOnSubmit={false}
          getRef={input => (inputs['state'] = input.current)}
          onSubmitEditing={() => inputs['city'].focus()}
        />
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'Ciudad'}
          placeholderTextColor={'gray'}
          value={addressData.city}
          onChange={text => setForm('city', text)}
          returnKey={'next'}
          blurOnSubmit={false}
          getRef={input => (inputs['city'] = input.current)}
          onSubmitEditing={() => inputs['town'].focus()}
        />
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'Alcaldía o municipio'}
          placeholderTextColor={'gray'}
          value={addressData.municipality}
          onChange={text => setForm('municipality', text)}
          returnKey={'next'}
          blurOnSubmit={false}
          getRef={input => (inputs['town'] = input.current)}
        />
        {suburbs.length > 0 && (
          <FinsusDropdownMaterial
            items={suburbs}
            placeholder={'Colonia'}
            onChange={item => setForm('suburb', item.value)}
          />
        )}
        {suburbs.length == 0 && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Colonia'}
            placeholderTextColor={'gray'}
            value={addressData.suburb}
            onChange={text => setForm('suburb', text)}
          />
        )}
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'Calle'}
          placeholderTextColor={'gray'}
          value={addressData.street}
          onChange={text => setForm('street', text)}
          returnKey={'next'}
          blurOnSubmit={false}
          getRef={input => (inputs['street'] = input.current)}
          onSubmitEditing={() => inputs['number'].focus()}
        />
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'Número exterior'}
          placeholderTextColor={'gray'}
          value={addressData.externalNumber}
          onChange={text => setForm('externalNumber', text)}
          returnKey={'next'}
          blurOnSubmit={false}
          getRef={input => (inputs['number'] = input.current)}
          onSubmitEditing={() => inputs['intnumber'].focus()}
        />
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'Número interior'}
          placeholderTextColor={'gray'}
          value={addressData.internalNumber}
          onChange={text => setForm('internalNumber', text)}
          getRef={input => (inputs['intnumber'] = input.current)}
        />
        <FinsusProgressBar
          progressPercent={percent}
          customStyle={{
            paddingTop: 25,
            paddingLeft: 45,
            width: '90%',
          }}
        />
        <View style={styles.progressLabels}>
          <Text style={styles.progressText}>Datos personales</Text>
          <Text style={styles.progressText}>Dirección</Text>
        </View>
      </View>
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 40,
    marginBottom: 20,
  },
  progressText: {
    flex: 1,
    fontFamily: 'Montserrat-Light',
    fontSize: 11,
    color: WHITE_GREY,
    textAlign: 'center',
  },
  cpContainer: {
    flex: 1,
    paddingHorizontal: '11%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cp: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: 'rgb(172, 177, 192)',
    paddingBottom: 8,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  cpIcon: {
    marginLeft: 16,
  },
});

export default OnboardingConfirmAddressScreen;
