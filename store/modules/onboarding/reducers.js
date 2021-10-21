import {
  ONBOARD_SET_USER,
  ONBOARD_SET_USER_OPEN_MODAL,
  ONBOARD_SET_USER_CLOSE_MODAL,
  ONBOARD_SET_USER_START_SEND_SMS,
  ONBOARD_SET_USER_SUCCESS_SEND_SMS,
  ONBOARD_SET_USER_FAIL_SEND_SMS,
  ONBOARD_USER_END,
  ONBOARD_USER_START,
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

import NavigationService from 'router/NavigationService';

const initState = {
  userData: {
    email: null,
    acceptance: '1',
    phone: null,
    name: null,
    paternal: null,
    maternal: null,
    gender: null,
    birthdate: null,
    birthEntity: null,
    birthCountry: null,
    nationality: null,
    fullName: null,
    curp: null,
    rfc: null,
    esignature: null,
    occupation: null,
    cameraUseAccepted: null,
    manifest: false,
    customerCode: null,
    accountNumber: null,
    idAsociado: null,
    interbankKey: null,
    level: '3',
    error: null,
    hasError: false,
    loading: false,
    type:'0'
  },
  ineData: {
    name: null,
    paternal: null,
    maternal: null,
    gender: null,
    birthdate: null,
    nationality: null,
    fullName: null,
    curp: null,
    cp: null,
    country: null,
    federalEntity: null,
    city: null,
    line1: null,
    line2: null,
    fullAddress: null,
    ocr: null,
    keyVoter: null,
    issueNumber: null,
    verifierCodeIdentifier: null,
  },
  curpData: {
    birthdate: null,
    name: null,
    maternal: null,
    paternal: null,
    gender: null,
    birthEntity: null,
    birthCountry: null,
    verifierCodeCurp: 'N/A',
    documentCurp: null,
    valid: false,
  },
  rfcData: {
    street: null,
    internalNumber: null,
    externalNumber: null,
    cp: null,
    suburb: null,
    municipality: null,
    city: null,
    entity: null,
    country: null,
    fullAddress: null,
    typePerson: null,
    verifierCodeRfc: 'N/A',
    valid: false,
  },
  sms: {
    code: null,
    error: null,
    hasError: false,
  },
  ineSelfieData: {
    items: [
      {
        onPress: () =>
          NavigationService.navigate('onboardingWarning', {type: 'selfie'}),
        image: require('assets/images/user-selfie-logo.png'),
        disabled: false,
        active: true,
        title: 'Selfie',
        outlineCheck: true,
        checked: false,
        data: null,
      },
      {
        onPress: () =>
          NavigationService.navigate('onboardingWarning', {type: 'frontalINE'}),
        image: require('assets/images/user-id-front.png'),
        disabled: true,
        active: false,
        title: 'Foto frontal INE',
        outlineCheck: true,
        checked: false,
        data: null,
      },
      {
        onPress: () =>
          NavigationService.navigate('onboardingWarning', {type: 'anversoINE'}),
        image: require('assets/images/user-id-back.png'),
        disabled: true,
        active: false,
        title: 'Foto reverso INE',
        outlineCheck: true,
        checked: false,
        data: null,
      },
      {
        onPress: () =>
          NavigationService.navigate('onboardingUpInstructions', {
            type: 'domicile',
          }),
        image: require('assets/icons/read-contract.png'),
        disabled: true,
        active: false,
        title: 'Comprobante de\ndomicilio',
        outlineCheck: true,
        checked: false,
        data: null,
      },
    ],
    loading: false,
    error: null,
    hasError: false,
  },
  addressData: {
    cp: null,
    country: null,
    federalEntity: null,
    city: null,
    municipality: null,
    suburb: null,
    street: null,
    internalNumber: null,
    externalNumber: null,
    fullAddress: null,
    latitude: null,
    longitude: null,
    error: false,
    hasError: false,
  },
  address2Data: {
    cp: null,
    country: null,
    federalEntity: null,
    city: null,
    municipality: null,
    suburb: null,
    street: null,
    externalNumber: null,
    internalNumber: null,
    ocr: false,
  },
  providerData: {
    resourceProvider: '0',
  },
  benefetics: {
    items: [
      {
        name: null,
        birthdate: null,
        address: null,
        phone: null,
        percentage: '100',
        manual: false,
      },
    ],
    error: null,
    hasError: false,
  },
  termsConditions: {
    items: [
      {
        onPress: () => {
          NavigationService.navigate('onboardingSignature', {
            type: 'econtract',
          });
        },
        image: require('assets/icons/captura_gris.png'),
        imageActive: require('assets/icons/captura_azul.png'),
        disabled: false,
        active: true,
        title: 'Capturar Firma',
        outlineCheck: true,
        checked: false,
        data: null,
        coordinates: null,
      },
      {
        onPress: () => {
        },
        image: require('assets/icons/sube_gris.png'),
        imageActive: require('assets/icons/descarga_azul.png'),
        disabled: false,
        active: true,
        title: 'Descargar contrato',
        outlineCheck: true,
        checked: false,
        data: null,
        coordinates: null,
      },
      {
        onPress: () => {
        },
        image: require('assets/icons/sube_gris.png'),
        imageActive: require('assets/icons/sube_azul.png'),
        disabled: false,
        active: true,
        title: 'Subir contrato y cuestionario PLD',
        outlineCheck: true,
        checked: false,
        data: null,
        coordinates: null,
      },
    ],
  },
  signatureData: {
    data: null,
    edata: null,
    error: null,
    hasError: false,
  },
  securityData: {
    password: null,
    error: null,
    hasError: false,
    loading: false,
  },
  videoData: {
    items: [
      {
        onPress: () =>
          NavigationService.navigate('onboardingUpInstructions', {
            type: 'domicile',
          }),
        image: require('assets/images/user-id-front.png'),
        disabled: false,
        active: true,
        title: 'Comprobante de\ndomicilio',
        outlineCheck: true,
        checked: false,
        data: null,
      },
      {
        onPress: () => {},
        image: require('assets/images/user-id-front.png'),
        disabled: true,
        active: false,
        title: 'RFC con homoclave',
        isTextData: true,
        outlineCheck: true,
        checked: false,
        data: null,
      },
      {
        onPress: () =>
          NavigationService.navigate('onboardingUpInstructions', {
            type: 'video',
          }),
        image: require('assets/images/user-video.png'),
        disabled: true,
        active: false,
        title: 'Grabar video',
        outlineCheck: true,
        checked: false,
        data: null,
      },
    ],
  },
  videocallData: {
    fechaInicio: null,
    fechaFin: null,
    status: null,
  },
  domicileData: {
    imageProofAddress: null,
  },
  attempts: {
    selfie: 0,
    curp: 0,
  },
  scores: {
    total: null,
  },
  error: null,
  hasError: false,
  loading: false,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case ONBOARD_SET_USER:
      return {
        ...state,
        userData: {
          ...state.userData,
          ...action.user,
        },
      };
    case ONBOARD_SET_USER_OPEN_MODAL:
      return {
        ...state,
        userData: {
          ...state.userData,
          hasError: true,
          error: action.message,
          loading: false,
        },
      };
    case ONBOARD_SET_USER_CLOSE_MODAL:
      return {
        ...state,
        userData: {
          ...state.userData,
          hasError: false,
          error: null,
        },
      };
    case ONBOARD_SET_USER_START_SEND_SMS:
      return {
        ...state,
        userData: {
          ...state.userData,
          hasError: false,
          error: null,
          loading: true,
        },
        sms: {
          ...initState.sms,
        },
      };
    case ONBOARD_SET_USER_SUCCESS_SEND_SMS:
      return {
        ...state,
        userData: {
          ...state.userData,
          hasError: false,
          error: null,
          loading: false,
        },
        sms: {
          ...state.sms,
          code: action.code,
        },
      };
    case ONBOARD_SET_USER_FAIL_SEND_SMS:
      return {
        ...state,
        userData: {
          ...state.userData,
          hasError: true,
          error: action.message,
          loading: false,
        },
        sms: {
          ...initState.sms,
        },
      };
    case ONBOARD_USER_START:
      return {
        ...state,
        userData: {
          ...state.userData,
          hasError: false,
          error: null,
          loading: true,
        },
      };
    case ONBOARD_USER_END:
      return {
        ...state,
        userData: {
          ...state.userData,
          loading: false,
        },
      };
    case ONBOARD_SMS_CLOSE_MODAL:
      return {
        ...state,
        sms: {
          ...state.sms,
          error: null,
          hasError: false,
        },
      };
    case ONBOARD_SMS_OPEN_MODAL:
      return {
        ...state,
        sms: {
          ...state.sms,
          error: action.message,
          hasError: true,
        },
        loading: false,
      };
    case ONBOARD_SET_INEDATA:
      return {
        ...state,
        ineData: {
          ...state.ineData,
          ...action.ineData,
        },
      };
    case ONBOARD_SET_CURPDATA:
      return {
        ...state,
        curpData: {
          ...state.curpData,
          ...action.curpData,
        },
      };
    case ONBOARD_SET_SELFIE_DATA:
      return setSelfieData(state, action.image, action.index);
    case ONBOARD_SET_ACTIVE_IMAGE:
      return setActiveImage(state, action.index);
    case ONBOARD_SELFIE_OPEN_MODAL:
      return {
        ...state,
        ineSelfieData: {
          ...state.ineSelfieData,
          loading: false,
          hasError: true,
          error: action.message,
        },
      };
    case ONBOARD_SELFIE_CLOSE_MODAL:
      return {
        ...state,
        ineSelfieData: {
          ...state.ineSelfieData,
          hasError: false,
          error: null,
        },
      };
    case ONBOARD_SELFIE_START:
      return {
        ...state,
        ineSelfieData: {
          ...state.ineSelfieData,
          hasError: false,
          error: null,
          loading: true,
        },
      };
    case ONBOARD_SELFIE_END:
      return {
        ...state,
        ineSelfieData: {
          ...state.ineSelfieData,
          loading: false,
        },
      };
    case ONBOARD_SET_ADDRESS_DATA:
      return {
        ...state,
        addressData: {
          ...state.addressData,
          ...action.addressData,
        },
      };
    case ONBOARD_ADDRESS_OPEN_MODAL:
      return {
        ...state,
        addressData: {
          ...state.addressData,
          hasError: true,
          error: action.message,
        },
        loading: false,
      };
    case ONBOARD_ADDRESS_CLOSE_MODAL:
      return {
        ...state,
        addressData: {
          ...state.addressData,
          hasError: false,
          error: null,
        },
      };
    case ONBOARD_SET_PROVIDER:
      return {
        ...state,
        providerData: {
          ...state.providerData,
          ...action.provider,
        },
      };
    case ONBOARD_SET_BENEFICIARY:
      return {
        ...state,
        benefetics: {...state.benefetics, items: action.beneficiaryData},
      };
    case ONBOARD_BENEFICIARY_OPEN_MODAL:
      return {
        ...state,
        benefetics: {
          ...state.benefetics,
          hasError: true,
          error: action.message,
        },
        loading: false,
      };
    case ONBOARD_BENEFICIARY_CLOSE_MODAL:
      return {
        ...state,
        benefetics: {
          ...state.benefetics,
          hasError: false,
          error: null,
        },
      };
    case ONBOARD_SET_DOCUMENT_DATA:
      return setDocumentData(
        state,
        action.data,
        action.coordinates,
        action.index,
      );
    case ONBOARD_SET_ONPRESS:
      return setPressFunction(
        state,
        action.func,
        action.index
      )
    case ONBOARD_SET_ACTIVE_DOCUMENT:
      return setActiveDocument(state, action.index);
    case ONBOARD_SET_SIGNATURE:
      return {
        ...state,
        signatureData: {
          ...state.signatureData,
          data: action.signatureData,
        },
      };
    case ONBOARD_SET_PASSWORD:
      return {
        ...state,
        securityData: {
          ...state.securityData,
          ...action.securityData,
        },
      };
    case ONBOARD_PASSWORD_OPEN_MODAL:
      return {
        ...state,
        securityData: {
          ...state.securityData,
          loading: false,
          hasError: true,
          error: action.message,
        },
      };
    case ONBOARD_PASSWORD_CLOSE_MODAL:
      return {
        ...state,
        securityData: {
          ...state.securityData,
          hasError: false,
          error: null,
        },
      };
    case ONBOARD_PASSWORD_START:
      return {
        ...state,
        securityData: {
          ...state.securityData,
          hasError: false,
          error: null,
          loading: true,
        },
      };
    case ONBOARD_PASSWORD_END:
      return {
        ...state,
        securityData: {
          ...state.securityData,
          loading: false,
        },
      };
    case ONBOARD_OPEN_MODAL:
      return {
        ...state,
        hasError: true,
        error: action.message,
        loading: false,
      };
    case ONBOARD_CLOSE_MODAL:
      return {
        ...state,
        hasError: false,
        error: null,
      };
    case ONBOARD_START_LOADING:
      return {
        ...state,
        loading: true,
        hasError: false,
        error: null,
      };
    case ONBOARD_END_LOADING:
      return {
        ...state,
        loading: false,
      };
    case ONBOARD_SET_LASTDATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          ...action.onboardingData.userData,
        },
        ineData: {
          ...state.ineData,
          ...action.onboardingData.ineData,
        },
        curpData: {
          ...state.curpData,
          ...action.onboardingData.curpData,
        },
        rfcData: {
          ...state.rfcData,
          ...action.onboardingData.rfcData,
        },
        ineSelfieData: {
          ...state.ineSelfieData,
          items: [
            {
              ...state.ineSelfieData.items[0],
              data: action.onboardingData.ineSelfieData.items[0].data,
            },
            {
              ...state.ineSelfieData.items[1],
              data: action.onboardingData.ineSelfieData.items[1].data,
            },
            {
              ...state.ineSelfieData.items[2],
              data: action.onboardingData.ineSelfieData.items[2].data,
            },
            {
              ...state.ineSelfieData.items[3],
              data: action.onboardingData.ineSelfieData.items[3].data,
            },
          ],
        },
        addressData: {
          ...state.addressData,
          ...action.onboardingData.addressData,
        },
        benefetics: {
          ...state.benefetics,
          items: action.onboardingData.benefetics.items,
        },
        termsConditions: {
          ...state.termsConditions,
          items: [
            {
              ...state.termsConditions.items[0],
              data: action.onboardingData.termsConditions.items[0].data,
            },
            {
              ...state.termsConditions.items[1],
              data: action.onboardingData.termsConditions.items[1].data,
            },
            {
              ...state.termsConditions.items[2],
              data: action.onboardingData.termsConditions.items[2].data,
            },
          ],
        },
        signatureData: {
          ...state.signatureData,
          ...action.onboardingData.signatureData,
        },
        securityData: {
          ...state.securityData,
          ...action.onboardingData.securityData,
        },
      };
    case ONBOARD_SET_ADDRESS2_DATA:
      return {
        ...state,
        address2Data: {
          ...state.address2Data,
          ...action.addressData,
        },
      };
    case ONBOARD_SET_VIDEO_DATA:
      return setVideoData(state, action.data, action.index);
    case ONBOARD_SET_VIDEO_ACTIVE:
      return setVideoActive(state, action.index);
    case ONBOARD_SET_VIDEO_ONPRESS:
      return setVideoOnPress(state, action.onPress, action.index);
    case ONBOARD_SET_VIDEOCALL_DATA:
      return {
        ...state,
        videocallData: {
          ...state.videocallData,
          ...action.videocallData,
        },
      };
    case ONBOARD_SET_DOMICILE_DATA:
      return {
        ...state,
        domicileData: {
          ...state.domicileData,
          ...action.domicileData,
        },
      };
    case ONBOARD_SET_RFCDATA:
      return {
        ...state,
        rfcData: {
          ...state.rfcData,
          ...action.rfcData,
        },
      };
    default:
      return state;
  }
};

const setSelfieData = (state, image, index) => {
  let copyItems = [...state.ineSelfieData.items];

  copyItems[index].data = image;
  copyItems[index].checked = true;

  return {
    ...state,
    ineSelfieData: {
      ...state.ineSelfieData,
      items: copyItems,
    },
  };
};

const setPressFunction = (state, func, index) => {
  let copyItems = [...state.termsConditions.items];
  copyItems[index].onPress = func;
  return {
    ...state,
    termsConditions: {
      ...state.termsConditions,
      items: copyItems,
    },
  };
};

const setActiveImage = (state, index) => {
  let copyItems = [...state.ineSelfieData.items];

  copyItems[index].disabled = false;
  copyItems[index].active = true;

  return {
    ...state,
    ineSelfieData: {
      ...state.ineSelfieData,
      items: copyItems,
    },
  };
};

const setDocumentData = (state, data, coordinates, index) => {
  let copyItems = [...state.termsConditions.items];

  copyItems[index].data = data;
  copyItems[index].coordinates = coordinates;
  copyItems[index].checked = true;

  return {
    ...state,
    termsConditions: {
      ...state.termsConditions,
      items: copyItems,
    },
  };
};

const setActiveDocument = (state, index) => {
  let copyItems = [...state.termsConditions.items];

  copyItems[index].disabled = false;
  copyItems[index].active = true;

  return {
    ...state,
    termsConditions: {
      ...state.termsConditions,
      items: copyItems,
    },
  };
};

const setVideoData = (state, data, index) => {
  let copyItems = [...state.videoData.items];

  copyItems[index].data = data;
  copyItems[index].checked = true;

  return {
    ...state,
    videoData: {
      ...state.videoData,
      items: copyItems,
    },
  };
};

const setVideoActive = (state, index) => {
  let copyItems = [...state.videoData.items];

  copyItems[index].disabled = false;
  copyItems[index].active = true;

  return {
    ...state,
    videoData: {
      ...state.videoData,
      items: copyItems,
    },
  };
};

const setVideoOnPress = (state, onPress, index) => {
  let copyItems = [...state.videoData.items];
  copyItems[index].onPress = onPress;

  return {
    ...state,
    videoData: {
      ...state.videoData,
      items: copyItems,
    },
  };
};

export default reducer;
