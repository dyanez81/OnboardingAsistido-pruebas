import {gmapsApiKey, WEB_API_GOOGLEMAPS} from 'utils/env';
import WebApiService from './WebApiService';

const Repository = WebApiService(WEB_API_GOOGLEMAPS);

export default {
  /**
   * @Desc: Busca una dirección en base a un código postal
   * @date 2021-05-06 13:26:08
   */
  getAddressByCP({cp}) {
    return Repository.get(
      `/maps/api/geocode/json?address=${cp}&components=country:MX&key=${gmapsApiKey}`,
    );
  },
  /**
   * @Desc:  Busca una dirección en base a unas coordenadas GPS
   * @date 2021-05-19 17:10:31
   */
  getAddressByGPS({latitude, longitude}) {
    return Repository.get(
      `/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${gmapsApiKey}`,
    );
  },
};
