import {Platform, PermissionsAndroid} from 'react-native';

/**
 * @Desc: Valida permisos de escritura de archivos
 * @date 2021-05-26 12:21:08
 */
export const hasStoragePermission = async () => {
  if (
    Platform.OS === 'ios' ||
    (Platform.OS === 'android' && Platform.Version < 23)
  ) {
    return {
      result: true,
      message: '',
    };
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );

  if (hasPermission)
    return {
      result: true,
      message: '',
    };

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return {
      result: true,
      message: '',
    };
  } else if (status === PermissionsAndroid.RESULTS.DENIED) {
    return {
      result: false,
      message: 'FinsusApp necesita permisos para guardar tu documento.',
    };
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    return {
      result: false,
      message:
        'FinsusApp necesita permisos para guardar tu documento.\n\nPor favor, ajusta los permisos de Almacenamiento en configuraciones.',
    };
  }
};

/**
 * @Desc: Valida permisos de localización
 * @date 2021-05-26 12:16:50
 */
export const hasLocationPermission = async () => {
  if (
    Platform.OS === 'ios' ||
    (Platform.OS === 'android' && Platform.Version < 23)
  ) {
    return {result: true, message: ''};
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission)
    return {
      result: true,
      message: '',
    };

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED)
    return {
      result: true,
      message: '',
    };

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    return {
      result: false,
      message:
        'Por regulación de la CNBV es necesario registrar la ubicación al momento de registrarte.',
    };
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    return {
      result: false,
      message:
        'Por regulación de la CNBV es necesario registrar la ubicación al momento de registrarte.\n\nPor favor, ajusta los permisos de uicación en configuraciones.',
    };
  }
};
