import WebApiService from './WebApiService';
import {WEB_API_MIDDLEWARE} from 'utils/env';

const MiddlewareDimerApp = WebApiService(WEB_API_MIDDLEWARE);
const resource = '/ServiceSms/core';

export default {
  sendSMS(request) {
    return MiddlewareDimerApp.post(`${resource}/Sms/sendSms`, request);
  },
};
