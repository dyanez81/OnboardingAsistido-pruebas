import React from 'react';
import {Text, Platform} from 'react-native';
import CryptoJS from 'crypto-js';
import {KEY_HASH} from 'utils/env';
import moment from 'moment';
import localization from 'moment/locale/es';
import {LocaleConfig} from 'react-native-calendars';
import {getUniqueId, syncUniqueId} from 'react-native-device-info';

export const generateCodeSMS = () => {
  return Math.floor(Math.random() * 90000) + 10000;
};

export const encrypt = text => {
  return CryptoJS.AES.encrypt(text, KEY_HASH).toString();
};

export const decrypt = encrypted => {
  return CryptoJS.AES.decrypt(encrypted, KEY_HASH).toString(CryptoJS.enc.Utf8);
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-08-14 10:49:07
 * @Desc: Hashing
 */
export const hash = text => {
  return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-03-23 21:59:22
 * @Desc: Convierte un número a cadena con formato de moneda
 */
export const currencyFormat = (
  number,
  decimalPlaces = 2,
  currencySymbol = '$',
) => {
  if (number)
    return (
      currencySymbol +
      number.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    );
  else return '$0.00';
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-03-23 21:58:21
 * @Desc: Obtiene un float de una cadena con formato de moneda
 * @param {string} strAmount Cadena con el importe
 */
export const parseCurrency = strAmount => {
  try {
    return parseFloat(strAmount.replace(/[^\d.]/g, ''));
  } catch {
    return 0;
  }
};

export const capitalize = texto => {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

export const formatNumber = numero => {
  numero = numero.replace(/ /g, '');
  numero = numero.replace(/-/g, '');
  numero = numero.replace('(', '');
  numero = numero.replace(')', '');
  numero = numero.replace('+', '');
  if (numero.length > 10) {
    numero = numero.slice(-10);
  }
  return numero;
};

export const formatStringToDate = text => {
  var myDate = text.split('/');
  return new Date(myDate[2], myDate[1] - 1, myDate[0]);
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-03-27 14:40:43
 * @Desc: Obtiene un objeto fecha a partir de una cadena
 * @param {string} strDate Cadena que se convertirá a DateTime
 * @param {string} format (Opcional) Formato que tiene la cadena de entrada
 */
export const getDate = (strDate, format = 'DD/MM/YYYY') => {
  return moment(strDate, format);
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-03-27 14:37:53
 * @Desc: Obtiene la fecha en cadena en un formato específico
 * @remarks: /MMM/ devuelve el mes corto con un punto (abr. mar.)
 *     mientras que -MMM- no.
 * @param {date} date Fecha de entrada
 * @param {string} format Formato de la cadena de salida
 */
export const getDateString = (date, format = 'D/MMM/YYYY') => {
  return moment(date)
    .locale('es', localization)
    .format(format)
    .replace('.', '');
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-06-03 21:05:59
 * @Desc: Valida una cadena de fecha con el formato proporcionado
 */
export const isValidDate = (strDate, format = 'DD/MM/YYYY') => {
  return moment(strDate, format, true).isValid();
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-04-13 12:21:14
 * @Desc: Traduce los labels del calendario a español
 */
export const setCalendarLang = () => {
  LocaleConfig.locales['es'] = {
    monthNames: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    monthNamesShort: [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ],
    dayNames: [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    today: 'Hoy',
  };
  LocaleConfig.defaultLocale = 'es';
};

/**
 * javascript comment
 * @Desc: Valida si la cadena es vacía o null
 */
export const isNullorEmpty = value => {
  if (typeof value !== 'string') return true;
  if (value == null || value == undefined) return true;
  if (value.length === 0) return true;

  return false;
};

/**
 * javascript comment
 * @Desc: Valida si la cadena es vacía, null o espacios
 */
export const isNullorWhitespace = value => {
  if (isNullorEmpty(value)) return true;
  if (value.trim().length === 0) return true;

  return false;
};

/**
 * @Desc: Valida si la cadena es vacía, null, espacios o "N/A"
 */
export const isNullorNA = value => {
  if (isNullorWhitespace(value)) return true;
  if (value === 'N/A') return true;

  return false;
};

/**
 * @Desc: Realiza un Trim() al texto validando si es null/undefined en cuyo caso devuelve cadena vacía
 */
export const trimStr = text => {
  if (isNullorWhitespace(text)) return '';
  else return text.trim();
};

/**
 * @Desc: Obtiene un Text principal con Text anidados
 * @date 2021-02-16 22:51:08
 * @param {string} text Cadena de texto principal
 * @param {string} find Caracter que rodea al subtexto
 * @param {style} mainStyle Estilo del <Text> principal
 * @param {style} accentStyle Estilo de los <Text> anidados
 */
export const getNestedText = (text, find, mainStyle, accentStyle) => {
  const parts = text.split(find);

  let result = [];
  if (parts.length > 0) {
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 !== 0)
        result.push(
          <Text style={accentStyle} key={`promo${i}`}>
            {parts[i]}
          </Text>,
        );
      else result.push(parts[i]);
    }
  } else {
    result.push[text];
  }

  return <Text style={mainStyle}>{result}</Text>;
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-07-26 17:05:20
 * @Desc: Compara versiones de software. 0: Igual, 1: v1 > v2, -1: v1 < v2
 */
export const versionCompare = (
  v1,
  v2,
  lexicographical = false,
  zeroExtend = true,
) => {
  var v1parts = v1.split('.'),
    v2parts = v2.split('.');

  function isValidPart(x) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) v1parts.push('0');
    while (v2parts.length < v1parts.length) v2parts.push('0');
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  for (var i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }

    if (v1parts[i] == v2parts[i]) {
      continue;
    } else if (v1parts[i] > v2parts[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (v1parts.length != v2parts.length) {
    return -1;
  }

  return 0;
};

export const getUID = async () => {
  let _UID = '';
  if (Platform.OS === 'android') _UID = getUniqueId();
  else _UID = await syncUniqueId();

  if (isNullorWhitespace(_UID)) {
    _UID = Platform.OS;
  }

  return _UID;
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-08-17 15:40:10
 * @Desc: Obtiene el Token del dispositivo basado en el UID del mismo
 */
export const getUIdToken = async () => {
  let _UID = '';
  if (Platform.OS === 'android') _UID = getUniqueId();
  else _UID = await syncUniqueId();

  if (isNullorWhitespace(_UID)) {
    throw 'No se pudo obtener el ID del dispositivo. Intenta más tarde.';
  }

  const _deviceToken = hash(_UID);
  if (isNullorWhitespace(_deviceToken) || _deviceToken.length < 50) {
    throw 'No se pudo generar el token del dispositivo. Intenta más tarde.';
  }

  return _deviceToken;
};
