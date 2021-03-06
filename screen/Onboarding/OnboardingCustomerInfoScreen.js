import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import validator from 'validator';
import {RepositoryFactory} from 'repository/RepositoryFactory';
import {
  onboardAddressOpenModal,
  onboardAddressCloseModal,
  onboardingSetUser,
  onboardRegisterAddress,
  onboardStartLoading,
  onboardEndLoading,
  onboardSetRfcData,
} from 'store/actions';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusInputTextMaterial from 'components/base/FinsusInputTextMaterial';
import FinsusTouchableTextMaterial from 'components/base/FinsusTouchableTextMaterial';
import FinsusDatePicker from 'components/base/FinsusDatePicker';
import FinsusBottomButton from 'components/base/FinsusBottomButton';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import FinsusDropdownMaterial from 'components/base/FinsusDropdownMaterial';
import OnboardingOption from 'components/ui/screens/onboarding/OnboardingOption';
import FinsusProgressBar from 'components/base/FinsusProgressBar';
import FinsusHeader from 'components/base/FinsusHeader';
import {getDate, getDateString, isNullorEmpty} from 'utils/methods';
import {
  CURP_PATTERN,
  MX_STP,
  RFC_PATTERN,
  RFC10_PATTERN,
  STATES_MX,
  occupations,
} from 'utils/env';
import {WHITE_GREY} from 'utils/colors';
import {calculateRfc} from 'utils/rfc';

const OnboardRepository = RepositoryFactory.get('onboard');
const OnboardingCustomerInfoScreen = ({navigation}) => {
  const fromCheckAddress = navigation.getParam('fromCheckAddress', false);

  //Redux state
  const hasError = useSelector(state => state.onboarding.addressData.hasError);
  const messageError = useSelector(state => state.onboarding.addressData.error);
  const loading = useSelector(state => state.onboarding.loading);
  const firstName = useSelector(state => state.onboarding.userData.name);
  const reduxUser = useSelector(state => state.onboarding.userData);
  const reduxAddress = useSelector(state => state.onboarding.addressData);
  const curpRedux = useSelector(state => state.onboarding.curpData);
  const rfcRedux = useSelector(state => state.onboarding.rfcData);
  const level = useSelector(state => state.onboarding.userData.level);
  const dispatch = useDispatch();

  // Component state
  const [userData, setUserData] = useState({
    name: curpRedux.name ?? reduxUser.name,
    paternal: curpRedux.paternal ?? reduxUser.paternal,
    maternal: curpRedux.maternal ?? reduxUser.maternal,
    fullName: curpRedux.name
      ? `${curpRedux.name} ${curpRedux.paternal} ${curpRedux.maternal}`
      : `${reduxUser.name} ${reduxUser.paternal} ${reduxUser.maternal}`,
    curp: reduxUser.curp,
    gender: curpRedux.gender ?? reduxUser.gender,
    birthdate: curpRedux.birthdate ?? reduxUser.birthdate,
    nationality: reduxUser.nationality,
    birthCountry: null,
    birthEntity: null,
    occupation: reduxUser.occupation,
    esignature: reduxUser.esignature,
    rfc: reduxUser.rfc,
    manifest: reduxUser.manifest,
  });
  const [showPicker, setShowPicker] = useState(false);
  const [inputs] = useState({});
  const [percent, setPercent] = useState(0);
  const [countries, setCountries] = useState([]);

  // Hooks
  useEffect(() => {
    getCountries();
  }, []);
  useEffect(() => {
    setPercent(getPercentage());
  }, [userData]);

  /**
   * @Desc: Obtiene el cat??logo de pa??ses del Back
   * @date 2021-03-23 16:46:24
   */
  const getCountries = useCallback(async () => {
    dispatch(onboardStartLoading());

    try {
      const {data: dCountry} = await OnboardRepository.GetCountryCatalog();

      if (dCountry.statusCode === '000') {
        const _countries = dCountry.birthCountry
          .map(item => {
            return {
              label: item.country,
              value: item.idbirthcountry.toString(),
            };
          })
          .sort((a, b) => (a.label > b.label ? 1 : -1));
        setCountries(_countries);

        if (_countries.filter(item => item.value == MX_STP).length > 0)
          setForm('birthCountry', MX_STP);

        dispatch(onboardEndLoading());
      } else {
        dispatch(onboardAddressOpenModal(dCountry.messageCode));
      }
    } catch (err) {
      dispatch(
        onboardAddressOpenModal(
          `No se pudo obtener los pa??ses:\n${err.toString()}`,
        ),
      );
    }
  }, []);

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

    if (level == '3') {
      dispatch(
        onboardingSetUser({
          name: userData.name,
          paternal: userData.paternal,
          maternal: userData.maternal,
          fullName: `${userData.name} ${userData.paternal} ${
            userData.maternal
          }`,
          curp: userData.curp.toUpperCase(),
          gender: userData.gender,
          birthdate: userData.birthdate,
          nationality: userData.nationality,
          birthEntity: userData.birthEntity,
          birthCountry: userData.birthCountry,
          occupation: userData.occupation,
          esignature: userData.esignature,
          ...(userData.rfc && {rfc: userData.rfc.toUpperCase()}),
          manifest: userData.manifest,
        }),
      );

      // Actualizar Back si viene de review o Continuar
      if (fromCheckAddress)
        dispatch(
          onboardRegisterAddress(
            userData,
            reduxAddress,
            curpRedux,
            rfcRedux,
            fromCheckAddress,
          ),
        );
      else navigation.navigate('onboardingConfirmAddress');
    } else if (level == '2') {
      validateRfc();
    } else {
      dispatch(
        onboardAddressOpenModal('El nivel seleccionado no es correcto.'),
      );
    }
  };

  const validateRfc = useCallback(async () => {
    dispatch(onboardStartLoading());

    try {
      const {data: rfcData} = await OnboardRepository.RegisterValidateRfc({
        rfc: userData.rfc,
      });

      if (rfcData.statusCode == '000') {
        dispatch(
          onboardSetRfcData({
            typePerson: rfcData.typePerson,
            verifierCodeRfc: rfcData.verifierCodeRfc,
            valid: rfcData.verifierCodeRfc !== 'N/A',
          }),
        );

        dispatch(onboardEndLoading());

        // Guardar en Redux
        dispatch(
          onboardingSetUser({
            name: userData.name,
            paternal: userData.paternal,
            maternal: userData.maternal,
            fullName: `${userData.name} ${userData.paternal} ${
              userData.maternal
            }`,
            curp: userData.curp.toUpperCase(),
            gender: userData.gender,
            birthdate: userData.birthdate,
            nationality: userData.nationality,
            birthEntity: userData.birthEntity,
            birthCountry: userData.birthCountry,
            occupation: userData.occupation,
            esignature: userData.esignature,
            ...(userData.rfc && {rfc: userData.rfc.toUpperCase()}),
            manifest: userData.manifest,
          }),
        );

        // Actualizar Back si viene de review o Continuar
        if (fromCheckAddress)
          dispatch(
            onboardRegisterAddress(
              userData,
              reduxAddress,
              curpRedux,
              rfcRedux,
              fromCheckAddress,
            ),
          );
        else navigation.navigate('onboardingConfirmAddress');
      } else {
        dispatch(onboardAddressOpenModal(rfcData.messageCode));
      }
    } catch (err) {
      dispatch(onboardAddressOpenModal(err.toString()));
    }
  });

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validaci??n de obligatorios
    if (!userData.curp) {
      isError = true;
      errorForm += ', CURP';
    }
    if (!userData.name) {
      isError = true;
      errorForm += ', Nombre (s)';
    }
    if (!userData.paternal) {
      isError = true;
      errorForm += ', Apellido Paterno';
    }
    if (!userData.maternal) {
      isError = true;
      errorForm += ', Apellido Materno';
    }
    if (!userData.birthdate) {
      isError = true;
      errorForm += ', Fecha de nacimiento';
    }
    if (!userData.nationality) {
      isError = true;
      errorForm += ', Nacionalidad';
    }
    if (!userData.birthCountry) {
      isError = true;
      errorForm += ', Pa??s de nacimiento';
    }
    if (!userData.birthEntity) {
      isError = true;
      errorForm += ', Entidad de nacimiento';
    }
    if (userData.gender == null) {
      isError = true;
      errorForm += ', G??nero';
    }
    if (userData.occupation == null) {
      isError = true;
      errorForm += ', Ocupaci??n';
    }
    if (level == '3' && !userData.rfc) {
      isError = true;
      errorForm += ', RFC con homoclave';
    }
    if (!userData.manifest) {
      //isError = true;
      errorForm += ', Manifiesto';
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
    if (userData.curp.length != 18) {
      isError = true;
      errorForm += '\n- CURP debe tener 18 caracteres.';
    } else if (!validator.matches(userData.curp.toUpperCase(), CURP_PATTERN)) {
      isError = true;
      errorForm += '\n- El formato del CURP no es v??lido.';
    }
    if (level == '1') {
      if (!isNullorEmpty(userData.rfc)) {
        if (userData.rfc.length != 10 && userData.rfc.length != 13) {
          isError = true;
          errorForm += '\n- RFC debe tener 10 ?? 13 caracteres.';
        } else if (
          !validator.matches(userData.rfc.toUpperCase(), RFC10_PATTERN) &&
          !validator.matches(userData.rfc.toUpperCase(), RFC_PATTERN)
        ) {
          isError = true;
          errorForm += '\n- El formato del RFC no es v??lido.';
        }
      }
    } else if (level == '3') {
      if (userData.rfc.length != 13) {
        isError = true;
        errorForm += '\n- RFC debe tener 13 caracteres.';
      } else if (!validator.matches(userData.rfc.toUpperCase(), RFC_PATTERN)) {
        isError = true;
        errorForm += '\n- El formato del RFC no es v??lido.';
      }
    }

    if (errorForm)
      errorForm =
        'Se encontraron las siguientes inconsistencias:\n' + errorForm;

    return {
      isError,
      errorForm,
    };
  };

  const setForm = (id, value) => {
    setUserData({
      ...userData,
      [id]: value,
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios' ? true : false);
    if (selectedDate) {
      setForm('birthdate', getDateString(selectedDate, 'DD/MM/YYYY'));
    }
  };

  const getPercentage = () => {
    let nn = 0;
    if (userData.curp) ++nn;
    if (userData.name) ++nn;
    if (userData.paternal) ++nn;
    if (userData.maternal) ++nn;
    if (userData.birthdate) ++nn;
    if (userData.birthCountry) ++nn;
    if (userData.birthEntity) ++nn;
    if (userData.gender) ++nn;
    if (userData.occupation) ++nn;

    return (nn * 50) / 9;
  };

  /**
   * @Desc: Cambia el pa??s seleccionado y resetea el estado si se selecciona
   * o deselecciona MEXICO
   */
  const changeCountry = item => {
    const _chMod = userData.birthCountry == MX_STP || item.value == MX_STP;
    setUserData({
      ...userData,
      birthCountry: item.value,
      ...(_chMod && {birthEntity: null}),
    });
  };
  /**
   * Calcula el RFC
   * @param {String} date Fecha de nacimiento 'YYMMDD'
   */
   const getRfc = date => {
    const person = {
      name: userData.name,
      paternal: userData.paternal,
      maternal: userData.maternal,
      birthdate: getDateString(getDate(date ?? userData.birthdate), 'YYMMDD'),
    };

    console.log('PERSON: ', person);
    return calculateRfc(person);
  };

  /**
   * Actualiza el RFC
   */
  const refreshRfc = () => {
    const rfc = getRfc();
    if (!isNullorWhitespace(rfc)) setForm('rfc', rfc);
  };
  const onCloseModal = () => {
    dispatch(onboardAddressCloseModal());
  };

  return (
    <OnboardingLevelOne
      isBackPress
      noHeader
      hideHelp
      titleBox={null}
      onBackPress={() => navigation.goBack()}
      loading={loading && navigation.isFocused()}
      navigation={navigation}>
      <View style={styles.container}>
        <FinsusHeader
          title={firstName}
          subtitle={'Verifica y completa tus datos.'}
          containerStyle={styles.titleContainer}
        />
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'CURP'}
          placeholderTextColor={'gray'}
          editable={false}
          maxLength={18}
          autoCapitalize={'characters'}
          value={userData.curp}
          onChange={text => setForm('curp', text)}
          returnKey={'next'}
          blurOnSubmit={false}
          onSubmitEditing={() => inputs['name'].focus()}
        />
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'Nombre (s)'}
          placeholderTextColor={'gray'}
          value={userData.name}
          onChange={text => setForm('name', text)}
          returnKey={'next'}
          blurOnSubmit={false}
          getRef={input => (inputs['name'] = input.current)}
          onSubmitEditing={() => inputs['paternal'].focus()}
        />
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'Apellido Paterno'}
          placeholderTextColor={'gray'}
          value={userData.paternal}
          onChange={text => setForm('paternal', text)}
          returnKey={'next'}
          blurOnSubmit={false}
          getRef={input => (inputs['paternal'] = input.current)}
          onSubmitEditing={() => inputs['maternal'].focus()}
        />
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'Apellido Materno'}
          placeholderTextColor={'gray'}
          value={userData.maternal}
          onChange={text => setForm('maternal', text)}
          getRef={input => (inputs['maternal'] = input.current)}
        />
        <FinsusTouchableTextMaterial
          showIcon={false}
          textcolor={userData.birthdate ? '#acb1c0' : 'gray'}
          placeholder={'Fecha de nacimiento'}
          value={userData.birthdate}
          onPress={() => {
            setShowPicker(!showPicker);
          }}
        />
        {showPicker && (
          <FinsusDatePicker
            value={
              userData.birthdate
                ? getDate(
                    `${userData.birthdate} 12:00`,
                    'DD/MM/YYYY HH:mm',
                  ).toDate()
                : new Date()
            }
            onDateChange={onDateChange}
            onAccept={() => setShowPicker(false)}
          />
        )}
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'Nacionalidad'}
          placeholderTextColor={'gray'}
          value={userData.nationality}
          onChange={text => setForm('nationality', text)}
        />
        <FinsusDropdownMaterial
          items={countries}
          value={userData.birthCountry}
          placeholder={'Pa??s de nacimiento'}
          onChange={item => {
            changeCountry(item);
          }}
          zIndex={5}
        />
        {userData.birthCountry === MX_STP && (
          <FinsusDropdownMaterial
            items={STATES_MX}
            value={userData.birthEntity}
            placeholder={'Entidad de nacimiento'}
            onChange={item => setForm('birthEntity', item.value)}
            zIndex={4}
          />
        )}
        {userData.birthCountry !== MX_STP && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Entidad de nacimiento'}
            placeholderTextColor={'gray'}
            value={userData.birthEntity}
            onChange={text => setForm('birthEntity', text)}
          />
        )}
        <FinsusDropdownMaterial
          items={[
            {
              label: 'Femenino',
              value: '1',
            },
            {
              label: 'Masculino',
              value: '0',
            },
          ]}
          value={userData.gender}
          placeholder={'G??nero'}
          onChange={item => setForm('gender', item.value)}
          zIndex={3}
        />
        <FinsusDropdownMaterial
          items={occupations}
          value={userData.occupation}
          placeholder={'Ocupaci??n'}
          onChange={item => setForm('occupation', item.value)}
        />
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={'e.Firma (opcional)'}
          placeholderTextColor={'gray'}
          value={userData.esignature}
          onChange={text => setForm('esignature', text)}
          returnKey={'next'}
          blurOnSubmit={false}
          onSubmitEditing={() => inputs['rfc'].focus()}
        />
        <FinsusInputTextMaterial
          showIcon={false}
          placeholder={`RFC ${level == '1' ? '(opcional)' : 'con homoclave'}`}
          placeholderTextColor={'gray'}
          autoCapitalize={'characters'}
          value={userData.rfc}
          onChange={text => setForm('rfc', text)}
          getRef={input => (inputs['rfc'] = input.current)}
        />
        {/*<View style={[styles.optionContainer]}>
          <OnboardingOption
            onPress={() => setForm('manifest', !userData.manifest)}
            disabled={false}
            active={true}
            title={'Manifiesto que act??o\npor cuenta propia'}
            checked={userData.manifest}
            outlineCheck={true}
        />
        </View>*/}
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
          <Text style={styles.progressText}>Direcci??n</Text>
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
  titleContainer: {
    marginTop: 20,
    marginBottom: 20,
    color:'black'
  },
  label14: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.38,
    color: '#ddd',
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
  optionContainer: {
    width: '85%',
    marginVertical: 20,
    flexDirection: 'column',
    alignSelf: 'center',
  },
});

export default OnboardingCustomerInfoScreen;
