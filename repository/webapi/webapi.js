/**
 * @author: Juan de Dios
 * @description: Instacia de Axios para peticiones HTTP  https://github.com/axios/axios#custom-instance-defaults
 */
import axios from 'axios';
import {WEB_API_DIMMER} from '../../utils/env';

const instance = axios.create({
  baseURL: `${WEB_API_DIMMER}`,
});

// Obtiene el token del localstore, si no existe lo setea como null
const TOKEN = null;

// Agrega el prefijo al JWT token obtenido
const BEARER_TOKEN = 'Bearer ' + TOKEN;

// Modifica los headers en todas las peticiones
// Más información: https://github.com/axios/axios#interceptors
instance.interceptors.request.use(config => {
  config.headers.Authorization = BEARER_TOKEN;
  // config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});

// Recupera la respuesta de cualquier petición
// Más información: https://github.com/axios/axios#interceptors
instance.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    return Promise.reject(err);
  },
);

export default instance;
