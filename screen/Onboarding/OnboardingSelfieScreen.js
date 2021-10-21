import React, {useCallback, useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import xmlParser from 'react-xml-parser';
import getRealm from 'repository/offline/realm';
import {RepositoryFactory} from 'repository/RepositoryFactory';

import {
  onboardSelfieOpenModal,
  onboardSelfieCloseModal,
  onboardSelfieStart,
  onboardSelfieEnd,
  onboardingSetUser,
  onboardSetAddressData,
  onboardRegisterSelfie,
  onboardSetIneData,
  onboardSetImageDataSelfie,
} from 'store/actions';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import SelfieAvatar from 'components/ui/screens/onboarding/selfie/SelfieAvatar';
import OnboardingOption from 'components/ui/screens/onboarding/OnboardingOption';
import {useBackpress} from 'hooks/use-backpress';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import {getUID, isNullorWhitespace, isValidDate} from 'utils/methods';
import {MAX_SELFIE_ATTEMPTS} from 'utils/env';
import {DARK_GREY_BLUE} from 'utils/colors';

const UserRepository = RepositoryFactory.get('user');
const OnboardingSelfieScreen = ({navigation}) => {
  //Redux state
  const userPhone = useSelector(state => state.onboarding.userData.phone);
  const hasError = useSelector(
    state => state.onboarding.ineSelfieData.hasError,
  );
  const messageError = useSelector(
    state => state.onboarding.ineSelfieData.error,
  );
  const loading = useSelector(state => state.onboarding.ineSelfieData.loading);
  const items = useSelector(state => state.onboarding.ineSelfieData.items);
  const rfcRedux = useSelector(state => state.onboarding.userData?.rfc);
  const completeSetImages = items.filter(item => item.data);
  const ineRedux = useSelector(state => state.onboarding.ineData);
  const imgSelfie = useSelector(
    state => state.onboarding.ineSelfieData.items[0].data,
  );
  const imgFrontINE = useSelector(
    state => state.onboarding.ineSelfieData.items[1].data,
  );
  const imgBackINE = useSelector(
    state => state.onboarding.ineSelfieData.items[2].data,
  );
  const imgDomicile = useSelector(
    state => state.onboarding.ineSelfieData.items[3].data,
  );
  const level = useSelector(state => state.onboarding.userData.level);
  const dispatch = useDispatch();

  // Hooks
  useBackpress(() => {
    return true;
  });

  const onBackPress = () => {
    threeAccountLevel
      ? navigation.replace('onboardingCreateUser')
      : navigation.replace('onboardPickLevel');
  };

  const onCaptureFrontId = () => {
    resetIne();
    navigation.navigate('onboardingWarning', {type: 'frontalINE'});
  };

  const onCaptureBackId = () => {
    resetIne();
    navigation.navigate('onboardingWarning', {type: 'anversoINE'});
  };

  const onDetectFace = () => {
    resetIne();
    navigation.navigate('onboardingWarning', {type: 'selfie'});
  };

  /**
   * @Desc: Limpia los valores recuperados del INE
   * @date 2021-02-03 14:54:49
   */
  const resetIne = () => {
    if (
      !isNullorWhitespace(ineRedux.ocr) ||
      !isNullorWhitespace(ineRedux.keyVoter) ||
      !isNullorWhitespace(ineRedux.issueNumber)
    ) {
      dispatch(
        onboardSetIneData({
          ocr: null,
          keyVoter: null,
          issueNumber: null,
        }),
      );
    }
  };

  const hasDomicile = () => {
    if (level == '2' && !imgDomicile) return false;
    else return true;
  };
  
  const onProcessImageAndMatchFace = async () => {
    try {
      if (imgSelfie && imgFrontINE && imgBackINE && hasDomicile()) {
        if (
          isNullorWhitespace(ineRedux.ocr) ||
          isNullorWhitespace(ineRedux.keyVoter) ||
          isNullorWhitespace(ineRedux.issueNumber)
        ) {
          // No se ha obtenido el OCR correctamente antes
          getDocumentAddress();
        } else {
          // Ya se obtuvo el OCR antes
          dispatch(onboardRegisterSelfie(userPhone, ineRedux, items, rfcRedux));
        }
      } else {
        // NO HAY SELFIE || INE1 || INE2
        dispatch(onboardSelfieOpenModal('No se ha capturado las imágenes.'));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDocumentAddress = useCallback(async () => {
    try {
      dispatch(onboardSelfieStart());

      //#region Obtener número de intentos
      const realm = await getRealm();
      const AttemptRepository = RepositoryFactory.getRealm('attempt', realm);
      const attemptModel = {type: 'ineSelfie', count: 1};
      const attemptData = AttemptRepository.getOne({
        type: 'ineSelfie',
      });

      if (attemptData) {
        if (attemptData.count >= MAX_SELFIE_ATTEMPTS) {
          dispatch(
            onboardSelfieOpenModal(
              'Ha excedido el máximo número de intentos. Contacte a Soporte.',
            ),
          );
          return;
        }
        attemptModel.count = attemptData.count + 1;
      }
      //#endregion

      const _uid = await getUID();
      const requestDate = Math.round(new Date() / 1000);
      const {data: ineData} = await UserRepository.getINEData({
        requestDate,
        uid: _uid,
        imgSelfie,
        imgFrontINE,
        imgBackINE,
      });

      const resultXML = new xmlParser().parseFromString(ineData);

      // Status Code
      const statusCode = resultXML
        .getElementsByTagName('Status')[0]
        .getElementsByTagName('Status_Code')[0].value;

      if (statusCode == '000') {
        // Image Processing root
        const xmlImageProcessing = resultXML
          .getElementsByTagName('FormDetails')[0]
          .getElementsByTagName('Identity_Validation_and_Face_Matching')[0]
          .getElementsByTagName('IDmission_Image_Processing')[0];

        // State
        const formState = resultXML
          .getElementsByTagName('FormDetails')[0]
          .getElementsByTagName('State')[0].value;

        if (formState.trim().toUpperCase() !== 'APPROVED') {
          // Se actualiza/registra número de intentos
          if (attemptData) AttemptRepository.update(attemptData, attemptModel);
          else AttemptRepository.create(attemptModel);

          dispatch(
            onboardSelfieOpenModal(
              'No se pudo reconocer tu identificación, intenta capturarla nuevamente.',
            ),
          );
          return;
        }

        // Facematch Verification
        const facematchResult = xmlImageProcessing
          .getElementsByTagName('Customer_Photo_Processing')[0]
          .getElementsByTagName('FaceVerificationStatus')[0].value;

        if (facematchResult.trim().toUpperCase() !== 'VERIFIED') {
          // Se actualiza/registra número de intentos
          if (attemptData) AttemptRepository.update(attemptData, attemptModel);
          else AttemptRepository.create(attemptModel);

          dispatch(
            onboardSelfieOpenModal(
              'La fotografía del rostro no coincide con la foto de la identificación, por favor inténta de nuevo. \n\nProcura tener buena iluminación, enmarcar tu rostro y enfocar tu INE.',
            ),
          );
          return;
        }

        if (attemptData) realm.write(() => realm.delete(attemptData));

        // Image Data (OCR)
        const xmlImageData = xmlImageProcessing.getElementsByTagName(
          'ID_Image_Processing',
        )[0];

        const ineData = {
          name: xmlImageData.getElementsByTagName('First_Name')[0].value,
          paternal: xmlImageData.getElementsByTagName('Last_Name')[0].value,
          maternal: xmlImageData.getElementsByTagName('Middle_Name')[0].value,
          gender: getGender(
            xmlImageData.getElementsByTagName('Gender')[0].value,
          ),
          birthdate: getBirthdDate(
            xmlImageData.getElementsByTagName('Date_of_Birth')[0].value,
          ),
          nationality: xmlImageData.getElementsByTagName('Nationality')[0]
            .value,
          fullName: xmlImageData.getElementsByTagName('Name')[0].value,
          curp: xmlImageData.getElementsByTagName('IDNumber1')[0].value,
          cp: xmlImageData.getElementsByTagName('Postal_Code')[0].value,
          country: xmlImageData.getElementsByTagName('Country')[0].value,
          federalEntity: xmlImageData.getElementsByTagName('Extracted_State')[0]
            .value,
          city: xmlImageData.getElementsByTagName('City')[0].value,
          line1: xmlImageData.getElementsByTagName('AddressLine1')[0].value,
          line2: xmlImageData.getElementsByTagName('AddressLine2')[0].value,
          fullAddress: xmlImageData.getElementsByTagName('Address')[0].value,
          ocr: xmlImageData.getElementsByTagName('IDNumber2')[0].value,
          keyVoter: xmlImageData.getElementsByTagName('IDNumber3')[0].value,
          issueNumber: xmlImageData.getElementsByTagName('IDNumber4')[0].value,
        };

        dispatch(onboardSetIneData(ineData));

        const userData = {
          name: ineData.name,
          paternal: ineData.paternal,
          maternal: ineData.maternal,
          gender: ineData.gender,
          birthdate: ineData.birthdate,
          birthEntity: ineData.nationality,
          fullName: ineData.fullName,
          curp: ineData.curp,
          cameraUseAccepted: '1',
        };

        dispatch(onboardingSetUser(userData));

        const addressData = {
          cp: ineData.cp,
          country: ineData.country,
          federalEntity: ineData.federalEntity,
          city: ineData.city,
          municipality: null,
          suburb: ineData.line2,
          street: ineData.line1,
          internalNumber: '',
          externalNumber: '',
          fullAddress: ineData.fullAddress,
        };

        dispatch(onboardSetAddressData(addressData));
        dispatch(onboardSelfieEnd());

        //Registro
        
        console.log(' Si entro cuando es una cuenta nueva nivel 3')
        dispatch(onboardRegisterSelfie(userPhone, ineData, items, rfcRedux));

        
      } else {
        // El formulario no se envió correctamente
        dispatch(onboardSelfieOpenModal(resultSdk.Status_Message));
      }
    } catch (e) {
      dispatch(onboardSelfieOpenModal(`Error:\n${e.toString()}`));
    }
  }, [imgSelfie, imgFrontINE, imgBackINE]);

  /**
   * javascript comment
   * @Author: AZozaya
   * @Date: 2020-06-03 17:53:42
   * @Desc: Obtiene el valor del género a partir de la cadena obtenida por IDMission
   * @param {string} gender Cadena correspondiente al género
   */
  const getGender = gender => {
    if (gender == null || gender == undefined) return null;
    else if (gender.toUpperCase() === 'MALE') return '0';
    else if (gender.toUpperCase() === 'FEMALE') return '1';
    else return null;
  };

  /**
   * javascript comment
   * @Author: AZozaya
   * @Date: 2020-06-03 23:25:44
   * @Desc: Obtiene la fecha de nacimiento válida o null
   * @param {string} birthdate Cadena correspondiente a la fecha de nacimiento
   */
  const getBirthdDate = birthdate => {
    if (birthdate == null || birthdate == undefined) return null;
    else if (isValidDate(birthdate)) return birthdate;
    else return null;
  };

  const onCloseModal = () => {
    dispatch(onboardSelfieCloseModal());
  };

  return (
    <OnboardingLevelOne
      isBackPress
      title={`Captura en\nfoto los\ndocumentos`}
      onBackPress={onBackPress}
      loading={loading}
      navigation={navigation}>
      <View style={styles.container}>
      <Image source={require('/assets/icons/camara.png')} style={styles.imagetitle}></Image>
        <View style={styles.informationTitleContainer}>
          <Text
            style={[
              styles.informationTitle,
              {
                marginBottom: 2,
              },
            ]}
          />
          <Text style={styles.informationTitle}>{'Captura en foto los siguientes\ndocumentos del usuario'}</Text>
        </View>
        <View style={[styles.optionContainer]}>
          <OnboardingOption
            onPress={onDetectFace}
            image={items[0].image}
            disabled={items[0].disabled}
            active={items[0].active}
            title={items[0].title}
            checked={items[0].data}
            outlineCheck={true}
          />
          <OnboardingOption
            onPress={onCaptureFrontId}
            image={items[1].image}
            disabled={items[1].disabled}
            active={items[1].active}
            title={items[1].title}
            checked={items[1].data}
            outlineCheck={true}
          />
          <OnboardingOption
            onPress={onCaptureBackId}
            image={items[2].image}
            disabled={items[2].disabled}
            active={items[2].active}
            title={items[2].title}
            checked={items[2].data}
            outlineCheck={true}
          />
          <OnboardingOption
            onPress={items[3].onPress}
            image={items[3].image}
            disabled={items[3].disabled}
            active={items[3].active}
            title={items[3].title}
            checked={items[3].data}
            outlineCheck={true}
          />
          {rfcRedux && (
            <Text style={styles.informationTitle}>RFC: {rfcRedux}</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {completeSetImages.length === 4 && (
            <FinsusButtonSecondary
              text={'Ok'}
              onPress={onProcessImageAndMatchFace}
            />
          )}
        </View>
      </View>
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError}
        text={messageError}
      />
    </OnboardingLevelOne>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  imagetitle:{
    marginTop:-100,
    marginLeft:'80%'
  },
  titulo:{
    fontSize:25,
    fontFamily:'Montserrat-Medium',
    color:'black',
  },
  informationTitleContainer: {
    marginBottom: 40,
  },
  informationTitle: {
    paddingLeft:15,
    marginTop:15,
    fontSize: 15,
    textAlign: 'left',
    color: 'black',
  },
  buttonContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContainer: {
    width: '100%',
    marginVertical: 20,
    flexDirection: 'column',
    alignSelf: 'center',
    borderRadius:0,
  },
});

export default OnboardingSelfieScreen;
