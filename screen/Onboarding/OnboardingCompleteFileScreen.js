/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import validator from 'validator';
import xmlParser from 'react-xml-parser';
import Geolocation from '@react-native-community/geolocation';
import getRealm from 'repository/offline/realm';
import moment from 'moment';
import {RepositoryFactory} from 'repository/RepositoryFactory';
import {
  onboardCloseModal,
  onboardCompleteFile,
  onboardEndLoading,
  onboardOpenModal,
  onboardStartLoading,
} from 'store/actions';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusInputTextMaterial from 'components/base/FinsusInputTextMaterial';
import FinsusTouchableTextMaterial from 'components/base/FinsusTouchableTextMaterial';
import FinsusDropdownMaterial from 'components/base/FinsusDropdownMaterial';
import FinsusDatePicker from 'components/base/FinsusDatePicker';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import OnboardingOption from 'components/ui/screens/onboarding/OnboardingOption';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import FinsusBaseModal from 'components/base/FinsusBaseModal';
import {
  capitalize,
  getDate,
  getDateString,
  getUID,
  isNullorWhitespace,
} from 'utils/methods';
import {isMexico} from 'utils/mapsUtils';
import {hasLocationPermission} from 'utils/permissions';
import {
  CURP_PATTERN,
  MAX_SELFIE_ATTEMPTS,
  RFC_PATTERN,
  GPS_CONFIG,
} from 'utils/env';

import {DARK_GREY_BLUE, SECONDARY_COLOR} from 'utils/colors';
import NavigationService from 'router/NavigationService';

const OnboardRepository = RepositoryFactory.get('onboard');
const UserRepository = RepositoryFactory.get('user');
const OnboardingCompleteFileScreen = ({navigation}) => {
  // Parameters
  const pending = navigation.getParam('pending');
  const optional = navigation.getParam('optional', false);

  // Redux state
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  const userOB = useSelector(state => state.onboarding.userData);
  const phone = useSelector(state => state.auth.usuario.phone);
  const name = useSelector(state => state.auth.usuario.nameUser);
  const curp = useSelector(state => state.auth.usuario.curp);
  const accounts = useSelector(state => state.auth.usuario.accounts);
  const pics = useSelector(state => state.onboarding.ineSelfieData.items);
  const legals = useSelector(state => state.onboarding.termsConditions.items);
  const benefs = useSelector(state => state.onboarding.benefetics.items);
  const domicile = useSelector(state => state.onboarding.domicileData);
  const videocall = useSelector(state => state.onboarding.videocallData);
  const dispatch = useDispatch();

  // Component state
  const [pendientes, setPendientes] = useState({
    ineSelfie: false,
    benefetics: false,
    domicile: false,
    location: false,
    video: false,
    signature: false,
    email: false,
    curp: false,
    rfc: false,
    name: false,
    paternal: false,
    maternal: false,
    birthdate: false,
    birthCountry: false,
    birthEntity: false,
    gender: false,
    occupation: false,
    cp: false,
    country: false,
    entity: false,
    city: false,
    municipality: false,
    suburb: false,
    street: false,
    externalNumber: false,
    internalNumber: false,
    addressLvl2: false,
    domicileLvl2: false,
    rfcLvl2: false,
    videoLvl2: false,
  });
  const [curpSdk, setCurpSdk] = useState('');
  const [form, setForm] = useState({
    latitude: null,
    longitude: null,
    email: null,
    curp: null,
    rfc: null,
    name: null,
    paternal: null,
    maternal: null,
    birthdate: null,
    birthCountry: null,
    birthEntity: null,
    gender: null,
    occupation: null,
    cp: null,
    country: null,
    entity: null,
    city: null,
    municipality: null,
    suburb: null,
    street: null,
    externalNumber: null,
    internalNumber: null,
  });
  const [form2, setForm2] = useState({
    cp: null,
    country: null,
    entity: null,
    city: null,
    municipality: null,
    suburb: null,
    street: null,
    externalNumber: null,
    internalNumber: null,
    rfc: null,
  });
  const [showPicker, setShowPicker] = useState(false);
  const [modals, setModals] = useState({
    location: false,
  });

  // Hooks
  useEffect(() => {
    checkPends();
  }, []);

  const pendRef = useRef();
  const level2Ref = useRef();
  const form1ref = useRef();
  const form2ref = useRef();
  const benefRef = useRef();
  const picsRef = useRef();
  const legalsRef = useRef();
  const curpRef = useRef();
  useEffect(() => {
    pendRef.current = pendientes;
    form1ref.current = form;
    form2ref.current = form2;
    benefRef.current = [...benefs];
    picsRef.current = [...pics];
    legalsRef.current = [...legals];
    curpRef.current = curpSdk;
    level2Ref.current = {
      ...videocall,
      ...domicile,
    };
  }, [
    pendientes,
    form,
    benefs,
    form2,
    domicile,
    videocall,
    pics,
    legals,
    curpSdk,
  ]);

  // Métodos
  const checkPends = () => {
    const _pendings = {};
    if (!pending || pending.length === 0) {
      if (optional == true) navigation.replace('main');
      else navigation.replace('onboardBackLater');
    } else {
      // Setear pendientes
      pending.forEach(item => {
        switch (item.typePending) {
          case 1:
            _pendings['video'] = true;
            break;
          case 2:
          case 6:
          case 7:
          case 8:
            _pendings['ineSelfie'] = true;
            break;
          case 4:
            _pendings['rfc'] = true;
            break;
          case 5:
            _pendings['curp'] = true;
            break;
          case 9:
            _pendings['name'] = true;
            break;
          case 10:
            _pendings['maternal'] = true;
            break;
          case 11:
            _pendings['paternal'] = true;
            break;
          case 13:
            _pendings['domicile'] = true;
            break;
          case 15:
            _pendings['externalNumber'] = true;
            break;
          case 16:
            _pendings['occupation'] = true;
            break;
          case 17:
            _pendings['cp'] = true;
            break;
          case 18:
            _pendings['internalNumber'] = true;
            break;
          case 19:
            _pendings['municipality'] = true;
            break;
          case 20:
            _pendings['entity'] = true;
            break;
          case 21:
            _pendings['country'] = true;
            break;
          case 23:
            _pendings['email'] = true;
            break;
          case 24:
            _pendings['location'] = true;
            editLocation();
            break;
          case 25:
            _pendings['signature'] = true;
            break;
          case 26:
            _pendings['birthCountry'] = true;
            break;
          case 27:
            _pendings['benefetics'] = true;
            break;
          case 28:
            _pendings['suburb'] = true;
            break;
          case 29:
            _pendings['street'] = true;
            break;
          case 30:
            _pendings['birthEntity'] = true;
            break;
          case 31:
            _pendings['datebirth'] = true;
            break;
          case 32:
            _pendings['gender'] = true;
            break;
          case 33:
            _pendings['city'] = true;
            break;
          case 90:
            _pendings['addressLvl2'] = true;
            break;
          case 91:
            _pendings['domicileLvl2'] = true;
            break;
          case 92:
            _pendings['rfcLvl2'] = true;
            break;
          case 93:
            _pendings['videoLvl2'] = true;
        }
      });
    }

    setPendientes({
      ...pendientes,
      ..._pendings,
    });
  };

  const onCaptureFrontId = () => {
    setCurpSdk('');
    navigation.navigate('onboardingWarning', {type: 'frontalINE'});
  };

  const onCaptureBackId = () => {
    setCurpSdk('');
    navigation.navigate('onboardingWarning', {type: 'anversoINE'});
  };

  const onDetectFace = () => {
    setCurpSdk('');
    navigation.navigate('onboardingWarning', {type: 'selfie'});
  };

  const onProcessImageAndMatchFace = async () => {
    try {
      if (isNullorWhitespace(curpRef.current)) {
        getDocumentAddress();
      } else {
        // Ya se tiene el CURP OCR

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
              onboardOpenModal(
                'Ha excedido el máximo número de intentos. Contacte a Soporte.',
              ),
            );
            return;
          }
          attemptModel.count = attemptData.count + 1;
        }
        //#endregion

        if (pendRef.current.curp === false && curpRef.current !== curp) {
          // Se actualiza/registra número de intentos
          if (attemptData) AttemptRepository.update(attemptData, attemptModel);
          else AttemptRepository.create(attemptModel);

          dispatch(
            onboardOpenModal(
              'La CURP de la INE no coincide con la registrada.\nIntenta capturar las fotos de nuevo.',
            ),
          );
          return;
        }

        if (attemptData) realm.write(() => realm.delete(attemptData));

        //Registro
        const updateData = {
          ...form1ref.current,
          phone,
          idAsociado: accounts[0].idAsociado,
          selfie: picsRef.current[0].data,
          ineFront: picsRef.current[1].data,
          ineBack: picsRef.current[2].data,
          ...(pendRef.current.domicile && {
            domicile: picsRef.current[3].data,
          }),
          ...(pendRef.current.benefetics && {
            benefetics: benefRef.current,
          }),
          ...(isCustomerTwo() && {
            customerTwo: {
              ...form2ref.current,
              ...level2Ref.current,
            },
          }),
        };

        // Firma
        if (pendRef.current.signature) {
          let _con = legalsRef.current[0].coordinates;
          _con.fileContent = legalsRef.current[0].data;

          updateData['signature'] = JSON.stringify(_con);
        }

        dispatch(onboardEndLoading());
        dispatch(onboardCompleteFile(updateData, optional, keepWaiting()));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isBenefetics = () => {
    if (!benefs) return false;
    if (benefs === 0) return false;

    const _emptyBens = benefs.filter(
      b => isNullorWhitespace(b.name) || isNullorWhitespace(b.phone),
    );
    if (_emptyBens.length > 0) return false;

    return true;
  };

  const benefeticNull = () => {
    if (!benefRef.current) return true;
    if (benefRef.current.length === 0) return true;

    const _emptyBens = benefRef.current.filter(
      b => isNullorWhitespace(b.name) || isNullorWhitespace(b.phone),
    );
    if (_emptyBens.length > 0) return true;

    return false;
  };

  const onlyVideocall = () => {
    return (
      pending.filter(item => item.typePending !== 93 && item.typePending !== 1)
        .length == 0
    );
  };

  /**
   * @Desc: Indica si después de enviar Pendientes esperará por Videollamada
   * Si el estatus es VIDEOCALL AHORA (PEND)
   * @date 2021-02-10 11:55:24
   */
  const keepWaiting = () => {
    const _vid = pendRef.current.videoLvl2 || pendRef.current.video;
    return _vid && level2Ref.current.status == '7';
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios' ? true : false);
    if (selectedDate) {
      setData('birthdate', getDateString(selectedDate, 'DD/MM/YYYY'));
    }
  };

  const editBenefetics = () => {
    navigation.navigate('onboardingBeneficiary', {
      completeFile: true,
    });
  };

  const editLocation = async () => {
    let _latitude = null;
    let _longitude = null;

    const _permission = await hasLocationPermission();

    // Es obligatorio acceder a la ubicación
    if (!_permission.result) {
      dispatch(onboardOpenModal(_permission.message));
      return;
    }

    dispatch(onboardStartLoading);

    Geolocation.getCurrentPosition(
      position => {
        _latitude = position.coords.latitude;
        _longitude = position.coords.longitude;

        if (!_latitude || !_longitude) {
          dispatch(
            onboardOpenModal(
              'No se pudo obtener la ubicación.  Intenta de nuevo.',
            ),
          );
          return;
        } else if (!isMexico(_latitude, _longitude)) {
          dispatch(
            onboardOpenModal(
              `El registro no puede realizarse desde tu ubicación actual. \n\nLatitud: ${_latitude} \nLongitud: ${_longitude}`,
            ),
          );
          return;
        } else {
          setForm({
            ...form,
            latitude: _latitude,
            longitude: _longitude,
          });
          dispatch(onboardEndLoading());
        }
      },
      error => {
        dispatch(
          onboardOpenModal(
            'No se pudo obtener la ubicación:\n' + error.message,
          ),
        );
      },
      GPS_CONFIG,
    );
  };

  const editDomicileLvl2 = () => {
    navigation.navigate('onboardingUpInstructions', {
      type: 'domicile',
      pendingLvl2: true,
    });
  };

  const editVideoLvl2 = () => {
    navigation.navigate('onboardLocation', {pending: true});
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!phone) {
      isError = true;
      errorForm += ', Teléfono';
    }
    if (!accounts || accounts.length == 0 || !accounts[0].idAsociado) {
      isError = true;
      errorForm += ', ID Asociado';
    }
    if (pendRef.current.ineSelfie && !picsRef.current[0].data) {
      isError = true;
      errorForm += ', Selfie';
    }
    if (pendRef.current.ineSelfie && !picsRef.current[1].data) {
      isError = true;
      errorForm += ', Foto frontal INE';
    }
    if (pendRef.current.ineSelfie && !picsRef.current[2].data) {
      isError = true;
      errorForm += ', Foto reverso INE';
    }
    if (pendRef.current.benefetics && benefeticNull()) {
      isError = true;
      errorForm += ', Beneficiarios';
    }
    if (pendRef.current.domicile && !picsRef.current[3].data) {
      isError = true;
      errorForm += ', Comprobante de domicilio';
    }
    if (pendRef.current.video && !level2Ref.current.status) {
      isError = true;
      errorForm += ', Videollamada';
    }
    if (pendRef.current.signature && !legalsRef.current[0].data) {
      isError = true;
      errorForm += ', Firma de Contrato';
    }
    if (pendRef.current.email && !form1ref.current.email) {
      isError = true;
      errorForm += ', Correo electrónico';
    }
    if (pendRef.current.curp && !form1ref.current.curp) {
      isError = true;
      errorForm += ', CURP';
    }
    if (pendRef.current.rfc && !form1ref.current.rfc) {
      isError = true;
      errorForm += ', RFC con homoclave';
    }
    if (pendRef.current.name && !form1ref.current.name) {
      isError = true;
      errorForm += ', Nombre (s)';
    }
    if (pendRef.current.paternal && !form1ref.current.paternal) {
      isError = true;
      errorForm += ', Apellido paterno';
    }
    if (pendRef.current.maternal && !form1ref.current.maternal) {
      isError = true;
      errorForm += ', Apellido materno';
    }
    if (pendRef.current.birthdate && !form1ref.current.birthdate) {
      isError = true;
      errorForm += ', Fecha de nacimiento';
    }
    if (pendRef.current.birthCountry && !form1ref.current.birthCountry) {
      isError = true;
      errorForm += ', País de nacimiento';
    }
    if (pendRef.current.birthEntity && !form1ref.current.birthEntity) {
      isError = true;
      errorForm += ', Entidad de nacimiento';
    }
    if (pendRef.current.gender && !form1ref.current.gender) {
      isError = true;
      errorForm += ', Género';
    }
    if (pendRef.current.occupation && !form1ref.current.occupation) {
      isError = true;
      errorForm += ', Ocupación';
    }
    if (pendRef.current.cp && !form1ref.current.cp) {
      isError = true;
      errorForm += ', Código postal';
    }
    if (pendRef.current.country && !form1ref.current.country) {
      isError = true;
      errorForm += ', País';
    }
    if (pendRef.current.entity && !form1ref.current.entity) {
      isError = true;
      errorForm += ', Entidad federativa';
    }
    if (pendRef.current.city && !form1ref.current.city) {
      isError = true;
      errorForm += ', Ciudad';
    }
    if (pendRef.current.municipality && !form1ref.current.municipality) {
      isError = true;
      errorForm += ', Alcaldía o municipio';
    }
    if (pendRef.current.suburb && !form1ref.current.suburb) {
      isError = true;
      errorForm += ', Colonia';
    }
    if (pendRef.current.street && !form1ref.current.street) {
      isError = true;
      errorForm += ', Calle';
    }
    if (pendRef.current.externalNumber && !form1ref.current.externalNumber) {
      isError = true;
      errorForm += ', Número exterior';
    }
    if (pendRef.current.internalNumber && !form1ref.current.internalNumber) {
      isError = true;
      errorForm += ', Número interior';
    }
    /* Inicial campos level 2 */
    if (pendRef.current.addressLvl2 && !form2ref.current.cp) {
      isError = true;
      errorForm += ', Código postal';
    }
    if (pendRef.current.addressLvl2 && !form2ref.current.country) {
      isError = true;
      errorForm += ', País';
    }
    if (pendRef.current.addressLvl2 && !form2ref.current.entity) {
      isError = true;
      errorForm += ', Entidad federativa';
    }
    if (pendRef.current.addressLvl2 && !form2ref.current.city) {
      isError = true;
      errorForm += ', Ciudad';
    }
    if (pendRef.current.addressLvl2 && !form2ref.current.municipality) {
      isError = true;
      errorForm += ', Alcaldía o municipio';
    }
    if (pendRef.current.addressLvl2 && !form2ref.current.suburb) {
      isError = true;
      errorForm += ', Colonia';
    }
    if (pendRef.current.addressLvl2 && !form2ref.current.street) {
      isError = true;
      errorForm += ', Calle';
    }
    if (pendRef.current.addressLvl2 && !form2ref.current.externalNumber) {
      isError = true;
      errorForm += ', Número exterior';
    }
    if (pendRef.current.addressLvl2 && !form2ref.current.internalNumber) {
      isError = true;
      errorForm += ', Número interior';
    }
    if (pendRef.current.domicileLvl2 && !level2Ref.current.imageProofAddress) {
      isError = true;
      errorForm += ', Comprobante de domicilio';
    }
    if (pendRef.current.rfcLvl2 && !form2ref.current.rfc) {
      isError = true;
      errorForm += ', RFC con homoclave';
    }
    if (pendRef.current.videoLvl2 && !level2Ref.current.status) {
      isError = true;
      errorForm += ', Videollamada';
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

    if (pendRef.current.email && !validator.isEmail(form1ref.current.email)) {
      isError = true;
      errorForm += '\n- El correo electrónico no tiene el formato correcto.';
    }
    if (pendRef.current.curp && form1ref.current.curp.length != 18) {
      isError = true;
      errorForm += '\n- CURP debe tener 18 caracteres.';
    } else if (
      pendRef.current.curp &&
      !validator.matches(form1ref.current.curp, CURP_PATTERN)
    ) {
      isError = true;
      errorForm += '\n- El formato del CURP no es válido.';
    }
    if (pendRef.current.rfc && form1ref.current.rfc.length != 13) {
      isError = true;
      errorForm += '\n- RFC debe tener 13 caracteres.';
    } else if (
      pendRef.current.rfc &&
      !validator.matches(form1ref.current.rfc, RFC_PATTERN)
    ) {
      isError = true;
      errorForm += '\n- El formato del RFC no es válido.';
    }
    if (
      pendRef.current.birthdate &&
      getDate(form1ref.current.birthdate).add(18, 'years') > moment()
    ) {
      isError = true;
      errorForm += '\n- La edad mínima es de 18 años.';
    }
    if (
      pendRef.current.cp &&
      !validator.isNumeric(form1ref.current.cp, {
        no_symbols: true,
      })
    ) {
      isError = true;
      errorForm += '\n- Código postal solo debe incluir números.';
    }
    /* Inicia Campos Level 2 */
    if (pendRef.current.rfcLvl2 && form2ref.current.rfc.length != 13) {
      isError = true;
      errorForm += '\n- RFC debe tener 13 caracteres.';
    } else if (
      pendRef.current.rfcLvl2 &&
      !validator.matches(form2ref.current.rfc, RFC_PATTERN)
    ) {
      isError = true;
      errorForm += '\n- El formato del RFC no es válido.';
    }
    if (
      pendRef.current.addressLvl2 &&
      !validator.isNumeric(form2ref.current.cp, {
        no_symbols: true,
      })
    ) {
      isError = true;
      errorForm += '\n- Código postal solo debe incluir números.';
    }

    if (isError && errorForm.length > 0) {
      errorForm =
        'Se encontraron las siguientes inconsistencias:\n' + errorForm;

      return {
        isError,
        errorForm,
      };
    }

    return {
      isError,
      errorForm,
    };
  };

  const getDocumentAddress = useCallback(async () => {
    try {
      dispatch(onboardStartLoading());

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
            onboardOpenModal(
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
        imgSelfie: picsRef.current[0].data,
        imgFrontINE: picsRef.current[1].data,
        imgBackINE: picsRef.current[2].data,
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
            onboardOpenModal(
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
            onboardOpenModal(
              'La fotografía de tu rostro no coincide con la de tu identificación, por favor inténtalo de nuevo. \n\nRecuerda tener buena iluminación, enmarcar tu rostro y enfocar tu INE.',
            ),
          );
          return;
        }

        // CURP (OCR)
        const curpOCR = xmlImageProcessing
          .getElementsByTagName('ID_Image_Processing')[0]
          .getElementsByTagName('IDNumber1')[0].value;

        // Se setea el CURP en el state
        setCurpSdk(curpOCR);

        if (pendRef.current.curp === false && curpOCR !== curp) {
          // Se actualiza/registra número de intentos
          if (attemptData) AttemptRepository.update(attemptData, attemptModel);
          else AttemptRepository.create(attemptModel);

          dispatch(
            onboardOpenModal(
              'La CURP de la INE no coincide con la registrada.\nIntenta capturar las fotos de nuevo.',
            ),
          );
          return;
        }

        if (attemptData) realm.write(() => realm.delete(attemptData));

        //Registro
        const updateData = {
          ...form1ref.current,
          phone,
          idAsociado: accounts[0].idAsociado,
          selfie: picsRef.current[0].data,
          ineFront: picsRef.current[1].data,
          ineBack: picsRef.current[2].data,
          ...(pendRef.current.domicile && {
            domicile: picsRef.current[3].data,
          }),
          ...(pendRef.current.benefetics && {
            benefetics: benefRef.current,
          }),
          ...(isCustomerTwo() && {
            customerTwo: {...form2ref.current, ...level2Ref.current},
          }),
        };

        // Firma
        if (pendRef.current.signature) {
          let _con = legalsRef.current[0].coordinates;
          _con.fileContent = legalsRef.current[0].data;

          updateData['signature'] = JSON.stringify(_con);
        }

        dispatch(onboardEndLoading());
        dispatch(onboardCompleteFile(updateData, optional, keepWaiting()));
      } else {
        // Se actualiza/registra número de intentos
        if (attemptData) AttemptRepository.update(attemptData, attemptModel);
        else AttemptRepository.create(attemptModel);
        // El formulario no se envió correctamente
        dispatch(onboardOpenModal(resultSdk.Status_Message));
      }
    } catch (e) {
      dispatch(onboardOpenModal('Error: ' + e.toString()));
    }
  }, [picsRef.current]);

  const setData = (id, value) => {
    setForm({
      ...form,
      [id]: value,
    });
  };

  const set2Data = (id, value) => {
    setForm2({
      ...form2,
      [id]: value,
    });
  };

  const isCustomerTwo = () => {
    return (
      pendRef.current.addressLvl2 ||
      pendRef.current.domicileLvl2 ||
      pendRef.current.rfcLvl2
      //TODO: Cuando el vídeo lo siuba el Front tomar en cuenta
      // || pendRef.current.videoLvl2
    );
  };

  const onSend = useCallback(async () => {
    dispatch(onboardStartLoading());
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardOpenModal(errorForm));
      return;
    }

    if (
      pendRef.current.location &&
      (!form1ref.current.latitude || !form1ref.current.longitude)
    ) {
      showModal('location', false);
      return;
    }

    try {
      if (pendRef.current.videoLvl2 || pendRef.current.video) {
        const _stat = level2Ref.current.status;
        const _now = moment().format('DD/MM/YYYY HH:mm:ss');
        const requestVC = {
          phoneUser: userOB.phone,
          name: userOB.name,
          lastName: userOB.paternal,
          email: userOB.email,
          message: userOB.idAsociado,
          status: _stat,
          fechaIni: _stat == '6' ? level2Ref.current.fechaInicio : _now,
          fechaFin: _stat == '6' ? level2Ref.current.fechaFin : _now,
        };

        const {data: dataVC} = await OnboardRepository.ScheduleVideocall(
          requestVC,
        );

        if (dataVC.statusCode !== '000') {
          dispatch(onboardOpenModal(dataVC.messageCode));
          return;
        }

        if (onlyVideocall()) {
          dispatch(onboardEndLoading());
          if (_stat === '6')
            NavigationService.reset('onboardBackLater', {optional});
          else if (_stat === '7')
            NavigationService.reset('onboardVCallWait', {
              pending: true,
            });
          return;
        }
      }

      if (pendRef.current.ineSelfie) {
        onProcessImageAndMatchFace();
      } else {
        const updateData = {
          ...form1ref.current,
          phone,
          idAsociado: accounts[0].idAsociado,
          ...(pendRef.current.domicile && {
            domicile: picsRef.current[3].data,
          }),
          ...(pendRef.current.benefetics && {
            benefetics: benefRef.current,
          }),
          ...(isCustomerTwo() && {
            customerTwo: {
              ...form2ref.current,
              ...level2Ref.current,
            },
          }),
        };

        // Firma
        if (pendRef.current.signature) {
          let _con = legalsRef.current[0].coordinates;
          _con.fileContent = legalsRef.current[0].data;

          updateData['signature'] = JSON.stringify(_con);
        }

        dispatch(onboardEndLoading());
        dispatch(onboardCompleteFile(updateData, optional, keepWaiting()));
      }
    } catch (err) {
      dispatch(onboardOpenModal(err.toString()));
    }
  }, []);

  const onLater = () => {
    navigation.replace('main');
  };

  const showModal = (id, show) => {
    setModals({
      ...modals,
      [id]: show,
    });
  };

  const gotoPrivacy = () => {
    navigation.navigate('onboardingReadLegal', {
      type: 'privacy',
      onBoarding: false,
    });
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  return (
    <OnboardingLevelOne
      loading={loading && navigation.isFocused()}
      messageLoading={'Validando información'}
      titleBox={null}
      noHeader={true}
      navigation={navigation}>
      <View style={styles.container}>
        <Text style={[styles.paragraph, styles.firstText]}>
          Hola
          {!isNullorWhitespace(name) &&
            ` ${capitalize(name.trim().split(' ')[0])}`}
          ,
        </Text>
        <Text style={styles.paragraph}>
          En<Text style={styles.emphasis}> FINSUS </Text>nos preocupamos por tu
          seguridad y para
          <Text style={styles.emphasis}> ofrecer mayor protección </Text>
          requerimos nos compartas una actualización de la siguiente información
          y/o documentos.
        </Text>
        <Text style={styles.paragraph}>
          Si tienes alguna duda estamos para servirte en nuestro centro de
          contacto (para mayor información da clic en el botón de ayuda)
        </Text>
        <TouchableHighlight
          underlayColor={'#0001'}
          onPress={() => navigation.navigate('sendDataHelp')}>
          <Text style={[styles.paragraph, styles.link]}>
            ¿Por qué debo enviar esta información?
          </Text>
        </TouchableHighlight>
        <View style={[styles.optionContainer]}>
          {pendientes.ineSelfie && (
            <OnboardingOption
              onPress={onDetectFace}
              image={pics[0].image}
              disabled={false}
              active={true}
              title={pics[0].title}
              checked={pics[0].data}
              outlineCheck={true}
            />
          )}
          {pendientes.ineSelfie && (
            <OnboardingOption
              onPress={onCaptureFrontId}
              image={pics[1].image}
              disabled={false}
              active={true}
              title={pics[1].title}
              checked={pics[1].data}
              outlineCheck={true}
            />
          )}
          {pendientes.ineSelfie && (
            <OnboardingOption
              onPress={onCaptureBackId}
              image={pics[2].image}
              disabled={false}
              active={true}
              title={pics[2].title}
              checked={pics[2].data}
              outlineCheck={true}
            />
          )}
          {pendientes.benefetics && (
            <OnboardingOption
              onPress={editBenefetics}
              image={require('assets/icons/read-terms.png')}
              disabled={false}
              active={true}
              title={'Beneficiarios'}
              checked={isBenefetics()}
              outlineCheck={true}
            />
          )}
          {pendientes.domicile && (
            <OnboardingOption
              onPress={pics[3].onPress}
              image={pics[3].image}
              disabled={false}
              active={true}
              title={pics[3].title}
              checked={pics[3].data}
              outlineCheck={true}
            />
          )}
          {pendientes.signature && (
            <OnboardingOption
              onPress={legals[0].onPress}
              image={legals[0].image}
              disabled={false}
              active={true}
              title={'Firmar Contrato'}
              checked={legals[0].data}
              outlineCheck={true}
            />
          )}
          {pendientes.domicileLvl2 && (
            <OnboardingOption
              onPress={editDomicileLvl2}
              image={pics[3].image}
              disabled={false}
              active={true}
              title={pics[3].title}
              checked={domicile.imageProofAddress}
              outlineCheck={true}
            />
          )}
          {(pendientes.videoLvl2 || pendientes.video) && (
            <OnboardingOption
              onPress={editVideoLvl2}
              image={require('assets/images/user-video.png')}
              disabled={false}
              active={true}
              title={'Videollamada'}
              checked={videocall.status}
              outlineCheck={true}
            />
          )}
        </View>
        {pendientes.email && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Correo electrónico'}
            placeholderTextColor={'gray'}
            keyboardType={'email-address'}
            maxLength={70}
            autoCapitalize={'none'}
            value={form.email}
            onChange={value => setData('email', value)}
          />
        )}
        {pendientes.curp && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'CURP'}
            placeholderTextColor={'gray'}
            maxLength={18}
            autoCapitalize={'characters'}
            value={form.curp}
            onChange={text => setData('curp', text)}
          />
        )}
        {pendientes.rfc && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'RFC con homoclave'}
            placeholderTextColor={'gray'}
            maxLength={13}
            autoCapitalize={'characters'}
            value={form.rfc}
            onChange={text => setData('rfc', text)}
          />
        )}
        {pendientes.name && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Nombre (s)'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form.name}
            onChange={text => setData('name', text)}
          />
        )}
        {pendientes.paternal && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Apellido Paterno'}
            placeholderTextColor={'gray'}
            maxLength={30}
            value={form.paternal}
            onChange={text => setData('paternal', text)}
          />
        )}
        {pendientes.maternal && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Apellido Materno'}
            placeholderTextColor={'gray'}
            maxLength={30}
            value={form.maternal}
            onChange={text => setData('maternal', text)}
          />
        )}
        {pendientes.birthdate && (
          <FinsusTouchableTextMaterial
            showIcon={false}
            textcolor={form.birthdate ? '#acb1c0' : 'gray'}
            placeholder={'Fecha de nacimiento'}
            value={form.birthdate}
            onPress={() => {
              setShowPicker(!showPicker);
            }}
          />
        )}
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
        {pendientes.birthCountry && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'País de nacimiento'}
            placeholderTextColor={'gray'}
            maxLength={40}
            value={form.birthCountry}
            onChange={text => setData('birthCountry', text)}
          />
        )}
        {pendientes.birthEntity && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Entidad de nacimiento'}
            placeholderTextColor={'gray'}
            maxLength={40}
            value={form.birthEntity}
            onChange={text => setData('birthEntity', text)}
          />
        )}
        {pendientes.gender && (
          <FinsusDropdownMaterial
            items={[
              {label: 'Femenino', value: '1'},
              {label: 'Masculino', value: '0'},
            ]}
            value={form.gender}
            placeholder={'Género'}
            onChange={item => setData('gender', item.value)}
            zIndex={3}
          />
        )}
        {pendientes.occupation && (
          <FinsusDropdownMaterial
            items={[
              {label: 'Estudiante', value: '1'},
              {label: 'Independiente', value: '2'},
              {label: 'Empleado privado', value: '3'},
              {label: 'Empleado público', value: '4'},
              {label: 'Hogar/otro', value: '5'},
            ]}
            value={form.occupation}
            placeholder={'Ocupación'}
            onChange={item => setData('occupation', item.value)}
          />
        )}
        {pendientes.cp && (
          <FinsusInputTextMaterial
            maxLength={5}
            keyboardType="numeric"
            showIcon={false}
            placeholder={'Código Postal'}
            placeholderTextColor={'gray'}
            contextMenuHidden={true}
            value={form.cp}
            onChange={text => setData('cp', text)}
          />
        )}
        {pendientes.country && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'País'}
            placeholderTextColor={'gray'}
            maxLength={45}
            value={form.country}
            onChange={text => setData('country', text)}
          />
        )}
        {pendientes.entity && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Entidad Federativa'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form.entity}
            onChange={text => setData('entity', text)}
          />
        )}
        {pendientes.city && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Ciudad'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form.city}
            onChange={text => setData('city', text)}
          />
        )}
        {pendientes.municipality && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Alcaldía o municipio'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form.municipality}
            onChange={text => setData('municipality', text)}
          />
        )}
        {pendientes.suburb && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Colonia'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form.suburb}
            onChange={text => setData('suburb', text)}
          />
        )}
        {pendientes.street && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Calle'}
            placeholderTextColor={'gray'}
            maxLength={150}
            value={form.street}
            onChange={text => setData('street', text)}
          />
        )}
        {pendientes.externalNumber && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Número exterior'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form.externalNumber}
            onChange={text => setData('externalNumber', text)}
          />
        )}
        {pendientes.internalNumber && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Número interior'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form.internalNumber}
            onChange={text => setData('internalNumber', text)}
          />
        )}
        {/** Level 2 **/}
        {pendientes.rfcLvl2 && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'RFC con homoclave'}
            placeholderTextColor={'gray'}
            maxLength={13}
            autoCapitalize={'characters'}
            value={form2.rfc}
            onChange={text => set2Data('rfc', text)}
          />
        )}
        {pendientes.addressLvl2 && (
          <FinsusInputTextMaterial
            maxLength={5}
            keyboardType="numeric"
            showIcon={false}
            placeholder={'Código Postal'}
            placeholderTextColor={'gray'}
            contextMenuHidden={true}
            value={form2.cp}
            onChange={text => set2Data('cp', text)}
          />
        )}
        {pendientes.addressLvl2 && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'País'}
            placeholderTextColor={'gray'}
            maxLength={45}
            value={form2.country}
            onChange={text => set2Data('country', text)}
          />
        )}
        {pendientes.addressLvl2 && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Entidad Federativa'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form2.entity}
            onChange={text => set2Data('entity', text)}
          />
        )}
        {pendientes.addressLvl2 && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Ciudad'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form2.city}
            onChange={text => set2Data('city', text)}
          />
        )}
        {pendientes.addressLvl2 && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Alcaldía o municipio'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form2.municipality}
            onChange={text => set2Data('municipality', text)}
          />
        )}
        {pendientes.addressLvl2 && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Colonia'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form2.suburb}
            onChange={text => set2Data('suburb', text)}
          />
        )}
        {pendientes.addressLvl2 && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Calle'}
            placeholderTextColor={'gray'}
            maxLength={150}
            value={form2.street}
            onChange={text => set2Data('street', text)}
          />
        )}
        {pendientes.addressLvl2 && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Número exterior'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form2.externalNumber}
            onChange={text => set2Data('externalNumber', text)}
          />
        )}
        {pendientes.addressLvl2 && (
          <FinsusInputTextMaterial
            showIcon={false}
            placeholder={'Número interior'}
            placeholderTextColor={'gray'}
            maxLength={80}
            value={form2.internalNumber}
            onChange={text => set2Data('internalNumber', text)}
          />
        )}
        <FinsusButtonSecondary
          text={'Enviar'}
          color={'rgba(0,0,0,0.25)'}
          textColor={'#fff'}
          textSize={13}
          textAlign={'center'}
          onPress={onSend}
          style={{alignSelf: 'center', marginTop: 32}}
        />
        {optional && (
          <TouchableHighlight underlayColor={'#0001'} onPress={onLater}>
            <Text style={[styles.paragraph, styles.link]}>En otro momento</Text>
          </TouchableHighlight>
        )}
        <TouchableHighlight underlayColor={'#0001'} onPress={gotoPrivacy}>
          <Text style={[styles.paragraph, styles.link]}>
            Aviso de Privacidad
          </Text>
        </TouchableHighlight>
      </View>
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}
        text={messageError}
      />
      <FinsusBaseModal
        visible={modals.location && navigation.isFocused()}
        done={() => showModal('location', false)}
        cancelText={'Cancelar'}
        showAccept
        acceptText={'Reintentar'}
        onAccept={editLocation}>
        <Text style={styles.upgradeText}>
          No se ha registrado tu ubicación. Por regulación de la CNBV es
          necesario registrar la ubicación al momento de registrarte.
        </Text>
      </FinsusBaseModal>
    </OnboardingLevelOne>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: DARK_GREY_BLUE,
    zIndex: 2,
    paddingBottom: 28,
  },
  paragraph: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    letterSpacing: 0.15,
    color: 'black',
    textAlign: 'justify',
    marginHorizontal: 30,
    marginVertical: 10,
  },
  emphasis: {
    color: SECONDARY_COLOR,
  },
  firstText: {
    marginTop: 32,
  },
  link: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
  optionContainer: {
    width: '85%',
    marginVertical: 32,
    flexDirection: 'column',
    alignSelf: 'center',
  },
  options: {
    marginBottom: 0,
  },
  button: {
    alignSelf: 'center',
    marginVertical: 24,
  },
});

export default OnboardingCompleteFileScreen;
