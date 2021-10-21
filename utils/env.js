// Servidores APIs
export const WEB_API_DIMMER = 'https://pruebas.dimmerapp.com';
export const WEB_API_DEMO_IDMISSION = 'https://kyc.idmission.com';
export const WEB_API_KYC_IDMISSION = 'https://kyc.idmission.com';
export const WEB_API_MIDDLEWARE = 'https://webapp.dimmerapp.com:8443';
export const WEB_API_AMZN = 'http://18.224.211.219:8080';
export const WEB_API_GOOGLEMAPS = 'https://maps.googleapis.com';

// Credenciales Dimmer (queryService)
export const API_DIMMER_LOGIN = 'CDFMH';
export const API_DIMMER_APPCODE = 'CDF585WEB';
export const API_DIMMER_PASS = 'Fg595@700';

// Credenciales Dimmer (updateCustomer)
export const API_DIMMER_UPDATE_LOGIN = 'D1M3RF1N';
export const API_DIMMER_UPDATE_APPCODE = 'UPD473C057';
export const API_DIMMER_UPDATE_PASS = 'ASqW34@21';

// Credenciales Dimmer (registerUser)
export const API_DIMMER_REGISTER_LOGIN = 'PrueEBOne';
export const API_DIMMER_REGISTER_APPCODE = 'Reg1st0N3L3v3l';
export const API_DIMMER_REGISTER_PASS = 'D3MMC403=43#Only@700';

// Credenciales Dimmer (pre-registerUser)
export const API_DIMMER_PREREGISTER_LOGIN = 'Qu3ry534RCH3';
export const API_DIMMER_PREREGISTER_APPCODE = '937U53r';
export const API_DIMMER_PREREGISTER_PASS = 'C4c40C0n3x10n#23';

// Credenciales de la API de IDMISSION (DEMO)
export const API_IDM_LOGINID = 'ev_integ_52283';
export const API_IDM_APPCODE = 'IDMAXWEB';
export const API_IDM_PASSWORD = 'IDmi#283$';
export const API_IDM_MERCHANTID = '31867';

// Credenciales de la API de IDMISSION (KYC)
export const API_IDM_KYC_LOGINID = 'ev_integ_52283';
export const API_IDM_KYC_APPCODE = 'IDMAXWEB';
export const API_IDM_KYC_PASSWORD = 'IDmi#283$';
export const API_IDM_KYC_MERCHANTID = '31867';

// URLs Documentos
export const DOC_LEGAL_CONTRACT = 'https://links.finsus.app/contratovista.html';
export const DOC_LEGAL_ECONTRACT =
  'https://www.finsus.app/contrato-de-servicios-electronicos/';
export const DOC_LEGAL_PRIVACY =
  'https://links.finsus.app/avisodeprivacidad.html';
export const FAQ = 'https://www.finsus.app/preguntas-frecuentes/';

// URLS Ayuda
export const EMAIL_HELP_URL = 'mailto:soporte@finsus.app';
export const WHATSAPP_HELP_URL =
  'https://api.whatsapp.com/send?phone=5215517251636';

// URLs Otra info
export const UDIS_INFO =
  'https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?sector=8&accion=consultarCuadro&idCuadro=CP150&locale=es';

// Llave de cifrado
export const KEY_HASH = 'rvxF4wvywjEuEVVGlQUO';

// Reglas de contrasena
export const PASSWORD_PATTERN = '^(?=.*?[A-Z])(?=.*?[0-9]).{8}$';
export const PASSWORD_MESSAGE =
  'Para que tu contraseña sea segura, debe contener lo siguiente:\n\n' +
  ' + 8 caracteres.\n + Mínimo una letra mayúscula.\n + Un número como mínimo.';

// Expresiones regulares formato
export const RFC_PATTERN =
  '^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})?$';
export const RFC10_PATTERN =
  '^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))?$';
export const CURP_PATTERN =
  '^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$';

export const VERSION_PATTERN =
  '(0|(?:[1-9]d*))(?:.(0|(?:[1-9]d*))(?:.(0|(?:[1-9]d*)))?(?:-([w][w.-_]*))?)?';

// Números mínimos y máximos
export const MAX_SELFIE_ATTEMPTS = 5;
export const MAX_CURP_ATTEMPTS = 5;
export const MAX_MISTAKES_50PC = 3;
export const MAX_DAYS_VIDEOCALL = 14;
export const MIN_SCORE_LEVELONE = 90;

// Valores UDIs
export const UDIS15_CANT = '3,000';
export const UDIS15_AMOUNT = '$20,300';
export const UDIS20_CANT = '29,000';
export const UDIS20_AMOUNT = '$180,000';

// TimeOut de validez del código SMS en segundos
export const SMS_TIMEOUT = 120;

// Geolocation Config
export const GPS_CONFIG = {
  timeout: 45000,
  maximumAge: 180000,
  distanceFilter: 500,
};

// Catálogo de profesiones
export const occupations = [
  {label: 'Estudiante', value: '1'},
  {label: 'Independiente', value: '2'},
  {label: 'Empleado privado', value: '3'},
  {label: 'Empleado público', value: '4'},
  {label: 'Hogar/otro', value: '5'},
];

// Identificador de México en STP
export const MX_STP = '187';

// Lista de Estados Respública Mexicana
export const STATES_MX = [
  {value: 'AGUASCALIENTES', label: 'AGUASCALIENTES'},
  {value: 'BAJA CALIFORNIA', label: 'BAJA CALIFORNIA'},
  {value: 'BAJA CALIFORNIA SUR', label: 'BAJA CALIFORNIA SUR'},
  {value: 'CAMPECHE', label: 'CAMPECHE'},
  {value: 'CHIAPAS', label: 'CHIAPAS'},
  {value: 'CHIHUAHUA', label: 'CHIHUAHUA'},
  {value: 'CDMX', label: 'CDMX'},
  {value: 'COAHUILA', label: 'COAHUILA'},
  {value: 'COLIMA', label: 'COLIMA'},
  {value: 'DURANGO', label: 'DURANGO'},
  {value: 'GUANAJUATO', label: 'GUANAJUATO'},
  {value: 'GUERRERO', label: 'GUERRERO'},
  {value: 'HIDALGO', label: 'HIDALGO'},
  {value: 'JALISCO', label: 'JALISCO'},
  {value: 'ESTADO DE MEXICO', label: 'ESTADO DE MEXICO'},
  {value: 'MICHOACAN', label: 'MICHOACAN'},
  {value: 'MORELOS', label: 'MORELOS'},
  {value: 'NAYARIT', label: 'NAYARIT'},
  {value: 'NUEVO LEON', label: 'NUEVO LEON'},
  {value: 'OAXACA', label: 'OAXACA'},
  {value: 'PUEBLA', label: 'PUEBLA'},
  {value: 'QUERETARO', label: 'QUERETARO'},
  {value: 'QUINTANA ROO', label: 'QUINTANA ROO'},
  {value: 'SAN LUIS POTOSI', label: 'SAN LUIS POTOSI'},
  {value: 'SINALOA', label: 'SINALOA'},
  {value: 'SONORA', label: 'SONORA'},
  {value: 'TABASCO', label: 'TABASCO'},
  {value: 'TAMAULIPAS', label: 'TAMAULIPAS'},
  {value: 'TLAXCALA', label: 'TLAXCALA'},
  {value: 'VERACRUZ', label: 'VERACRUZ'},
  {value: 'YUCATAN', label: 'YUCATAN'},
  {value: 'ZACATECAS', label: 'ZACATECAS'},
];

// App ID's
export const ANDROID_ID = 'com.finsusapp.msantana.dimmerdevelopment';
export const IOS_ID = '1510473524';
export const IOS_BUNDLE = 'com.financierasustentable.finsus';

// API KEYS
export const gmapsApiKey = 'AIzaSyC7q3I05Lwwsr-zFEwj72Co7IXjIsCEvS8';
