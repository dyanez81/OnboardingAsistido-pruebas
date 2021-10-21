import {Platform} from 'react-native';
import NavigationService from 'router/NavigationService';
import {RepositoryFactory} from 'repository/RepositoryFactory';
import xmlParser from 'react-xml-parser';
import moment from 'moment';
import getRealm from 'repository/offline/realm';
import {
  ONBOARD_SET_USER,
  ONBOARD_SET_USER_OPEN_MODAL,
  ONBOARD_SET_USER_CLOSE_MODAL,
  ONBOARD_SET_USER_FAIL_SEND_SMS,
  ONBOARD_SET_USER_START_SEND_SMS,
  ONBOARD_SET_USER_SUCCESS_SEND_SMS,
  ONBOARD_USER_START,
  ONBOARD_USER_END,
  ONBOARD_SMS_CLOSE_MODAL,
  ONBOARD_SMS_OPEN_MODAL,
  ONBOARD_SET_SELFIE_DATA,
  ONBOARD_SET_ACTIVE_IMAGE,
  ONBOARD_SELFIE_OPEN_MODAL,
  ONBOARD_SELFIE_CLOSE_MODAL,
  ONBOARD_SELFIE_START,
  ONBOARD_SELFIE_END,
  ONBOARD_SET_ADDRESS_DATA,
  ONBOARD_ADDRESS_OPEN_MODAL,
  ONBOARD_ADDRESS_CLOSE_MODAL,
  ONBOARD_SET_PROVIDER,
  ONBOARD_SET_BENEFICIARY,
  ONBOARD_BENEFICIARY_OPEN_MODAL,
  ONBOARD_BENEFICIARY_CLOSE_MODAL,
  ONBOARD_SET_DOCUMENT_DATA,
  ONBOARD_SET_ACTIVE_DOCUMENT,
  ONBOARD_SET_SIGNATURE,
  ONBOARD_SET_PASSWORD,
  ONBOARD_PASSWORD_OPEN_MODAL,
  ONBOARD_PASSWORD_CLOSE_MODAL,
  ONBOARD_PASSWORD_START,
  ONBOARD_PASSWORD_END,
  ONBOARD_OPEN_MODAL,
  ONBOARD_CLOSE_MODAL,
  ONBOARD_START_LOADING,
  ONBOARD_END_LOADING,
  ONBOARD_SET_LASTDATA,
  ONBOARD_SET_VIDEO_DATA,
  ONBOARD_SET_VIDEO_ACTIVE,
  ONBOARD_SET_VIDEO_ONPRESS,
  ONBOARD_SET_INEDATA,
  ONBOARD_SET_CURPDATA,
  ONBOARD_SET_RFCDATA,
  ONBOARD_SET_ADDRESS2_DATA,
  ONBOARD_SET_VIDEOCALL_DATA,
  ONBOARD_SET_DOMICILE_DATA,
  ONBOARD_SET_ONPRESS,
} from './actionTypes';
import {
  encrypt,
  generateCodeSMS,
  getUID,
  getUIdToken,
  isNullorWhitespace,
  trimStr,
} from 'utils/methods';
import {
  API_DIMMER_LOGIN,
  API_DIMMER_PASS,
  API_DIMMER_APPCODE,
  API_DIMMER_REGISTER_LOGIN,
  API_DIMMER_REGISTER_PASS,
  API_DIMMER_REGISTER_APPCODE,
  MIN_SCORE_LEVELONE,
} from 'utils/env';

const SMSRepository = RepositoryFactory.get('sms');
const OnboardRepository = RepositoryFactory.get('onboard');
const UserRepository = RepositoryFactory.get('user');
const AuthRepository = RepositoryFactory.get('auth');
const PushRepository = RepositoryFactory.get('push');

export const onboardingSetUser = user => {
  return {
    type: ONBOARD_SET_USER,
    user,
  };
};

export const onboardSetUserOpenModal = message => {
  return {
    type: ONBOARD_SET_USER_OPEN_MODAL,
    message,
  };
};

export const onboardSetUserCloseModal = () => {
  return {
    type: ONBOARD_SET_USER_CLOSE_MODAL,
  };
};

export const onboardSetUserStartSendSMS = () => {
  return {
    type: ONBOARD_SET_USER_START_SEND_SMS,
  };
};

export const onboardSetUserSuccessSendSMS = code => {
  return {
    type: ONBOARD_SET_USER_SUCCESS_SEND_SMS,
    code,
  };
};

export const onboardSetUserFailSendSMS = message => {
  return {
    type: ONBOARD_SET_USER_FAIL_SEND_SMS,
    message,
  };
};

export const onboardUserStart = () => {
  return {
    type: ONBOARD_USER_START,
  };
};

export const onboardUserEnd = () => {
  return {
    type: ONBOARD_USER_END,
  };
};

export const onboardSMSOpenModal = message => {
  return {
    type: ONBOARD_SMS_OPEN_MODAL,
    message,
  };
};

export const onboardSMSCloseModal = () => {
  return {
    type: ONBOARD_SMS_CLOSE_MODAL,
  };
};

export const onboardSendSMS = (
  phone,
  goNextScreen = true,
  type = 'createUser',
) => {
  return async dispatch => {
    try {
      dispatch(onboardSetUserStartSendSMS());

      const verificationCode = generateCodeSMS();

      const request = {
        requestCredentials: {
          loginId: API_DIMMER_LOGIN,
          applicationCode: API_DIMMER_APPCODE,
          password: API_DIMMER_PASS,
        },
        code: `Tu código es: ${verificationCode}`,
        phone,
      };

      const {data} = await SMSRepository.sendSMS(request);

      if (data.statusCode === '000') {
        dispatch(onboardSetUserSuccessSendSMS(verificationCode));

        if (goNextScreen)
          NavigationService.navigate('onboardingConfirmNumber', {type});
      } else {
        dispatch(
          onboardSetUserFailSendSMS(
            'No se pudo enviar el mensaje. Verifica el número de teléfono introducido.',
          ),
        );
      }
    } catch (e) {
      dispatch(onboardSetUserFailSendSMS(e.toString()));
    }
  };
};

export const onboardSetIneData = ineData => {
  return {
    type: ONBOARD_SET_INEDATA,
    ineData,
  };
};

export const onboardSetCurpData = curpData => {
  return {
    type: ONBOARD_SET_CURPDATA,
    curpData,
  };
};

export const onboardSetImageDataSelfie = (image, index) => {
  return {
    type: ONBOARD_SET_SELFIE_DATA,
    image,
    index,
  };
};

export const onboardSetActiveImage = index => {
  return {
    type: ONBOARD_SET_ACTIVE_IMAGE,
    index,
  };
};

export const onboardSelfieOpenModal = message => {
  return {
    type: ONBOARD_SELFIE_OPEN_MODAL,
    message,
  };
};

export const onboardSelfieCloseModal = () => {
  return {
    type: ONBOARD_SELFIE_CLOSE_MODAL,
  };
};

export const onboardSelfieStart = () => {
  return {
    type: ONBOARD_SELFIE_START,
  };
};

export const onboardSelfieEnd = () => {
  return {
    type: ONBOARD_SELFIE_END,
  };
};

export const onboardSetAddressData = addressData => {
  return {
    type: ONBOARD_SET_ADDRESS_DATA,
    addressData,
  };
};

export const onboardAddressOpenModal = message => {
  return {
    type: ONBOARD_ADDRESS_OPEN_MODAL,
    message,
  };
};

export const onboardAddressCloseModal = () => {
  return {
    type: ONBOARD_ADDRESS_CLOSE_MODAL,
  };
};

export const onboardSetProvider = provider => {
  return {
    type: ONBOARD_SET_PROVIDER,
    provider,
  };
};

export const onboardSetBeneficiary = beneficiaryData => {
  return {
    type: ONBOARD_SET_BENEFICIARY,
    beneficiaryData,
  };
};

export const onboardBeneficiaryOpenModal = message => {
  return {
    type: ONBOARD_BENEFICIARY_OPEN_MODAL,
    message,
  };
};

export const onboardBeneficiaryCloseModal = () => {
  return {
    type: ONBOARD_BENEFICIARY_CLOSE_MODAL,
  };
};

export const onboardSetDocumentData = (data, coordinates, index) => {
  return {
    type: ONBOARD_SET_DOCUMENT_DATA,
    data,
    coordinates,
    index,
  };
};

export const onboardSetOnPress = (func, index) => {
  return {
    type: ONBOARD_SET_ONPRESS,
    func,
    index,
  };
};

export const onboardSetActiveDocument = index => {
  return {
    type: ONBOARD_SET_ACTIVE_DOCUMENT,
    index,
  };
};

export const onboardSetSignatureData = signatureData => {
  return {
    type: ONBOARD_SET_SIGNATURE,
    signatureData,
  };
};

export const onboardSetPassword = securityData => {
  return {
    type: ONBOARD_SET_PASSWORD,
    securityData,
  };
};

export const onboardPasswordOpenModal = message => {
  return {
    type: ONBOARD_PASSWORD_OPEN_MODAL,
    message,
  };
};

export const onboardPasswordCloseModal = () => {
  return {
    type: ONBOARD_PASSWORD_CLOSE_MODAL,
  };
};

export const onboardPasswordStart = () => {
  return {
    type: ONBOARD_PASSWORD_START,
  };
};

export const onboardPasswordEnd = () => {
  return {
    type: ONBOARD_PASSWORD_END,
  };
};

export const onboardOpenModal = message => {
  return {
    type: ONBOARD_OPEN_MODAL,
    message,
  };
};

export const onboardCloseModal = () => {
  return {
    type: ONBOARD_CLOSE_MODAL,
  };
};

export const onboardStartLoading = () => {
  return {
    type: ONBOARD_START_LOADING,
  };
};

export const onboardEndLoading = () => {
  return {
    type: ONBOARD_END_LOADING,
  };
};

/**
 * @Desc: Inicia el registro del cliente
 * @date 2021-03-23 19:54:08
 * @param {object} userData Objeto con los valores a guardar
 * @param {boolean} initial Indica si es la primera petición o se regresó
 */
export const onboardCreateUser = (userData, initial = true) => {
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());

      const request = {
        phone: userData.phone,
        email: trimStr(userData.email),
        acceptance: userData.acceptance,
        level: levelAccount,
      
      };

      const {data} = await OnboardRepository.RegisterCreateUser(request);

      if (data.statusCode === '000') {

        const request = {
          phone: userData.phone
        };
        const {data} = await OnboardRepository.CreateScore(request);
        // Registro exitoso
        if (data.statusCode === '000') {

        dispatch(onboardEndLoading());
        NavigationService.push('onboardingSelfie');

        }else{
          dispatch(onboardOpenModal(retryError));
        }
      } else if (data.statusCode === '203') {
        // Tiene un registro iniciado que está en proceso
        if (data.details) {
          const onboardingData = getOnboardingData(
            data.details.customer,
            data.details.step,
          );

          dispatch(onboardingSetLastData(onboardingData));
          const step = data.details.step;

          dispatch(onboardEndLoading());
          if (initial) {
            switch (step) {
              case 0:
                NavigationService.navigate('onboardingSelfie');
                break;
              case 1:
                NavigationService.navigate('onboardConfirmCurp');
                break;
              case 2:
                NavigationService.navigate('onboardUseAccount');
                break;
              case 11:
                NavigationService.navigate('onboardResProvider');
              case 10:
                NavigationService.navigate('onboardingBeneficiary');
                break;
              case 3:
                NavigationService.navigate('onboardingCheckAddress');
                break;
              case 4:
                NavigationService.navigate('onboardingSetPassword');
                break;
              default:
                dispatch(onboardOpenModal(retryError));
            }
          } else {
            // Ya avanzó pasos, regresó para corregir/cambiar nivel
            NavigationService.navigate('onboardingSelfie');
          }
        } else {
          dispatch(onboardOpenModal(retryError));
        }
      } else if (data.statusCode === '202' && threeAccountLevel === true) {
        console.log('Se va a buscar al usuario');
        searchUser2(userData.phone);
      } else {
        dispatch(onboardOpenModal(data.messageCode));
      }
    } catch (error) {
      console.log('CATCH ERROR:::', error);
      dispatch(onboardOpenModal(retryError));
    }
  };
};

const searchUser2 = async phone => {
  const {data: userData} = await UserRepository.queryUser({phone});
  if (userData.statusCode === '000'){
    nameRegisterUser = userData.name;
    curpRegisterUser = userData.curp;
    NavigationService.push('onboardingInfoUserUpLevel'); 
  }else {
    console.log('No encontro el numero de telefono');
  };
};

export const searchUserRegister = ({telefono}) => {
  console.log('si hace el request de busqueda');
  console.log(telefono)
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());

      const request = {
        telefono
      };

      const {data} = await UserRepository.queryUser({request});

      if (data.statusCode === '000') {
        // Registro exitoso
        dispatch(onboardEndLoading());
        NavigationService.navigate('onboardingInfoUserUpLevel');
      } else {
        dispatch(onboardOpenModal(data.messageCode));
        console.log('\nREGISTER ACCEPTANCE :: ', data);
      }
    } catch (error) {
      console.log('CATCH ERROR:::', error);
      dispatch(onboardOpenModal(retryError));
    }
  };
};
/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-03-12 18:06:15
 * @Desc: Obtiene el la estructura de datos de Redux State de Onboarding
 *    Mediante información devuelta de API
 */
const getOnboardingData = (customer, step = 0) => {
  let lstBeneficiaries = [];
  if (customer.beneficiary && customer.beneficiary.length > 0) {
    for (var i = 0; i < customer.beneficiary.length; i++) {
      const bname = isNA(customer.beneficiary[i].name);
      const bbday = isNA(customer.beneficiary[i].birthdate);
      const baddr = isNA(customer.beneficiary[i].domicile);
      const bphon = isNA(customer.beneficiary[i].phone);
      const bperc = isNA(customer.beneficiary[i].percent);

      if (bname && baddr && bphon && bperc) {
        lstBeneficiaries.push({
          name: bname,
          birthdate: moment(bbday, 'DD/MM/YYYY'),
          address: baddr,
          phone: bphon,
          percentage: bperc,
        });
      }
    }
  }

  // Si no hay ninguno, se configura uno vacío
  if (lstBeneficiaries.length == 0) {
    lstBeneficiaries.push({
      name: null,
      birthdate: null,
      address: null,
      phone: null,
      percentage: '100',
    });
  }

  const onboarding = {
    userData: {
      // level: isNA(customer.level),
      email: isNA(customer.email),
      phone: isNA(customer.phone),
      name: isNA(customer.name),
      paternal: isNA(customer.paternal),
      maternal: isNA(customer.maternal),
      gender: isNA(customer.gender),
      occupation: isNA(customer.occupation),
      birthdate: isNA(customer.birthdate),
      birthEntity: isNA(customer.birthEntity),
      birthCountry: isNA(customer.birthCountry),
      nationality: isNA(customer.nationality),
      fullName: `${isNA(customer.name)} ${isNA(customer.paternal)} ${isNA(
        customer.maternal,
      )}`.trim(),
      curp: isNA(customer.curp),
      rfc: isNA(customer.rfc),
      esignature: isNA(customer.eSignature),
      cameraUseAccepted: isNA(customer.cameraUseAccepted),
      manifest: step > 1,
      customerCode: isNA(customer.customerCode),
      accountNumber: isNA(customer.accountNumber),
    },
    ineData: {
      verifierCodeIdentifier: isNA(customer.verifierCodeIdentifier),
    },
    curpData: {
      verifierCodeCurp: customer.verifierCodeCurp,
    },
    rfcData: {
      verifierCodeRfc: customer.verifierCodeRfc,
    },
    ineSelfieData: {
      items: [
        {
          data: isNA(customer.imageSelfie),
        },
        {
          data: isNA(customer.imageIdFront),
        },
        {
          data: isNA(customer.imageIdBack),
        },
        {
          data: isNA(customer.imageProofAddress),
        },
      ],
    },
    addressData: {
      cp: isNA(customer.cp),
      country: isNA(customer.country),
      federalEntity: isNA(customer.entity),
      city: isNA(customer.city),
      municipality: isNA(customer.municipality),
      suburb: isNA(customer.colony),
      street: isNA(customer.street),
      externalNumber: isNA(customer.externalNumber),
      internalNumber: isNA(customer.internalNumber),
      fullAddress: null,
      ...(!isNullorNA(customer.latitude) && {latitude: customer.latitude}),
      ...(!isNullorNA(customer.longitude) && {longitude: customer.longitude}),
    },
    providerData: {
      resourceProvider: customer.resourceProvider === '1' ? '1' : '0',
    },
    benefetics: {
      items: lstBeneficiaries,
    },
    termsConditions: {
      items: [
        {
          data: null,
        },
        {
          data: null,
        },
        {
          data: customer.acceptance == '1' ? 'OK' : null,
        },
      ],
    },
    signatureData: {
      data: isNA(customer.imageSignature),
    },
  };

  return onboarding;
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-03-19 12:09:08
 * @Desc: Valida si el valor devuelto es la cadena N/A, devuelve nulo
 */
const isNA = value => {
  if (value == null) return null;
  else {
    if (value == 'N/A') return null;
    else return value;
  }
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-04-03 12:12:13
 * @Desc: Valida si es nulo, si lenght = 0 o si es 'N/A'
 */
const isNullorNA = value => {
  if (value == null) return true;
  if (value == 'N/A') return true;
  if (value.trim().length === 0) return true;

  return false;
};

export const onboardingSetLastData = onboardingData => {
  return {
    type: ONBOARD_SET_LASTDATA,
    onboardingData,
  };
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-03-17 11:08:48
 * @Desc:  Registra información del cliente: Nombres y fotos
 */
export const onboardRegisterSelfie = (userPhone, ineData, imageItems, rfc) => {
  const retryError =
    'No se pudo procesar las imágenes, intenta de nuevo en unos minutos.';
  return async dispatch => {
    try {
      dispatch(onboardSelfieStart());

      if (threeAccountLevel) {
        let bodyUpdate = {
          phoneUser: userPhone,
          imageIdFront: imageItems[1].data,
          imageIdBack: imageItems[2].data,
          imageSelfie: imageItems[0].data,
          imageProofAddress: imageItems[3].data,
        };
        if (rfc) {
          bodyUpdate.rfc = rfc;
        }
        const dataUpdate = await OnboardRepository.UpdateLevelNto3(bodyUpdate);
        if (dataUpdate.statusCode !== '000') {
          dispatch(onboardSelfieEnd());
          NavigationService.navigate('onboardingLegalList');
          //NavigationService.navigate('onboardingContractSignScreen');
        } else {
          dispatch(onboardSelfieOpenModal(data.dataUpdate));
        }
      } else {
        let request = {
          phone: userPhone,
          imageIdFront: imageItems[1].data,
          imageIdBack: imageItems[2].data,
          imageSelfie: imageItems[0].data,
          imageProofAddress: imageItems[3].data ?? imageItems[1].data,
          cameraUseAccepted: '1',
          identifier: {
            ocr: trimStr(ineData.ocr),
            keyVoter: trimStr(ineData.keyVoter),
            issueNumber: trimStr(ineData.issueNumber),
          },
        };

        if (rfc) {
          request.rfc = rfc;
        }
        const {data} = await OnboardRepository.RegisterSaveImages(request);

        if (data.statusCode === '000') {
          // Registro exitoso
          const _ineData = {
            verifierCodeIdentifier: data.verifierCodeIdentifier,
          };
          dispatch(onboardSetIneData(_ineData));
          dispatch(onboardSelfieEnd());
          NavigationService.navigate('onboardConfirmCurp');
        } else {
          dispatch(onboardSelfieOpenModal(data.messageCode));
          console.log('\nELSE SELFIES ::', data);
        }
      }
    } catch (error) {
      dispatch(onboardSelfieOpenModal(retryError));
      console.log('CATCH ERROR:::', error);
    }
  };
};

//Validacion de CURP
export const onboardValidateCurp = userData => {
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());
      const request = {
        phone: trimStr(telefono),
        curp: trimStr(userData.curp),
        
      };
      console.log(`Este es el numero que se envia${telefono}`)
      const {data} = await OnboardRepository.RegisterValidateCurp(request);

      if (data.statusCode === '000') {
        // Registro exitoso
        dispatch(onboardSetCurpData(data.dataCurp));

        dispatch(onboardEndLoading());
        NavigationService.navigate('onboardingUserInfo');
      } else {
        dispatch(onboardOpenModal(data.messageCode));
      }
    } catch (error) {
      dispatch(onboardOpenModal(retryError));
      console.log('CATCH VALIDATE CURP:::', error);
    }
  };
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-03-17 11:50:37
 * @Desc:  Registra la información de la dirección del cliente
 */
export const onboardRegisterAddress = (
  userData,
  addressData,
  curpData,
  rfcData,
  checking = false,
) => {
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());

      const request = {
        phone: userData.phone,
        name: trimStr(userData.name),
        paternal: trimStr(userData.paternal),
        maternal: trimStr(userData.maternal),
        gender: userData.gender,
        birthdate: userData.birthdate,
        birthEntity: trimStr(userData.birthEntity),
        birthCountry: userData.birthCountry,
        street: trimStr(addressData.street),
        externalNumber: trimStr(addressData.externalNumber),
        internalNumber: isNullorWhitespace(addressData.internalNumber)
          ? 'N/A'
          : addressData.internalNumber.trim(),
        cp: trimStr(addressData.cp),
        colony: trimStr(addressData.suburb),
        city: trimStr(addressData.city),
        municipality: trimStr(addressData.municipality),
        entity: trimStr(addressData.federalEntity),
        curp: trimStr(userData.curp),
        nationality: trimStr(userData.nationality),
        occupation: userData.occupation,
        country: trimStr(addressData.country),
        rfc: isNullorWhitespace(userData.rfc) ? 'N/A' : userData.rfc.trim(),
        eSignature: isNullorWhitespace(userData.esignature)
          ? 'N/A'
          : userData.esignature.trim(),
        verifierCodeCurp: isNullorWhitespace(curpData.verifierCodeCurp)
          ? 'N/A'
          : curpData.verifierCodeCurp,
        verifierCodeRfc: isNullorWhitespace(rfcData.verifierCodeRfc)
          ? 'N/A'
          : rfcData.verifierCodeRfc,
      };

      const {data} = await OnboardRepository.RegisterSaveAddress(request);

      if (data.statusCode === '000') {
        // Registro exitoso
        dispatch(onboardEndLoading());

        if (checking) NavigationService.goBack();
        else NavigationService.navigate('onboardUseAccount');
      } else if (data.statusCode === '400') {
        dispatch(onboardAddressOpenModal(replaceFields(data.messageCode)));
      } else {
        dispatch(onboardAddressOpenModal(data.messageCode));
        console.log('\nELSE ADDRESS ::', data);
      }
    } catch (error) {
      console.log('CATCH ERROR:::', error);
      dispatch(onboardAddressOpenModal(retryError));
    }
  };
};

/**
 * @Desc: Enviar información de Uso de Cuenta
 * @date 2021-01-26 18:58:44
 */
export const onboardRegisterUseAccount = ({
  phone,
  job,
  amount,
  expenditure,
  frequency,
  movements,
}) => {
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());

      const request = {
        phone,
        accountJob: job,
        accountAmount: amount,
        accountExpenditure: expenditure,
        accountFrequency: frequency,
        accountMonthly: movements,
      };

      const {data} = await OnboardRepository.RegisterUseAccount(request);

      if (data.statusCode === '000') {
        // Registro exitoso
        dispatch(onboardEndLoading());

        NavigationService.navigate('onboardResProvider');
      } else if (data.statusCode === '402') {
        dispatch(onboardOpenModal(replaceFields(data.messageCode)));
      } else {
        dispatch(onboardOpenModal(data.messageCode));
      }
    } catch (error) {
      dispatch(onboardOpenModal(retryError));
      console.log('CATCH ERROR:::', error);
    }
  };
};

/**
 * @Desc: Registrar información de quien fondea la cuenta
 * @date 2021-05-28 11:00:00
 */
export const onboardRegisterResProvider = ({
  phone,
  type,
  denomination,
  name,
  paternal,
  maternal,
  birthdate,
  occupation,
  curp,
  nationality,
  rfc,
  taxIdentificationNumber,
  countriesAssignment,
  eSignature,
  cp,
  federalEntity,
  city,
  municipality,
  suburb,
  street,
  externalNumber,
  internalNumber,
}) => {
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());
      const isFisico = type === '1';

      const request = {
        phone,
        type,
        ...(!isFisico && {denomination: trimStr(denomination)}),
        ...(isFisico && {name: trimStr(name)}),
        ...(isFisico && {paternal: trimStr(paternal)}),
        ...(isFisico && {maternal: trimStr(maternal)}),
        ...(isFisico && {birthdate}),
        nationality: trimStr(nationality),
        ...(isFisico && {occupation}),
        ...(isFisico && !isNullorWhitespace(curp) && {curp: curp.trim()}),
        ...(!isNullorWhitespace(rfc) && {rfc: rfc.trim()}),
        taxIdentificationNumber: isNullorWhitespace(taxIdentificationNumber)
          ? 'N/A'
          : taxIdentificationNumber.trim(),
        countriesAssignment: isNullorWhitespace(countriesAssignment)
          ? 'N/A'
          : countriesAssignment.trim(),
        eSignature: isNullorWhitespace(eSignature) ? 'N/A' : eSignature.trim(),
        cp: trimStr(cp),
        entity: trimStr(federalEntity),
        city: trimStr(city),
        municipality: trimStr(municipality),
        colony: trimStr(suburb),
        street: trimStr(street),
        externalNumber: trimStr(externalNumber),
        internalNumber: isNullorWhitespace(internalNumber)
          ? 'N/A'
          : internalNumber.trim(),
      };

      const {data: rpdata} = await OnboardRepository.RegisterResourceProvider(
        request,
      );

      if (rpdata.statusCode === '000') {
        // Registro exitoso
        dispatch(onboardEndLoading());

        NavigationService.navigate('onboardingBeneficiary');
      } else if (rpdata.statusCode === '402') {
        dispatch(onboardOpenModal(replaceFields(rpdata.messageCode)));
      } else {
        dispatch(onboardOpenModal(rpdata.messageCode));
      }
    } catch (err) {
      dispatch(onboardOpenModal(err.toString()));
    }
  };
};

/**
 * @Desc: Reemplaza los nombres de campos modelo a nombres de campo UI
 */
const replaceFields = msgError => {
  let result = '';
  if (isNullorWhitespace(msgError)) return result;

  result =
    'Se encontraron las siguientes inconsistencias:\n' +
    msgError
      .replace(/[\[]+/g, '\n')
      .replace(/[\]]+/g, '')
      .replace('{phone}', 'Teléfono:')
      .replace('{email}', 'Correo electrónico:')
      .replace('{name}', 'Nombre:')
      .replace('{paternal}', 'Apellido paterno:')
      .replace('{maternal}', 'Apellido materno:')
      .replace('{gender}', 'Género:')
      .replace('{birthdate}', 'Fecha nacimiento:')
      .replace('{birthCountry}', 'País de nacimiento:')
      .replace('{birthEntity}', 'Estado de nacimiento:')
      .replace('{country}', 'País:')
      .replace('{entity}', 'Estado:')
      .replace('{city}', 'Ciudad:')
      .replace('{municipality}', 'Municipio:')
      .replace('{colony}', 'Colonia:')
      .replace('{cp}', 'Código Postal:')
      .replace('{street}', 'Calle:')
      .replace('{externalNumber}', 'Número exterior:')
      .replace('{internalNumber}', 'Número interior:')
      .replace('{latitude}', 'Latitud:')
      .replace('{longitude}', 'Longitud:')
      .replace('{curp}', 'CURP:')
      .replace('{nationality}', 'Nacionalidad:')
      .replace('{occupation}', 'Ocupación:')
      .replace('{rfc}', 'RFC:')
      .replace('{eSignature}', 'Firma electrónica avanzada:')
      .replace('{password}', 'Contraseña:')
      .replace('{domicile}', 'Dirección:')
      .replace('{percent}', 'Porcentaje:')
      .replace('{accountJob}', 'Principal fuente de ingresos:')
      .replace('{accountExpenditure}', 'Uso principal dinero:')
      .replace('{accountAmount}', 'Cantidad aproximada a recibir:')
      .replace('{accountFrequency}', 'Frecuencia de uso:')
      .replace('{accountMonthly}', 'Cantidad de movimientos mensuales:')
      .replace('{denomination}', 'Denominación o razón social:')
      .replace('{taxIdentificationNumber}', 'Número identificación fiscal:')
      .replace('{countriesAssignment}', 'País de asignación:')
      .toString();

  return result;
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-03-17 12:46:18
 * @Desc: Registra la información de los beneficarios
 */
export const onboardRegisterBeneficiaries = (userPhone, beneficiaryData) => {
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());

      let lstBenefs = [];
      for (var i = 0; i < beneficiaryData.length; i++) {
        lstBenefs.push({
          name: trimStr(beneficiaryData[i].name),
          birthdate: moment(beneficiaryData[i].birthdate).format('DD/MM/YYYY'),
          domicile: trimStr(beneficiaryData[i].address),
          phone: trimStr(beneficiaryData[i].phone),
          percent: beneficiaryData[i].percentage,
        });
      }

      // Rellenar espacios incompletos
      if (lstBenefs.length < 3) {
        const benDiff = 3 - lstBenefs.length;
        for (var i = 0; i < benDiff; i++) {
          lstBenefs.push({
            name: 'N/A',
            birthdate: moment().format('DD/MM/YYYY'),
            domicile: 'N/A',
            phone: 'N/A',
            percent: 'N/A',
          });
        }
      }

      const request = {
        phone: userPhone,
        beneficiary: lstBenefs,
      };

      const {data} = await OnboardRepository.RegisterSaveBeneficiaries(request);

      if (data.statusCode === '000') {
        // Registro exitoso
        dispatch(onboardEndLoading());
        NavigationService.push('onboardingCheckAddress');
      } else if (data.statusCode === '400') {
        dispatch(onboardBeneficiaryOpenModal(replaceFields(data.messageCode)));
      } else {
        dispatch(onboardBeneficiaryOpenModal(data.messageCode));
        console.log('ELSE BENEFICO::', data);
      }
    } catch (error) {
      console.log('CATCH ERROR::', error);
      dispatch(onboardBeneficiaryOpenModal(retryError));
    }
  };
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-03-17 14:22:47
 * @Desc: Registra la información de aceptación de contrato del cliente
 */
export const onboardRegisterAcceptance = ({phone, latitude, longitude}) => {
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());

      const request = {
        phone,
        manifest: '1',
        latitude,
        longitude,
      };

      const {data} = await OnboardRepository.RegisterSaveAcceptances(request);

      if (data.statusCode === '000') {
        // Registro exitoso
        dispatch(onboardEndLoading());
        NavigationService.navigate('onboardingSetPassword');
      } else {
        dispatch(onboardOpenModal(data.messageCode));
        console.log('\nREGISTER ACCEPTANCE :: ', data);
      }
    } catch (error) {
      console.log('CATCH ERROR:::', error);
      dispatch(onboardOpenModal(retryError));
    }
  };
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-03-17 15:13:20
 * @Desc: Registra la información de firma del cliente
 */
export const onboardRegisterSignature = ({
  userPhone,
  idAsociado,
  items,
  levelOne,
  activateAcc
}) => {
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {

    try {
      if (activateAcc) {
        dispatch(onboardStartLoading());
        OnboardRepository.SendControlDesk({
          idAsociado,
        });

        dispatch(onboardEndLoading());
        NavigationService.navigate('onboardingCongrats', {levelOne});
      } else {
        dispatch(onboardStartLoading());

        let _con = items[0].coordinates;
        _con.fileContent = items[1].data;

        let _econ = items[1].coordinates;
        _econ.fileContent = items[1].data;
        if(threeAccountLevel){
          const request = {
            phone: userPhone,
            signature: JSON.stringify(_con),
            signatureDigital: JSON.stringify(_econ),
            type: '0'
          };
          console.log(request);
          const {data} = await OnboardRepository.ActivateNewAccountLevel3(request);
        }else{
          const request = {
            phone: userPhone,
            signature: JSON.stringify(_con),
            signatureDigital: JSON.stringify(_econ),
            type: '1'
          };
          console.log(request);
          const {data} = await OnboardRepository.ActivateNewAccountLevel3(request);
        }


        if (data.statusCode === '000') {
          // Registro exitoso
          OnboardRepository.SendControlDesk({
            idAsociado,
          });

          dispatch(onboardEndLoading());
          NavigationService.navigate('onboardingCongrats', {levelOne});
        } else {
          dispatch(onboardOpenModal(data.messageCode));
        }
      }
    } catch (error) {
      console.log('CATCH ERROR:::', error);
      dispatch(onboardOpenModal(retryError));
    }
  };
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-03-19 20:48:44
 * @Desc: Registra la información de contraseña y registra en IDMission
 */
export const onboardRegisterAccount = (userData, onboardingData) => {
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {
    try {
      dispatch(onboardPasswordStart());

      const _usr = await searchUser(userData.phone);
      if (_usr.exist === true) {
        dispatch(
          onboardPasswordOpenModal(
            'El número de teléfono ya se encuentra registrado. Inicia sesión o contacta a soporte.',
          ),
        );
        return;
      }

      // --- Registro de Cliente en IDMission ---
      let customerCode = null;
      let accountNumber = null;

      // Si no está en el redux ya
      if (!userData.customerCode || !userData.accountNumber) {
        // Verificar si ya existe
        const _cData = await getCustomerData(userData.phone, userData.email);
        if (_cData.customerCode && _cData.accountNumber) {
          customerCode = _cData.customerCode;
          accountNumber = _cData.accountNumber;
        } else {
          const _cDataAlt = await getCustomerData(
            `52${userData.phone}`,
            userData.email,
          );
          if (_cDataAlt.customerCode && _cDataAlt.accountNumber) {
            customerCode = _cDataAlt.customerCode;
            accountNumber = _cDataAlt.accountNumber;
          }
        }

        if (!customerCode || !accountNumber) {
          // REGISTRAR
          const _rData = await registerCustomerData(
            userData.phone,
            userData.email,
            userData.password,
            onboardingData.userData.fullName,
            userData.selfie,
          );

          if (_rData.statusCode === '000') {
            customerCode = _rData.customerCode;
            accountNumber = _rData.accountNumber;
            
          } else if (_rData.statusCode === '601') {
            // Intentar registro con +52
            const _rDataAlt = await registerCustomerData(
              `52${userData.phone}`,
              userData.email,
              userData.password,
              onboardingData.userData.fullName,
              userData.selfie,
            );

            if (_rDataAlt.statusCode === '000') {
              customerCode = _rDataAlt.customerCode;
              accountNumber = _rDataAlt.accountNumber;
            } else {
              // No se pudo crear usuario en IDMission
              dispatch(onboardPasswordOpenModal(retryError));
              console.log('\nELSE IDM ALT::', _rDataAlt.statusMessage);
              return;
            }
          } else {
            // No se pudo crear usuario en IDMission
            dispatch(onboardPasswordOpenModal(retryError));
            console.log('\nELSE IDM::', _rData.statusMessage);
            return;
          } //-- END STATUS REGISTER == 000
        } // -- END CUSTOMER EXIST

        const userInfo = {
          customerCode: customerCode,
          accountNumber: accountNumber,
        };

        // Actualizar el redux state
        dispatch(onboardingSetUser(userInfo));
      } else {
        customerCode = userData.customerCode;
        accountNumber = userData.accountNumber;
      } // -- CUSTOMERCODE ACCOUNT IN STATE

      //#region REGISTRO FINAL
      const benefetics = onboardingData.benefetics.items;
      let listBeneficiary = [];
      for (var i = 0; i < benefetics.length; i++) {
        listBeneficiary.push({
          name: benefetics[i].name,
          birthdate: moment(benefetics[i].birthdate).format('DD/MM/YYYY'),
          domicile: benefetics[i].address,
          phone: benefetics[i].phone,
          percent: benefetics[i].percentage,
        });
      }

      // Rellenar espacios incompletos
      if (listBeneficiary.length < 3) {
        const benDiff = 3 - listBeneficiary.length;
        for (var i = 0; i < benDiff; i++) {
          listBeneficiary.push({
            name: 'N/A',
            birthdate: moment().format('DD/MM/YYYY'),
            domicile: 'N/A',
            phone: 'N/A',
            percent: 'N/A',
          });
        }
      }

      const _level = onboardingData.userData.level;
      const requestFinal = {
        requestCredentials: {
          loginId: API_DIMMER_REGISTER_LOGIN,
          applicationCode: API_DIMMER_REGISTER_APPCODE,
          password: API_DIMMER_REGISTER_PASS,
        },
        idRol: '10',
        reference: Platform.OS, //TODO: Diferenciar Huawei
        level: _level,
        phone: onboardingData.userData.phone,
        email: onboardingData.userData.email,
        password: userData.password,
        name: onboardingData.userData.name,
        paternal: onboardingData.userData.paternal,
        maternal: onboardingData.userData.maternal,
        gender: onboardingData.userData.gender,
        birthdate: onboardingData.userData.birthdate,
        birthEntity: onboardingData.userData.birthEntity,
        birthCountry: onboardingData.userData.birthCountry,
        nationality: onboardingData.userData.nationality,
        occupation: onboardingData.userData.occupation,
        street: onboardingData.addressData.street,
        externalNumber: onboardingData.addressData.externalNumber,
        internalNumber: isNullorWhitespace(
          onboardingData.addressData.internalNumber,
        )
          ? 'N/A'
          : onboardingData.addressData.internalNumber,
        cp: onboardingData.addressData.cp,
        colony: onboardingData.addressData.suburb,
        municipality: onboardingData.addressData.municipality,
        city: onboardingData.addressData.city,
        entity: onboardingData.addressData.federalEntity,
        country: onboardingData.addressData.country,
        latitude: onboardingData.addressData.latitude,
        longitude: onboardingData.addressData.longitude,
        curp: onboardingData.userData.curp,
        rfc: isNullorWhitespace(onboardingData.userData.rfc)
          ? 'N/A'
          : onboardingData.userData.rfc,
        eSignature: isNullorWhitespace(onboardingData.userData.esignature)
          ? 'N/A'
          : onboardingData.userData.esignature,
        verifierCodeIdentifier: onboardingData.ineData.verifierCodeIdentifier,
        verifierCodeCurp: onboardingData.curpData.verifierCodeCurp,
        verifierCodeRfc: onboardingData.rfcData.verifierCodeRfc,
        acceptance: onboardingData.termsConditions.items[2].data ? '1' : '0',
        manifest: onboardingData.userData.manifest === true ? '1' : '0',
        cameraUseAccepted: onboardingData.userData.cameraUseAccepted,
        accountNumber: accountNumber,
        customerCode: customerCode,
        imageSelfie: onboardingData.ineSelfieData.items[0].data,
        imageIdFront: onboardingData.ineSelfieData.items[1].data,
        imageIdBack: onboardingData.ineSelfieData.items[2].data,
        imageProofAddress:
          onboardingData.ineSelfieData.items[3].data ??
          onboardingData.ineSelfieData.items[1].data,
        resourceProvider: onboardingData.providerData.resourceProvider,
        beneficiary: listBeneficiary,
      };

      const {data: finalData} = await OnboardRepository.RegisterUserFinal(
        requestFinal,
      );

      if (finalData.statusCode === '000') {
        // Registro exitoso
        const {details} = finalData;
        if (!isNullorWhitespace(details.idAsociado))
          dispatch(onboardingSetUser({idAsociado: details.idAsociado}));

        const _phone = onboardingData.userData.phone;

        OnboardRepository.SendControlDesk({
          idAsociado: details.idAsociado,
        });

        const totalScr = await getUserScore(_phone);

        dispatch(onboardPasswordEnd());

        if (totalScr < MIN_SCORE_LEVELONE)
          NavigationService.reset('onboardingLegalList', {
            onboard: true,
          });
        else NavigationService.reset('onboardingLegalList');
      } else if (
        finalData.statusCode === '001' ||
        finalData.statusCode === '002' ||
        finalData.statusCode === '003'
      ) {
        // CORE timeOut / Hit en PLD / No se pudo checar PLD
        OnboardRepository.SendControlDesk({
          idAsociado: details.idAsociado,
        });

        dispatch(onboardPasswordEnd());

        // PLD debe permitir continuar
        NavigationService.reset('onboardingLegalList', {onboard: true});
      } else if (finalData.statusCode === '401') {
        // TODO: NOTIFICAR QUE NO SE PODRÁ REGISTRAR
      } else if (finalData.statusCode === '400') {
        dispatch(
          onboardPasswordOpenModal(replaceFields(finalData.messageCode)),
        );
      } else {
        dispatch(onboardPasswordOpenModal(finalData.messageCode));
      }
      //#endregion
    } catch (error) {
      // Si hubo excepción revisar si el cliente se registró
      const _register = await searchUser(userData.phone);
      if (_register.exist === true) {
        dispatch(onboardPasswordEnd());
        NavigationService.reset('onboardingLegalList', {onboard: true});
      } else {
        dispatch(onboardPasswordOpenModal(retryError));
        console.log('REGISTER CATCH :: ', error);
      }
    }
  };
};

/**
 * @Date: 2020-09-07 16:49:23
 * @Desc: Verifica si el teléfono está registrado en Dimmer
 */
const searchUser = async phone => {
  const {data: userData} = await UserRepository.queryUser({phone});
  if (userData.statusCode === '000')
    return {exist: true, clabe: userData.interbankKey};
  else return {exist: false, clabe: ''};
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-05-09 17:33:52
 * @Desc: Verifica si el cliente existe en IDMission
 * @param {string} phone: Teléfono del cliente
 * @param {bool} email: Correo electrónico del cliente
 */
const getCustomerData = async (phone, email) => {
  let _customerCode = null;
  let _accountNumber = null;

  const {data: customerData} = await UserRepository.getProfileData({
    phone,
    email,
  });

  const resultSearchXML = new xmlParser().parseFromString(customerData);
  const statusSearchDataXml = resultSearchXML
    .getElementsByTagName('Customer_Interface')[0]
    .getElementsByTagName('SearchRS')[0]
    .getElementsByTagName('Status_Data')[0];

  const statusSearchCode = statusSearchDataXml.getElementsByTagName(
    'Status_Code',
  )[0].value;

  if (statusSearchCode === '000') {
    // Cliente existe, obtener datos
    const customerSearchDataXml = resultSearchXML
      .getElementsByTagName('Customer_Interface')[0]
      .getElementsByTagName('SearchRS')[0]
      .getElementsByTagName('Customer_Data')[0];

    _customerCode = customerSearchDataXml.getElementsByTagName(
      'CustomerCode',
    )[0].value;

    for (var i = 0; i < 5; i++) {
      const financialXml = customerSearchDataXml.getElementsByTagName(
        'Financial_Data',
      )[i];

      // Si nulo, ya no existen más cuentas
      if (!financialXml) break;

      // Verificar TYPE
      const accountType = financialXml
        .getElementsByTagName('Other_Account_Data')[0]
        .getElementsByTagName('Account_Type')[0].value;

      if (accountType === 'WALLETS') {
        _accountNumber = financialXml
          .getElementsByTagName('Other_Account_Data')[0]
          .getElementsByTagName('Account_Number')[0].value;

        break;
      }
    }
  }

  return {customerCode: _customerCode, accountNumber: _accountNumber};
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-05-09 17:37:33
 * @Desc: Registra un cliente en IDMission
 * @param {string} phone: Teléfono del cliente
 * @param {bool} email: Correo electrónico del cliente
 * @param {bool} password: Contraseña del cliente
 * @param {bool} name: Nombre completo del cliente
 * @param {bool} imgSelfie: Fotografía del cliente en Base64
 */
const registerCustomerData = async (
  phone,
  email,
  password,
  name,
  imgSelfie,
) => {
  let _customerCode = null;
  let _accountNumber = null;
  let _statusCode = null;
  let _statusMessage = null;

  const {data: registerData} = await OnboardRepository.CreateUser({
    phone,
    email,
    password,
    name,
    imgSelfie,
  });

  const resultXML = new xmlParser().parseFromString(registerData);

  const statusDataXml = resultXML
    .getElementsByTagName('Customer_Interface')[0]
    .getElementsByTagName('CreateRS')[0]
    .getElementsByTagName('Status_Data')[0];

  _statusCode = statusDataXml.getElementsByTagName('Status_Code')[0].value;

  _statusMessage = statusDataXml.getElementsByTagName('Status_Message')[0]
    .value;

  if (_statusCode === '000') {
    const customerDataXml = resultXML
      .getElementsByTagName('Customer_Interface')[0]
      .getElementsByTagName('CreateRS')[0]
      .getElementsByTagName('Customer_Data')[0];

    _customerCode = customerDataXml.getElementsByTagName('CustomerCode')[0]
      .value;

    for (var i = 0; i < 5; i++) {
      const financialXml = customerDataXml.getElementsByTagName(
        'Financial_Data',
      )[i];

      // Si nulo, ya no existen más cuentas
      if (!financialXml) break;

      // Verificar TYPE
      const accountType = financialXml
        .getElementsByTagName('Other_Account_Data')[0]
        .getElementsByTagName('Account_Type')[0].value;

      if (accountType === 'WALLETS') {
        _accountNumber = financialXml
          .getElementsByTagName('Other_Account_Data')[0]
          .getElementsByTagName('Account_Number')[0].value;

        break;
      }
    }
  }

  return {
    customerCode: _customerCode,
    accountNumber: _accountNumber,
    statusCode: _statusCode,
    statusMessage: _statusMessage,
  };
};

/**
 * @Desc: Obtiene el score guardado en el pre-registro
 * @date 2021-04-16 11:41:31
 * @param {String} phone Teléfono del usuario
 */
const getUserScore = async phone => {
  let _result = 0;

  const realm = await getRealm();
  const scoreRepo = RepositoryFactory.getRealm('scoring', realm);
  const score = scoreRepo.getOne({type: 'total'});

  if (score) {
    _result = score.score ?? 0;
  } else {
    const {data} = await OnboardRepository.GetScoring({
      phone,
    });

    if (data.statusCode === '000') {
      _result = data.preScore.total_score_preview ?? 0;
    }
  }

  return _result;
};

export const onboardSetAddress2Data = addressData => {
  return {
    type: ONBOARD_SET_ADDRESS2_DATA,
    addressData,
  };
};

export const onboardSetVideoData = (data, index) => {
  return {
    type: ONBOARD_SET_VIDEO_DATA,
    data,
    index,
  };
};

export const onboardSetVideoActive = index => {
  return {
    type: ONBOARD_SET_VIDEO_ACTIVE,
    index,
  };
};

export const onboardSetVideoOnPress = (onPress, index) => {
  return {
    type: ONBOARD_SET_VIDEO_ONPRESS,
    onPress,
    index,
  };
};

export const onboardValidateRfc = rfc => {
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());

      const {data} = await OnboardRepository.RegisterValidateRfc({
        phone: telefono,
        rfc: trimStr(rfc),
      });
      console.log(`El numero de telefono es ${telefono}`)
      if (data.statusCode === '000') {
        // Registro exitoso
        dispatch(
          onboardSetRfcData({
            typePerson: data.typePerson,
            verifierCodeRfc: data.verifierCodeRfc,
            valid: true,
          }),
        );

        dispatch(onboardEndLoading());
        NavigationService.navigate('onboardCheckNewAddress');
      } else {
        dispatch(onboardOpenModal(data.messageCode));
      }
    } catch (error) {
      dispatch(onboardOpenModal(retryError));
      console.log('CATCH VALIDATE RFC:::', error);
    }
  };
};

export const onboardSetRfcData = rfcData => {
  return {
    type: ONBOARD_SET_RFCDATA,
    rfcData,
  };
};

export const onboardSaveAddressProof = ({
  phone,
  rfc,
  address,
  image64,
  verifierCode,
}) => {
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());

      const request = {
        phone,
        direction: {
          street: trimStr(address.street),
          internalNumber: isNullorWhitespace(address.internalNumber)
            ? 'N/A'
            : address.internalNumber.trim(),
          externalNumber: trimStr(address.externalNumber),
          cp: trimStr(address.cp),
          colony: trimStr(address.suburb),
          municipality: trimStr(address.municipality),
          city: trimStr(address.city),
          entity: trimStr(address.federalEntity),
          country: trimStr(address.country),
          rfc: trimStr(rfc),
          imageProofAddress: image64,
          verifierCodeRfc: verifierCode,
        },
      };

      const {data} = await OnboardRepository.RegisterDomicileProof(request);

      if (data.statusCode === '000') {
        // Registro exitoso
        dispatch(onboardEndLoading());

        NavigationService.navigate('onboardLocation');
      } else if (data.statusCode === '400') {
        dispatch(onboardOpenModal(replaceFields(data.messageCode)));
      } else {
        dispatch(onboardOpenModal(data.messageCode));
      }
    } catch (error) {
      dispatch(onboardOpenModal(retryError));
      console.log('CATCH RFC:::', error);
    }
  };
};

export const onboardSetVideocallData = videocallData => {
  return {
    type: ONBOARD_SET_VIDEOCALL_DATA,
    videocallData,
  };
};

export const onboardSetDomicileData = domicileData => {
  return {
    type: ONBOARD_SET_DOMICILE_DATA,
    domicileData,
  };
};

/**
 * @Desc: Registrar una cita para videollamada
 * @param {Object} user: Información de Onboard del Usuario
 * @param {string} dtStart: Fecha/hora inicio de disponibilidad
 * @param {string} dtEnd: Fecha/Hora fin de disponibilidad
 * @param {string} status: Estatus de la cita 1: Programado 5: Inmediato
 */
export const onboardScheduleVCall = (user, dtStart, dtEnd, status) => {
  const retryError = 'Ocurrió un error inesperado, intenta de nuevo.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());

      const request = {
        phoneUser: user.phone,
        name: trimStr(user.name),
        lastName: `${user.paternal} ${user.maternal ?? ''}`.trim(),
        email: user.email,
        message: user.idAsociado,
        status: status,
        fechaIni: dtStart,
        fechaFin: dtEnd,
      };

      const {data} = await OnboardRepository.ScheduleVideocall(request);

      if (data.statusCode === '000') {
        // Registro exitoso
        dispatch(onboardEndLoading());
        if (status === '1') {
          if (user.level == '1') NavigationService.reset('main');
          else
            NavigationService.reset('onboardVideocallSaved', {schedule: true});
        }
      } else {
        dispatch(onboardOpenModal(data.messageCode));
      }
    } catch (error) {
      dispatch(onboardOpenModal(error.toString()));
      console.log('CATCH ERROR:::', error);
    }
  };
};

export const onboardSaveVideo = ({phone, vidAcceptance}) => {
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());

      // console.log('DIMMER VIDEO REQUEST:::', request);
      const {data} = await OnboardRepository.RegisterUpgradeLevelTwo({
        phone,
        video: vidAcceptance,
      });

      switch (data.statusCode) {
        case '000':
          // Registro exitoso
          dispatch(onboardEndLoading());
          NavigationService.navigate('onboardVideoResult');
          break;
        case '001':
        case '002':
          // Timeout del Middleware o Core
          dispatch(onboardEndLoading());
          NavigationService.navigate('onboardVideoResult', {type: 'pending'});
          break;
        default:
          dispatch(onboardOpenModal(data.messageCode));
      }
    } catch (error) {
      console.log('CATCH ERROR:::', error);
      dispatch(onboardOpenModal(retryError));
    }
  };
};

export const onboardCompleteFile = (
  {
    phone,
    idAsociado,
    email,
    curp,
    rfc,
    name,
    paternal,
    maternal,
    birthdate,
    birthCountry,
    birthEntity,
    gender,
    occupation,
    cp,
    country,
    entity,
    city,
    municipality,
    suburb,
    street,
    externalNumber,
    internalNumber,
    latitude,
    longitude,
    selfie,
    ineFront,
    ineBack,
    domicile,
    video,
    signature,
    benefetics,
    customerTwo,
  },
  optional = false,
  pending = false,
) => {
  const retryError = 'Ocurrió un error inesperado, intente de nuevo más tarde.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());

      const request = {phoneUser: phone};

      // Se agregan valores opcionales (no nulos) al request
      if (!isNullorWhitespace(email)) request['email'] = email.trim();
      if (!isNullorWhitespace(curp)) request['curp'] = curp.trim();
      if (!isNullorWhitespace(rfc)) request['rfc'] = rfc.trim();
      if (!isNullorWhitespace(name)) request['name'] = name.trim();
      if (!isNullorWhitespace(paternal)) request['paternal'] = paternal.trim();
      if (!isNullorWhitespace(maternal)) request['maternal'] = maternal.trim();
      if (!isNullorWhitespace(birthdate)) request['birthdate'] = birthdate;
      if (!isNullorWhitespace(birthCountry))
        request['birthCountry'] = birthCountry;
      if (!isNullorWhitespace(birthEntity))
        request['birthEntity'] = birthEntity.trim();
      if (!isNullorWhitespace(gender)) request['gender'] = gender;
      if (!isNullorWhitespace(occupation)) request['occupation'] = occupation;
      if (!isNullorWhitespace(cp)) request['cp'] = cp.trim();
      if (!isNullorWhitespace(country)) request['country'] = country.trim();
      if (!isNullorWhitespace(entity)) request['entity'] = entity.trim();
      if (!isNullorWhitespace(city)) request['city'] = city.trim();
      if (!isNullorWhitespace(municipality))
        request['municipality'] = municipality.trim();
      if (!isNullorWhitespace(suburb)) request['colony'] = suburb.trim();
      if (!isNullorWhitespace(street)) request['street'] = street.trim();
      if (!isNullorWhitespace(externalNumber))
        request['externalNumber'] = externalNumber.trim();
      if (!isNullorWhitespace(internalNumber))
        request['internalNumber'] = internalNumber.trim();
      if (latitude) request['latitude'] = latitude;
      if (longitude) request['longitude'] = longitude;
      if (!isNullorWhitespace(selfie)) request['imageSelfie'] = selfie;
      if (!isNullorWhitespace(ineFront)) request['imageIdFront'] = ineFront;
      if (!isNullorWhitespace(ineBack)) request['imageIdBack'] = ineBack;
      if (!isNullorWhitespace(domicile))
        request['imageProofAddress'] = domicile;
      // if (!isNullorWhitespace(video)) request['video'] = video;
      if (!isNullorWhitespace(signature)) request['signature'] = signature;

      //#region Beneficiarios
      if (benefetics) {
        let listBeneficiary = [];
        for (var i = 0; i < benefetics.length; i++) {
          listBeneficiary.push({
            name: trimStr(benefetics[i].name),
            birthdate: moment(benefetics[i].birthdate).format('DD/MM/YYYY'),
            domicile: trimStr(benefetics[i].address),
            phone: trimStr(benefetics[i].phone),
            percent: benefetics[i].percentage,
          });
        }

        if (listBeneficiary.length < 3) {
          const benDiff = 3 - listBeneficiary.length;
          for (var i = 0; i < benDiff; i++) {
            listBeneficiary.push({
              name: 'N/A',
              birthdate: moment().format('DD/MM/YYYY'),
              domicile: 'N/A',
              phone: 'N/A',
              percent: 'N/A',
            });
          }
        }

        request['beneficiary'] = listBeneficiary;
      }
      //#endregion

      //#region CustomerTwo
      if (customerTwo) {
        const lvl2 = {};
        if (!isNullorWhitespace(customerTwo.cp))
          lvl2['cp'] = customerTwo.cp.trim();
        if (!isNullorWhitespace(customerTwo.country))
          lvl2['country'] = customerTwo.country.trim();
        if (!isNullorWhitespace(customerTwo.entity))
          lvl2['entity'] = customerTwo.entity.trim();
        if (!isNullorWhitespace(customerTwo.city))
          lvl2['city'] = customerTwo.city.trim();
        if (!isNullorWhitespace(customerTwo.municipality))
          lvl2['municipality'] = customerTwo.municipality.trim();
        if (!isNullorWhitespace(customerTwo.suburb))
          lvl2['colony'] = customerTwo.suburb.trim();
        if (!isNullorWhitespace(customerTwo.street))
          lvl2['street'] = customerTwo.street.trim();
        if (!isNullorWhitespace(customerTwo.externalNumber))
          lvl2['externalNumber'] = customerTwo.externalNumber.trim();
        if (!isNullorWhitespace(customerTwo.internalNumber))
          lvl2['internalNumber'] = customerTwo.internalNumber.trim();

        if (!isNullorWhitespace(customerTwo.imageProofAddress))
          lvl2['imageProofAddress'] = customerTwo.imageProofAddress;
        if (!isNullorWhitespace(customerTwo.rfc))
          lvl2['rfc'] = customerTwo.rfc.trim();
        //TODO: Cuando el Front mande el vídeo
        // if (!isNullorWhitespace(customerTwo.video))
        //   lvl2['video'] = customerTwo.video;
        // if (!isNullorWhitespace(customerTwo.fechaVideo))
        //   lvl2['fechaVideo'] = customerTwo.fechaVideo;
        // if (!isNullorWhitespace(customerTwo.checkSumVideo))
        //   lvl2['checkSumVideo'] = customerTwo.checkSumVideo;

        request['customerTwo'] = lvl2;
      }
      //#endregion /CustomerTwo

      //DEBUG: console.log('\nREQUEST FILE:: ', request);
      const {data} = await OnboardRepository.UpdateFile(request);

      if (data.statusCode === '000') {
        // Registro exitoso
        OnboardRepository.SendControlDesk({
          idAsociado,
        });

        dispatch(onboardEndLoading());

        const {isError, errorForm} = getResultPending(data.customer);
        if (isError) dispatch(onboardOpenModal(errorForm));
        else if (pending)
          NavigationService.reset('onboardVCallWait', {
            pending: true,
          });
        else
          NavigationService.reset('onboardBackLater', {
            optional,
          });
      } else {
        dispatch(onboardOpenModal(data.messageCode));
      }
    } catch (error) {
      console.log('CATCH ERROR:::', error);
      dispatch(onboardOpenModal(retryError));
    }
  };
};

const getResultPending = customer => {
  let isError = false;
  let errorForm = '';

  // Validación de obligatorios
  if (customer.imageSelfie && customer.imageSelfie.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.imageSelfie.message;
  }
  if (customer.imageIdFront && customer.imageIdFront.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.imageIdFront.message;
  }
  if (customer.imageIdBack && customer.imageIdBack.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.imageIdBack.message;
  }
  if (customer.imageProofAddress && customer.imageProofAddress.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.imageProofAddress.message;
  }
  if (customer.video && customer.video.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.video.message;
  }
  if (customer.signature && customer.signature.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.signature.message;
  }
  if (customer.email && customer.email.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.email.message;
  }
  if (customer.curp && customer.curp.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.curp.message;
  }
  if (customer.rfc && customer.rfc.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.rfc.message;
  }
  if (customer.name && customer.name.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.name.message;
  }
  if (customer.paternal && customer.paternal.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.paternal.message;
  }
  if (customer.maternal && customer.maternal.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.maternal.message;
  }
  if (customer.birthdate && customer.birthdate.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.birthdate.message;
  }
  if (customer.birthCountry && customer.birthCountry.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.birthCountry.message;
  }
  if (customer.birthEntity && customer.birthEntity.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.birthEntity.message;
  }
  if (customer.gender && customer.gender.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.gender.message;
  }
  if (customer.occupation && customer.occupation.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.occupation.message;
  }
  if (customer.cp && customer.cp.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.cp.message;
  }
  if (customer.country && customer.country.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.country.message;
  }
  if (customer.entity && customer.entity.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.entity.message;
  }
  if (customer.city && customer.city.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.city.message;
  }
  if (customer.municipality && customer.municipality.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.municipality.message;
  }
  if (customer.colony && customer.colony.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.colony.message;
  }
  if (customer.street && customer.street.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.street.message;
  }
  if (customer.externalNumber && customer.externalNumber.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.externalNumber.message;
  }
  if (customer.internalNumber && customer.internalNumber.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.internalNumber.message;
  }
  if (customer.latitude && customer.latitude.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.latitude.message;
  }
  if (customer.longitude && customer.longitude.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.longitude.message;
  }
  if (customer.beneficiary && customer.beneficiary.status !== 1) {
    isError = true;
    errorForm += '\n- ' + customer.beneficiary.message;
  }

  if (isError && errorForm.length > 0) {
    errorForm = 'Se encontraron las siguientes inconsistencias:\n' + errorForm;
  }

  return {
    isError,
    errorForm,
  };
};

export const updateControlDesk = (onboardData, scoreData, level, pld) => {
  const retryError = 'Ocurrió un error inesperado, intenta de nuevo.';
  return async dispatch => {
    try {
      dispatch(onboardStartLoading());

      const _date = Math.round(new Date() / 1000);
      const _uid = await getUID();

      const {data: mesaData} = await OnboardRepository.updateFileControlDesk(
        _date,
        _uid,
        onboardData,
        scoreData,
        level,
        pld,
      );

      const resultXML = new xmlParser().parseFromString(mesaData);

      const _statusCode = resultXML
        .getElementsByTagName('Status')[0]
        .getElementsByTagName('Status_Code')[0].value;
      const _statusMessage = resultXML
        .getElementsByTagName('Status')[0]
        .getElementsByTagName('Status_Message')[0].value;

      switch (_statusCode) {
        case '000':
          // Registro exitoso
          dispatch(onboardEndLoading());
          NavigationService.navigate('');
          break;
        default:
          dispatch(onboardOpenModal(retryError));
          console.log('\nELSE MESA::', _statusMessage);
      }
    } catch (error) {
      dispatch(onboardOpenModal(retryError));
      console.log('CATCH ERROR:::', error);
    }
  };
};
