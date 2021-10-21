import axios from 'axios';
import {WEB_API_DIMMER} from 'utils/env';

const WebApiService = (baseURL = WEB_API_DIMMER) => {
  const instance = axios.create({
    baseURL,
  });

  // Obtiene el token del localstore, si no existe lo setea como null
  // const TOKEN = null;

  // Agrega el prefijo al JWT token obtenido
  // const BEARER_TOKEN = 'Bearer ' + TOKEN;

  // Modifica los headers en todas las peticiones
  // Más información: https://github.com/axios/axios#interceptors
  // instance.interceptors.request.use(config => {
  //   config.headers.Authorization = BEARER_TOKEN;
  //   // config.headers['Access-Control-Allow-Origin'] = '*';
  //   return config;
  // });

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

  return instance;
};

export default WebApiService;
