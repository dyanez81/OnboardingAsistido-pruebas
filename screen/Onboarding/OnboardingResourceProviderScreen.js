import React, {useState, useCallback} from 'react';
import {View, Text, TextInput, StyleSheet, Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import validator from 'validator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RepositoryFactory} from 'repository/RepositoryFactory';
import {
  onboardCloseModal,
  onboardEndLoading,
  onboardOpenModal,
  onboardRegisterResProvider,
  onboardSetProvider,
  onboardStartLoading,
} from 'store/actions';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusInputTextMaterial from 'components/base/FinsusInputTextMaterial';
import FinsusTouchableTextMaterial from 'components/base/FinsusTouchableTextMaterial';
import FinsusDatePicker from 'components/base/FinsusDatePicker';
import FinsusBottomButton from 'components/base/FinsusBottomButton';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import FinsusDropdownMaterial from 'components/base/FinsusDropdownMaterial';
import FinsusRadioButton from 'components/base/FinsusRadioButton';
import FinsusHeader from 'components/base/FinsusHeader';
import {getDate, getDateString} from 'utils/methods';
import {processGoogleAddress} from 'utils/mapsUtils';
import {CURP_PATTERN, occupations, RFC_PATTERN} from 'utils/env';

const GeocodeRepo = RepositoryFactory.get('geocode');

const OnboardingResourceProviderScreen = ({navigation}) => {
  //Redux state
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  const usrphone = useSelector(state => state.onboarding.userData.phone);
  const firstName = useSelector(state => state.onboarding.userData.name);
  const dispatch = useDispatch();

  // Component state
  const [showPicker, setShowPicker] = useState(false);
  const [addProvider, setAddProvider] = useState(false);
  const [inputs] = useState({});
  const [suburbs, setSuburbs] = useState([]);
  const [provider, setProvider] = useState({
    type: '1',
    denomination: null,
    name: null,
    paternal: null,
    maternal: null,
    birthdate: null,
    nationality: '',
    occupation: null,
    curp: '',
    rfc: '',
    taxIdentificationNumber: null,
    countriesAssignment: null,
    eSignature: null,
    cp: '',
    federalEntity: null,
    city: null,
    municipality: null,
    suburb: null,
    street: null,
    externalNumber: null,
    internalNumber: null,
    suburbs: [],
  });

  const onNextScreen = () => {
    const {isError, errorForm} = validateForm();

    if (addProvider === true && isError) {
      dispatch(onboardOpenModal(errorForm));
      return;
    }

    if (addProvider) {
      dispatch(onboardSetProvider({resourceProvider: '1'}));
      dispatch(
        onboardRegisterResProvider({
          phone: usrphone,
          ...provider,
        }),
      );
    } else {
      dispatch(onboardSetProvider({resourceProvider: '0'}));
      navigation.navigate('onboardingBeneficiary');
    }
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    const isFisico = provider.type === '1';

    // Validación de obligatorios
    if (!isFisico && !provider.denomination) {
      isError = true;
      errorForm += ', Denominación o razón social';
    }
    if (isFisico && !provider.name) {
      isError = true;
      errorForm += ', Nombre (s)';
    }
    if (isFisico && !provider.paternal) {
      isError = true;
      errorForm += ', Apellido Paterno';
    }
    if (isFisico && !provider.maternal) {
      isError = true;
      errorForm += ', Apellido Materno';
    }
    if (isFisico && !provider.birthdate) {
      isError = true;
      errorForm += ', Fecha de nacimiento';
    }
    if (!provider.nationality) {
      isError = true;
      errorForm += ', Nacionalidad';
    }
    if (isFisico && provider.occupation == null) {
      isError = true;
      errorForm += ', Ocupación';
    }
    if (!isFisico && !provider.rfc) {
      isError = true;
      errorForm += ', RFC con homoclave';
    }
    if (!provider.cp) {
      isError = true;
      errorForm += ', Código Postal';
    }
    if (!provider.street) {
      isError = true;
      errorForm += ', Calle';
    }
    if (!provider.externalNumber) {
      isError = true;
      errorForm += ', Número exterior';
    }
    if (!provider.suburb) {
      isError = true;
      errorForm += ', Colonia';
    }
    if (!provider.municipality) {
      isError = true;
      errorForm += ', Delegación o municipio';
    }
    if (!provider.city) {
      isError = true;
      errorForm += ', Ciudad';
    }
    if (!provider.federalEntity) {
      isError = true;
      errorForm += ', Entidad Federativa';
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
    if (provider.curp.length !== 0 && provider.curp.length !== 18) {
      isError = true;
      errorForm += '\n- CURP debe tener 18 caracteres.';
    } else if (
      provider.curp.length === 18 &&
      !validator.matches(provider.curp.toUpperCase(), CURP_PATTERN)
    ) {
      isError = true;
      errorForm += '\n- El formato del CURP no es válido.';
    }
    if (provider.rfc.length !== 0 && provider.rfc.length !== 13) {
      isError = true;
      errorForm += '\n- RFC debe tener 13 caracteres.';
    } else if (
      provider.rfc.length === 13 &&
      !validator.matches(provider.rfc.toUpperCase(), RFC_PATTERN)
    ) {
      isError = true;
      errorForm += '\n- El formato del RFC no es válido.';
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
    setProvider({
      ...provider,
      [id]: value,
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios' ? true : false);
    if (selectedDate) {
      setForm('birthdate', getDateString(selectedDate, 'DD/MM/YYYY'));
    }
  };

  /**
   * @Desc: Buscar dirección por CP
   * @date 2021-05-06 17:21:35
   */
  const searchByCP = useCallback(async manualSearch => {
    const {isError, errorForm} = validateSearch();

    if (isError) {
      if (manualSearch) dispatch(onboardOpenModal(errorForm));
      return;
    }

    // setProvider({...provider, suburb: ''});
    dispatch(onboardStartLoading());

    try {
      const {data: geodata} = await GeocodeRepo.getAddressByCP({
        cp: provider.cp,
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

        setProvider({
          ...provider,
          federalEntity: _address.federalEntity,
          city: _address.city,
          municipality: _address.municipality,
          suburb: _multiple === true ? '' : _address.suburb,
          street: _address.street,
          externalNumber: _address.externalNumber,
        });

        setSuburbs(_suburbs);

        dispatch(onboardEndLoading());
      } else if (geodata.status !== 'ZERO_RESULTS') {
        dispatch(onboardOpenModal(geodata.error_message ?? geodata.status));
      }
    } catch (err) {
      dispatch(
        onboardOpenModal(
          `No se encontró información de ese CP:\n${err.toString()}`,
        ),
      );
    }
  });

  /**
   * @Desc: Valida el campo de búsqueda
   * @date 2021-05-28 17:32:37
   */
  const validateSearch = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!provider.cp) {
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
      !validator.isNumeric(provider.cp, {
        no_symbols: true,
      })
    ) {
      isError = true;
      errorForm += '\n- Código Postal solo debe incluir números';
    }
    if (provider.cp.length !== 5) {
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

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
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
          subtitle={'Danos información sobre quien fondea la cuenta.'}
          containerStyle={styles.titleContainer}
        />
        <View style={styles.section}>
          <Text style={styles.subtitle}>
            ¿Quién aportará recursos a esta cuenta de manera regular?
          </Text>
          <FinsusRadioButton
            text={'Yo'}
            checked={!addProvider}
            onPress={() => setAddProvider(false)}
          />
          <FinsusRadioButton
            text={'Otra persona'}
            checked={addProvider}
            onPress={() => setAddProvider(true)}
          />
        </View>
        {addProvider && (
          <>
            <View style={styles.section}>
              <Text style={styles.subtitle}>Tipo de persona</Text>
              <FinsusRadioButton
                text={'Física'}
                checked={provider.type === '1'}
                onPress={() => setForm('type', '1')}
              />
              <FinsusRadioButton
                text={'Moral'}
                checked={provider.type === '2'}
                onPress={() => setForm('type', '2')}
              />
            </View>
            {provider.type === '2' && (
              <FinsusInputTextMaterial
                showIcon={false}
                placeholder={'Denominación o razón social'}
                placeholderTextColor={'gray'}
                value={provider.denomination}
                onChange={text => setForm('denomination', text)}
                returnKey={'next'}
                blurOnSubmit={false}
                onSubmitEditing={() => inputs['nationality'].focus()}
              />
            )}
            {provider.type === '1' && (
              <>
                <FinsusInputTextMaterial
                  showIcon={false}
                  placeholder={'Nombre(s)'}
                  placeholderTextColor={'gray'}
                  value={provider.name}
                  onChange={text => setForm('name', text)}
                  returnKey={'next'}
                  blurOnSubmit={false}
                  onSubmitEditing={() => inputs['paternal'].focus()}
                />
                <FinsusInputTextMaterial
                  showIcon={false}
                  placeholder={'Apellido Paterno'}
                  placeholderTextColor={'gray'}
                  value={provider.paternal}
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
                  value={provider.maternal}
                  onChange={text => setForm('maternal', text)}
                  getRef={input => (inputs['maternal'] = input.current)}
                />
                <FinsusTouchableTextMaterial
                  showIcon={false}
                  textcolor={provider.birthdate ? '#acb1c0' : 'gray'}
                  placeholder={'Fecha de nacimiento'}
                  value={provider.birthdate}
                  onPress={() => {
                    setShowPicker(!showPicker);
                  }}
                />
                {showPicker && (
                  <FinsusDatePicker
                    value={
                      provider.birthdate
                        ? getDate(
                            `${provider.birthdate} 12:00`,
                            'DD/MM/YYYY HH:mm',
                          ).toDate()
                        : new Date()
                    }
                    onDateChange={onDateChange}
                    onAccept={() => setShowPicker(false)}
                  />
                )}
              </>
            )}
            <FinsusInputTextMaterial
              showIcon={false}
              placeholder={'Nacionalidad'}
              placeholderTextColor={'gray'}
              value={provider.nationality}
              onChange={text => setForm('nationality', text)}
              returnKey={provider.type === '1' ? 'default' : 'next'}
              blurOnSubmit={provider.type === '1'}
              getRef={input => (inputs['nationality'] = input.current)}
              onSubmitEditing={() => {
                if (provider.type === '2') inputs['rfc'].focus();
              }}
            />
            {provider.type === '1' && (
              <>
                <FinsusDropdownMaterial
                  items={occupations}
                  value={provider.occupation}
                  placeholder={'Ocupación'}
                  onChange={item => setForm('occupation', item.value)}
                />
                <FinsusInputTextMaterial
                  showIcon={false}
                  placeholder={'CURP (opcional)'}
                  placeholderTextColor={'gray'}
                  maxLength={18}
                  autoCapitalize={'characters'}
                  value={provider.curp}
                  onChange={text => setForm('curp', text)}
                  returnKey={'next'}
                  blurOnSubmit={false}
                  onSubmitEditing={() => inputs['rfc'].focus()}
                />
              </>
            )}
            <FinsusInputTextMaterial
              showIcon={false}
              placeholder={`RFC${provider.type === '1' ? ' (opcional)' : ''}`}
              placeholderTextColor={'gray'}
              autoCapitalize={'characters'}
              value={provider.rfc}
              onChange={text => setForm('rfc', text)}
              getRef={input => (inputs['rfc'] = input.current)}
              returnKey={'next'}
              blurOnSubmit={false}
              onSubmitEditing={() => inputs['taxid'].focus()}
            />
            <FinsusInputTextMaterial
              showIcon={false}
              placeholder={'Número identificación fiscal (opcional)'}
              placeholderTextColor={'gray'}
              value={provider.taxIdentificationNumber}
              onChange={text => setForm('taxIdentificationNumber', text)}
              getRef={input => (inputs['taxid'] = input.current)}
              returnKey={'next'}
              blurOnSubmit={false}
              onSubmitEditing={() => inputs['countries'].focus()}
            />
            <FinsusInputTextMaterial
              showIcon={false}
              placeholder={'País de asignación (opcional)'}
              placeholderTextColor={'gray'}
              value={provider.countriesAssignment}
              onChange={text => setForm('countriesAssignment', text)}
              getRef={input => (inputs['countries'] = input.current)}
              returnKey={'next'}
              blurOnSubmit={false}
              onSubmitEditing={() => inputs['esignature'].focus()}
            />
            <FinsusInputTextMaterial
              showIcon={false}
              placeholder={'Firma electrónica avanzada (opcional)'}
              placeholderTextColor={'gray'}
              value={provider.eSignature}
              onChange={text => setForm('eSignature', text)}
              getRef={input => (inputs['esignature'] = input.current)}
              returnKey={'next'}
              blurOnSubmit={false}
              onSubmitEditing={() => inputs['cp'].focus()}
            />
            <View style={styles.section}>
              <Text style={styles.subtitle}>
                Domicilio particular de la persona física
              </Text>
            </View>
            <View style={styles.cpContainer}>
              <TextInput
                value={provider.cp}
                placeholder={'Código Postal'}
                onChangeText={text => setForm('cp', text)}
                placeholderTextColor={'gray'}
                style={styles.cp}
                keyboardType={'numeric'}
                maxLength={5}
                contextMenuHidden={true}
                ref={ref => (inputs['cp'] = ref)}
                returnKey={'next'}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  inputs['street'].focus();
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
              placeholder={'Calle'}
              placeholderTextColor={'gray'}
              value={provider.street}
              onChange={text => setForm('street', text)}
              returnKey={'next'}
              blurOnSubmit={false}
              getRef={input => (inputs['street'] = input.current)}
              onSubmitEditing={() => inputs['number'].focus()}
            />
            <View style={styles.numberSection}>
              <View style={{flex: 1}}>
                <FinsusInputTextMaterial
                  showIcon={false}
                  placeholder={'Núm. exterior'}
                  placeholderTextColor={'gray'}
                  value={provider.externalNumber}
                  onChange={text => setForm('externalNumber', text)}
                  returnKey={'next'}
                  blurOnSubmit={false}
                  getRef={input => (inputs['number'] = input.current)}
                  onSubmitEditing={() => inputs['intnumber'].focus()}
                />
              </View>
              <View style={{flex: 1}}>
                <FinsusInputTextMaterial
                  showIcon={false}
                  placeholder={'Núm. interior'}
                  placeholderTextColor={'gray'}
                  value={provider.internalNumber}
                  onChange={text => setForm('internalNumber', text)}
                  returnKey={suburbs.length > 0 ? 'default' : 'next'}
                  blurOnSubmit={suburbs.length > 0}
                  getRef={input => (inputs['intnumber'] = input.current)}
                  onSubmitEditing={() => {
                    if (suburbs.length == 0) inputs['suburb'].focus();
                  }}
                />
              </View>
            </View>
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
                value={provider.suburb}
                onChange={text => setForm('suburb', text)}
                returnKey={'next'}
                blurOnSubmit={false}
                getRef={input => (inputs['suburb'] = input.current)}
                onSubmitEditing={() => inputs['town'].focus()}
              />
            )}
            <FinsusInputTextMaterial
              showIcon={false}
              placeholder={'Alcaldía o municipio'}
              placeholderTextColor={'gray'}
              value={provider.municipality}
              onChange={text => setForm('municipality', text)}
              returnKey={'next'}
              blurOnSubmit={false}
              getRef={input => (inputs['town'] = input.current)}
              onSubmitEditing={() => inputs['city'].focus()}
            />
            <FinsusInputTextMaterial
              showIcon={false}
              placeholder={'Ciudad'}
              placeholderTextColor={'gray'}
              value={provider.city}
              onChange={text => setForm('city', text)}
              returnKey={'next'}
              blurOnSubmit={false}
              getRef={input => (inputs['city'] = input.current)}
              onSubmitEditing={() => inputs['state'].focus()}
            />
            <FinsusInputTextMaterial
              showIcon={false}
              placeholder={'Entidad Federativa'}
              placeholderTextColor={'gray'}
              value={provider.federalEntity}
              onChange={text => setForm('federalEntity', text)}
              getRef={input => (inputs['state'] = input.current)}
            />
          </>
        )}
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
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    letterSpacing: 0.38,
    color: '#ddd',
    marginVertical: 3,
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
  section: {
    flex: 1,
    paddingHorizontal: '10%',
    marginBottom: 20,
  },
  numberSection: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: '6%',
    marginBottom: 20,
  },
});

export default OnboardingResourceProviderScreen;
