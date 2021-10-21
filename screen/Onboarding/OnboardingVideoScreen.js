import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import xmlParser from 'react-xml-parser';
import {
  onboardOpenModal,
  onboardCloseModal,
  onboardSetVideoData,
  onboardSetVideoActive,
  onboardSetRfcData,
  onboardSetAddress2Data,
  onboardValidateRfc,
  onboardStartLoading,
  onboardEndLoading,
  onboardSetAddressData,
} from 'store/actions';
import {RepositoryFactory} from 'repository/RepositoryFactory';

import validator from 'validator';
import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import SelfieAvatar from 'components/ui/screens/onboarding/selfie/SelfieAvatar';
import OnboardingOption from 'components/ui/screens/onboarding/OnboardingOption';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import FinsusBaseModal from 'components/base/FinsusBaseModal';
import {useBackpress} from 'hooks/use-backpress';
import {capitalize, decrypt, getUID} from 'utils/methods';
import {RFC_PATTERN} from 'utils/env';

const UserRepository = RepositoryFactory.get('user');
const OnboardRepository = RepositoryFactory.get('onboard');
const OnboardingVideoScreen = ({navigation}) => {
  const dispatch = useDispatch();

  useBackpress(() => {
    return true;
  });

  //Redux state
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  const prevAddress = useSelector(state => state.onboarding.addressData);
  const phoneOB = useSelector(state => state.onboarding.userData.phone);
  const passOB = useSelector(state => state.onboarding.securityData.password);
  const userAuth = useSelector(state => state.auth.usuario);
  const items = useSelector(state => state.onboarding.videoData.items);
  const completeSetImages = items.filter(item => item.data);

  const imgSelfieOB = useSelector(
    state => state.onboarding.ineSelfieData.items[0].data,
  );
  const imgSelfieAuth = useSelector(state => state.auth.usuario.imageSelfie);
  const usrname = useSelector(state => state.onboarding.userData.name);

  const imgDomicile = useSelector(
    state => state.onboarding.videoData.items[0].data,
  );
  const rfcUser = useSelector(
    state => state.onboarding.videoData.items[1].data,
  );

  // Component state
  const [showRfc, setShowRfc] = useState(false);
  const [rfc, setRfc] = useState('');
  const [rfcError, setRfcError] = useState('');

  // Hooks
  useEffect(() => {
    if (!prevAddress.street || !prevAddress.externalNumber)
      getPreviousAddress();
  }, []);

  const getPreviousAddress = useCallback(async () => {
    dispatch(onboardStartLoading());

    try {
      const {data: domicileData} = await OnboardRepository.RegisterGetAddress({
        phone: phoneOB ?? userAuth.phone,
        password: passOB ?? decrypt(userAuth.password),
      });

      const dir = domicileData.direction;
      if (domicileData.statusCode == '000') {
        const _address = {
          cp: dir.cp,
          country: dir.country,
          federalEntity: dir.entity,
          city: dir.city,
          municipality: dir.municipality,
          suburb: dir.colony,
          street: dir.street,
          internalNumber: dir.internalNumber,
          externalNumber: dir.externalNumber,
          fullAddress: `${dir.street} ${dir.externalNumber}, ${dir.colony}, ${
            dir.municipality
          } ${dir.city} ${dir.cp}`,
        };

        dispatch(onboardSetAddressData(_address));
      } else {
        console.log('\nELSE PREVADDRESS :: ', domicileData);
      }
    } catch (e) {
      console.log('CATCH GETADDRESS::', e);
    } finally {
      dispatch(onboardEndLoading());
    }
  });

  const getDocumentAddress = useCallback(async () => {
    dispatch(onboardStartLoading());
    try {
      const {isError, errorForm} = validateForm();

      if (isError) {
        dispatch(onboardOpenModal(errorForm));
        return;
      }

      const _requestDate = Math.round(new Date() / 1000);
      const _uid = await getUID();
      const {data: domicileData} = await UserRepository.getDomicileProofData({
        requestDate: _requestDate,
        uid: _uid,
        imgFront: imgDomicile,
      });

      const resultXML = new xmlParser().parseFromString(domicileData);

      // Status Code
      const statusCode = resultXML
        .getElementsByTagName('Status')[0]
        .getElementsByTagName('Status_Code')[0].value;

      if (statusCode == '000') {
        // State
        const formState = resultXML
          .getElementsByTagName('FormDetails')[0]
          .getElementsByTagName('State')[0].value;

        if (
          formState.trim().toUpperCase() !== 'APPROVED' &&
          formState.trim().toUpperCase() !== 'SUBMITTED'
        ) {
          const _prevAddress = {
            cp: prevAddress.cp,
            country: prevAddress.country,
            federalEntity: prevAddress.federalEntity,
            city: prevAddress.city,
            municipality: prevAddress.municipality,
            suburb: prevAddress.suburb,
            street: prevAddress.street,
            internalNumber: prevAddress.internalNumber,
            externalNumber: prevAddress.externalNumber,
            fullAddress: prevAddress.fullAddress,
            ocr: false,
          };

          dispatch(onboardSetAddress2Data(_prevAddress));
        } else {
          // Image Data (OCR)
          const xmlImageData = resultXML
            .getElementsByTagName('FormDetails')[0]
            .getElementsByTagName('Identity_Validation_and_Face_Matching')[0]
            .getElementsByTagName('IDmission_Image_Processing')[0]
            .getElementsByTagName('ID_Image_Processing')[0];

          const rfcData = {
            cp: xmlImageData.getElementsByTagName('Postal_Code')[0].value,
            country: xmlImageData.getElementsByTagName('Country')[0].value,
            federalEntity: xmlImageData.getElementsByTagName(
              'Extracted_State',
            )[0].value,
            city: xmlImageData.getElementsByTagName('City')[0].value,
            line1: xmlImageData.getElementsByTagName('AddressLine1')[0].value,
            line2: xmlImageData.getElementsByTagName('AddressLine2')[0].value,
            fullAddress: xmlImageData.getElementsByTagName('Address')[0].value,
          };

          dispatch(onboardSetRfcData(rfcData));

          const addressData = {
            cp: rfcData.cp,
            country: rfcData.country,
            federalEntity: rfcData.federalEntity,
            city: rfcData.city,
            municipality: null,
            suburb: rfcData.line2,
            street: rfcData.line1,
            internalNumber: '',
            externalNumber: '',
            fullAddress: rfcData.fullAddress,
            ocr: true,
          };

          dispatch(onboardSetAddress2Data(addressData));
        }

        dispatch(onboardEndLoading());
        dispatch(onboardValidateRfc(rfcUser));
      } else {
        // El formulario no se envió correctamente
        dispatch(
          onboardOpenModal(
            'Error al enviar la información. Intenta más tarde.',
          ),
        );
      }
    } catch (e) {
      dispatch(onboardOpenModal('No se pudo recuperar la información.'));
      console.log('CATCH ID20::', e);
    }
  });

  const onRfcAccept = () => {
    setRfcError('');

    if (!rfc) setRfcError('* RFC es obligatorio.');
    else if (rfc.length !== 13) setRfcError('* RFC debe contener 13 dígitos.');
    else if (!validator.matches(rfc, RFC_PATTERN))
      setRfcError('* El RFC no tiene el formato correcto.');
    else {
      dispatch(onboardSetVideoData(rfc.toUpperCase(), 1));
      dispatch(onboardSetVideoActive(2));

      setShowRfc(false);
    }
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!imgDomicile) {
      isError = true;
      errorForm += ', Comprobante de domicilio';
    }
    if (!rfcUser) {
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

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <OnboardingLevelOne
      isBackPress
      onBackPress={onBackPress}
      loading={loading && navigation.isFocused()}
      titleBox={
        <SelfieAvatar
          image={
            imgSelfieOB
              ? {
                  uri: `data:image/jpg;base64,${imgSelfieOB}`,
                }
              : imgSelfieAuth
              ? {
                  uri: `data:image/jpg;base64,${imgSelfieAuth}`,
                }
              : require('assets/images/user-logo.png')
          }
          title={'Hola' + (usrname ? ' ' + capitalize(usrname) : '') + ','}
        />
      }
      navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.informationTitleContainer}>
          <Text style={styles.informationTitle}>
            {
              'Registra tu\ncomprobante de\ndomicilio y escribe\ntu RFC con\nhomoclave.'
            }
          </Text>
        </View>
        <View style={[styles.optionContainer]}>
          <OnboardingOption
            onPress={items[0].onPress}
            image={items[0].image}
            disabled={items[0].disabled}
            active={items[0].active}
            title={items[0].title}
            checked={items[0].data}
            outlineCheck={true}
          />
          <OnboardingOption
            onPress={() => setShowRfc(true)}
            image={items[1].image}
            disabled={items[1].disabled}
            active={items[1].active}
            title={`${items[1].title}\n${items[1].data ?? ''}`}
            checked={items[1].data}
            outlineCheck={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          {completeSetImages.length === 2 && (
            <FinsusButtonSecondary
              text={'Ok'}
              color={'rgba(0,0,0,0.25)'}
              onPress={getDocumentAddress}
            />
          )}
        </View>
      </View>
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}
        text={messageError}
      />
      <FinsusBaseModal
        done={() => setShowRfc(false)}
        visible={showRfc}
        showAccept={true}
        onAccept={onRfcAccept}>
        <View>
          <Text style={styles.rfcModalCaption}>
            Ingresa el RFC con homoclave
          </Text>
          <TextInput
            value={rfc}
            maxLength={13}
            autoCapitalize={'characters'}
            style={[styles.input]}
            onChangeText={text => {
              setRfc(text);
            }}
          />
          <Text style={styles.rfcModalError}>{rfcError}</Text>
        </View>
      </FinsusBaseModal>
    </OnboardingLevelOne>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgb(40, 52,96)',
  },
  informationTitleContainer: {
    marginBottom: 30,
  },
  informationTitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 21,
    textAlign: 'center',
    color: '#fff',
  },
  buttonContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 6,
  },
  input: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0.3,
    textAlign: 'center',
    color: '#fff',
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 1,
  },
  rfcModalCaption: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#fff',
  },
  rfcModalError: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 10,
    color: '#ffa500',
  },
  optionContainer: {
    width: '85%',
    marginBottom: 32,
    flexDirection: 'column',
    alignSelf: 'center',
  },
});

export default OnboardingVideoScreen;
