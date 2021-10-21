import moment from 'moment';
import {isNullorWhitespace} from './methods';

/**
 * Calcula el RFC de una persona física
 * @param {String} name Nombre/s
 * @param {String} paternal Apellido paterno
 * @param {String} maternal Apellido materno
 * @param {String} birthdate Fecha de nacimiento YYMMDD
 * @returns {String} RFC con homoclave
 */
export const calculateRfc = ({name, paternal, maternal, birthdate}) => {
  if (
    isNullorWhitespace(name) ||
    isNullorWhitespace(paternal) ||
    isNullorWhitespace(maternal) ||
    isNullorWhitespace(birthdate) ||
    !moment(birthdate, 'YYMMDD').isValid
  )
    return '';

  //FILTRA ACENTOS
  let ap_pat_f = RFCFiltraAcentos(paternal.toLowerCase());
  let ap_mat_f = RFCFiltraAcentos(maternal.toLowerCase());
  let nombre_f = RFCFiltraAcentos(name.toLowerCase());
  //GUARDA NOMBRE ORIGINAL PARA GENERAR HOMOCLAVE
  let ap_pat_orig = ap_pat_f;
  let ap_mat_orig = ap_mat_f;
  let nombre_orig = nombre_f;
  //ELIMINA PALABRAS SOBRANTES DE LOS NOMBRES
  ap_pat_f = RFCFiltraNombres(ap_pat_f);
  ap_mat_f = RFCFiltraNombres(ap_mat_f);
  nombre_f = RFCFiltraNombres(nombre_f);

  if (ap_pat_f.length > 0 && ap_mat_f.length > 0) {
    if (ap_pat_f.length < 3) {
      rfc = RFCApellidoCorto(ap_pat_f, ap_mat_f, nombre_f);
    } else {
      rfc = RFCArmalo(ap_pat_f, ap_mat_f, nombre_f);
    }
  }

  if (ap_pat_f.length == 0 && ap_mat_f.length > 0) {
    rfc = RFCUnApellido(nombre_f, ap_mat_f);
  }
  if (ap_pat_f.length > 0 && ap_mat_f.length == 0) {
    rfc = RFCUnApellido(nombre_f, ap_pat_f);
  }

  rfc = RFCQuitaProhibidas(rfc);

  rfc =
    rfc.toUpperCase() +
    birthdate +
    homonimia(ap_pat_orig, ap_mat_orig, nombre_orig);

  rfc = RFCDigitoVerificador(rfc);

  return rfc;
};

function RFCDigitoVerificador(rfc) {
  let rfcsuma = [];
  let nv = 0;
  let y = 0;
  for (i = 0; i <= rfc.length; i++) {
    var letra = rfc.substr(i, 1);
    switch (letra) {
      case '0':
        rfcsuma.push('00');
        break;
      case '1':
        rfcsuma.push('01');
        break;
      case '2':
        rfcsuma.push('02');
        break;
      case '3':
        rfcsuma.push('03');
        break;
      case '4':
        rfcsuma.push('04');
        break;
      case '5':
        rfcsuma.push('05');
        break;
      case '6':
        rfcsuma.push('06');
        break;
      case '7':
        rfcsuma.push('07');
        break;
      case '8':
        rfcsuma.push('08');
        break;
      case '9':
        rfcsuma.push('09');
        break;
      case 'A':
        rfcsuma.push('10');
        break;
      case 'B':
        rfcsuma.push('11');
        break;
      case 'C':
        rfcsuma.push('12');
        break;
      case 'D':
        rfcsuma.push('13');
        break;
      case 'E':
        rfcsuma.push('14');
        break;
      case 'F':
        rfcsuma.push('15');
        break;
      case 'G':
        rfcsuma.push('16');
        break;
      case 'H':
        rfcsuma.push('17');
        break;
      case 'I':
        rfcsuma.push('18');
        break;
      case 'J':
        rfcsuma.push('19');
        break;
      case 'K':
        rfcsuma.push('20');
        break;
      case 'L':
        rfcsuma.push('21');
        break;
      case 'M':
        rfcsuma.push('22');
        break;
      case 'N':
        rfcsuma.push('23');
        break;
      case '&':
        rfcsuma.push('24');
        break;
      case 'O':
        rfcsuma.push('25');
        break;
      case 'P':
        rfcsuma.push('26');
        break;
      case 'Q':
        rfcsuma.push('27');
        break;
      case 'R':
        rfcsuma.push('28');
        break;
      case 'S':
        rfcsuma.push('29');
        break;
      case 'T':
        rfcsuma.push('30');
        break;
      case 'U':
        rfcsuma.push('31');
        break;
      case 'V':
        rfcsuma.push('32');
        break;
      case 'W':
        rfcsuma.push('33');
        break;
      case 'X':
        rfcsuma.push('34');
        break;
      case 'Y':
        rfcsuma.push('35');
        break;
      case 'Z':
        rfcsuma.push('36');
        break;
      case ' ':
        rfcsuma.push('37');
        break;
      case 'Ñ':
        rfcsuma.push('38');
        break;
      default:
        rfcsuma.push('00');
    }
  }

  for (i = 13; i > 1; i--) {
    nv = nv + rfcsuma[y] * i;
    y++;
  }
  nv = nv % 11;
  if (nv == 0) {
    rfc = rfc + nv;
  } else if (nv <= 10) {
    nv = 11 - nv;
    if (nv == '10') {
      nv = 'A';
    }
    rfc = rfc + nv;
  } else if (nv == '10') {
    nv = 'A';
    rfc = rfc + nv;
  }
  return rfc;
}

function RFCQuitaProhibidas(rfc) {
  let res;
  rfc = rfc.toUpperCase();
  let strPalabras = 'BUEI*BUEY*CACA*CACO*CAGA*CAGO*CAKA*CAKO*COGE*COJA*';
  strPalabras = strPalabras + 'KOGE*KOJO*KAKA*KULO*MAME*MAMO*MEAR*';
  strPalabras = strPalabras + 'MEAS*MEON*MION*COJE*COJI*COJO*CULO*';
  strPalabras = strPalabras + 'FETO*GUEY*JOTO*KACA*KACO*KAGA*KAGO*';
  strPalabras = strPalabras + 'MOCO*MULA*PEDA*PEDO*PENE*PUTA*PUTO*';
  strPalabras = strPalabras + 'QULO*RATA*RUIN*';

  res = strPalabras.match(rfc);

  if (res != null) {
    rfc = rfc.substr(0, 3) + 'X';
    return rfc;
  } else {
    return rfc;
  }
}

function RFCUnApellido(nombre, apellido) {
  const rfc = apellido.substr(0, 2) + nombre.substr(0, 2);
  return rfc;
}

function RFCArmalo(ap_paterno, ap_materno, nombre) {
  const strVocales = 'aeiou';
  let strPrimeraVocal = '';
  let i = 0;
  let x = 0;
  let y = 0;
  for (i = 1; i <= ap_paterno.length; i++) {
    if (y == 0) {
      for (x = 0; x <= strVocales.length; x++) {
        if (ap_paterno.substr(i, 1) == strVocales.substr(x, 1)) {
          y = 1;
          strPrimeraVocal = ap_paterno.substr(i, 1);
        }
      }
    }
    //break;
  }
  var rfc =
    ap_paterno.substr(0, 1) +
    strPrimeraVocal +
    ap_materno.substr(0, 1) +
    nombre.substr(0, 1);
  return rfc;
}

function RFCApellidoCorto(ap_paterno, ap_materno, nombre) {
  const rfc =
    ap_paterno.substr(0, 1) + ap_materno.substr(0, 1) + nombre.substr(0, 2);
  return rfc;
}

function RFCFiltraNombres(strTexto) {
  let i = 0;
  let strArPalabras = [
    '.',
    ',',
    'de ',
    'del ',
    'la ',
    'los ',
    'las ',
    'y ',
    'mc ',
    'mac ',
    'von ',
    'van ',
  ];
  for (i = 0; i <= strArPalabras.length; i++) {
    strTexto = strTexto.replace(strArPalabras[i], '');
  }

  strArPalabras = ['jose ', 'maria ', 'j ', 'ma '];
  for (i = 0; i <= strArPalabras.length; i++) {
    strTexto = strTexto.replace(strArPalabras[i], '');
  }

  switch (strTexto.substr(0, 2)) {
    case 'ch':
      strTexto = strTexto.replace('ch', 'c');
      break;
    case 'll':
      strTexto = strTexto.replace('ll', 'l');
      break;
  }

  return strTexto;
}

function RFCFiltraAcentos(strTexto) {
  strTexto = strTexto.replace('á', 'a');
  strTexto = strTexto.replace('é', 'e');
  strTexto = strTexto.replace('í', 'i');
  strTexto = strTexto.replace('ó', 'o');
  strTexto = strTexto.replace('ú', 'u');
  return strTexto;
}

function homonimia(ap_paterno, ap_materno, nombre) {
  const nombre_completo =
    ap_paterno.trim() + ' ' + ap_materno.trim() + ' ' + nombre.trim();
  let numero = '0';
  let letra;
  let numero1;
  let numero2;
  let numeroSuma = 0;
  for (i = 0; i <= nombre_completo.length; i++) {
    letra = nombre_completo.substr(i, 1);
    switch (letra) {
      case 'ñ':
        numero = numero + '10';
        break;
      case 'ü':
        numero = numero + '10';
        break;
      case 'a':
        numero = numero + '11';
        break;
      case 'b':
        numero = numero + '12';
        break;
      case 'c':
        numero = numero + '13';
        break;
      case 'd':
        numero = numero + '14';
        break;
      case 'e':
        numero = numero + '15';
        break;
      case 'f':
        numero = numero + '16';
        break;
      case 'g':
        numero = numero + '17';
        break;
      case 'h':
        numero = numero + '18';
        break;
      case 'i':
        numero = numero + '19';
        break;
      case 'j':
        numero = numero + '21';
        break;
      case 'k':
        numero = numero + '22';
        break;
      case 'l':
        numero = numero + '23';
        break;
      case 'm':
        numero = numero + '24';
        break;
      case 'n':
        numero = numero + '25';
        break;
      case 'ñ':
        numero = numero + '40';
        break;
      case 'o':
        numero = numero + '26';
        break;
      case 'p':
        numero = numero + '27';
        break;
      case 'q':
        numero = numero + '28';
        break;
      case 'r':
        numero = numero + '29';
        break;
      case 's':
        numero = numero + '32';
        break;
      case 't':
        numero = numero + '33';
        break;
      case 'u':
        numero = numero + '34';
        break;
      case 'v':
        numero = numero + '35';
        break;
      case 'w':
        numero = numero + '36';
        break;
      case 'x':
        numero = numero + '37';
        break;
      case 'y':
        numero = numero + '38';
        break;
      case 'z':
        numero = numero + '39';
        break;
      case ' ':
        numero = numero + '00';
        break;
    }
  }
  //alert(numero);
  for (i = 0; i <= numero.length + 1; i++) {
    numero1 = numero.substr(i, 2);
    numero2 = numero.substr(i + 1, 1);
    numeroSuma = numeroSuma + numero1 * numero2;
  }
  //alert(numeroSuma);
  var numero3 = numeroSuma % 1000;
  //alert(numero3);
  var numero4 = numero3 / 34;
  var numero5 = numero4.toString().split('.')[0];
  //alert(numero5);
  var numero6 = numero3 % 34;
  //alert(numero6);
  var homonimio = '';
  switch (numero5) {
    case '0':
      homonimio = '1';
      break;
    case '1':
      homonimio = '2';
      break;
    case '2':
      homonimio = '3';
      break;
    case '3':
      homonimio = '4';
      break;
    case '4':
      homonimio = '5';
      break;
    case '5':
      homonimio = '6';
      break;
    case '6':
      homonimio = '7';
      break;
    case '7':
      homonimio = '8';
      break;
    case '8':
      homonimio = '9';
      break;
    case '9':
      homonimio = 'A';
      break;
    case '10':
      homonimio = 'B';
      break;
    case '11':
      homonimio = 'C';
      break;
    case '12':
      homonimio = 'D';
      break;
    case '13':
      homonimio = 'E';
      break;
    case '14':
      homonimio = 'F';
      break;
    case '15':
      homonimio = 'G';
      break;
    case '16':
      homonimio = 'H';
      break;
    case '17':
      homonimio = 'I';
      break;
    case '18':
      homonimio = 'J';
      break;
    case '19':
      homonimio = 'K';
      break;
    case '20':
      homonimio = 'L';
      break;
    case '21':
      homonimio = 'M';
      break;
    case '22':
      homonimio = 'N';
      break;
    case '23':
      homonimio = 'P';
      break;
    case '24':
      homonimio = 'Q';
      break;
    case '25':
      homonimio = 'R';
      break;
    case '26':
      homonimio = 'S';
      break;
    case '27':
      homonimio = 'T';
      break;
    case '28':
      homonimio = 'U';
      break;
    case '29':
      homonimio = 'V';
      break;
    case '30':
      homonimio = 'W';
      break;
    case '31':
      homonimio = 'X';
      break;
    case '32':
      homonimio = 'Y';
      break;
    case '33':
      homonimio = 'Z';
      break;
  }
  switch (numero6.toString()) {
    case '0':
      homonimio = homonimio + '1';
      break;
    case '1':
      homonimio = homonimio + '2';
      break;
    case '2':
      homonimio = homonimio + '3';
      break;
    case '3':
      homonimio = homonimio + '4';
      break;
    case '4':
      homonimio = homonimio + '5';
      break;
    case '5':
      homonimio = homonimio + '6';
      break;
    case '6':
      homonimio = homonimio + '7';
      break;
    case '7':
      homonimio = homonimio + '8';
      break;
    case '8':
      homonimio = homonimio + '9';
      break;
    case '9':
      homonimio = homonimio + 'A';
      break;
    case '10':
      homonimio = homonimio + 'B';
      break;
    case '11':
      homonimio = homonimio + 'C';
      break;
    case '12':
      homonimio = homonimio + 'D';
      break;
    case '13':
      homonimio = homonimio + 'E';
      break;
    case '14':
      homonimio = homonimio + 'F';
      break;
    case '15':
      homonimio = homonimio + 'G';
      break;
    case '16':
      homonimio = homonimio + 'H';
      break;
    case '17':
      homonimio = homonimio + 'I';
      break;
    case '18':
      homonimio = homonimio + 'J';
      break;
    case '19':
      homonimio = homonimio + 'K';
      break;
    case '20':
      homonimio = homonimio + 'L';
      break;
    case '21':
      homonimio = homonimio + 'M';
      break;
    case '22':
      homonimio = homonimio + 'N';
      break;
    case '23':
      homonimio = homonimio + 'P';
      break;
    case '24':
      homonimio = homonimio + 'Q';
      break;
    case '25':
      homonimio = homonimio + 'R';
      break;
    case '26':
      homonimio = homonimio + 'S';
      break;
    case '27':
      homonimio = homonimio + 'T';
      break;
    case '28':
      homonimio = homonimio + 'U';
      break;
    case '29':
      homonimio = homonimio + 'V';
      break;
    case '30':
      homonimio = homonimio + 'W';
      break;
    case '31':
      homonimio = homonimio + 'X';
      break;
    case '32':
      homonimio = homonimio + 'Y';
      break;
    case '33':
      homonimio = homonimio + 'Z';
      break;
  }
  return homonimio;
}
