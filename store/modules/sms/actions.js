import {
  SMS_CLOSE_MODAL,
  SMS_FAIL,
  SMS_OPEN_MODAL,
  SMS_START,
  SMS_SUCCESS,
  SMS_FROM_VIEW,
} from './actionTypes';

import {generateCodeSMS} from 'utils/methods';
import {API_DIMMER_LOGIN, API_DIMMER_PASS, API_DIMMER_APPCODE} from 'utils/env';

import {RepositoryFactory} from 'repository/RepositoryFactory';
const SMSRepository = RepositoryFactory.get('sms');

export const smsStart = () => {
  return {
    type: SMS_START,
  };
};

export const smsSuccess = (code, phone) => {
  return {
    type: SMS_SUCCESS,
    code,
    phone,
  };
};

export const smsFail = error => {
  return {
    type: SMS_FAIL,
    error,
  };
};

export const smsOpenModal = error => {
  return {
    type: SMS_OPEN_MODAL,
    error,
  };
};

export const smsCloseModal = () => {
  return {
    type: SMS_CLOSE_MODAL,
  };
};

export const smsSetFromView = fromLogin => {
  return {
    type: SMS_FROM_VIEW,
    fromLogin,
  };
};

export const sendSMS = (phone, onSuccess = () => {}) => {
  return async dispatch => {
    try {
      dispatch(smsStart());

      const verificationCode = generateCodeSMS();

      const request = {
        requestCredentials: {
          loginId: API_DIMMER_LOGIN,
          applicationCode: API_DIMMER_APPCODE,
          password: API_DIMMER_PASS,
        },
        code: `Tu código de recuperación es: ${verificationCode}`,
        phone,
      };

      const {data} = await SMSRepository.sendSMS(request);

      if (data.statusCode === '000') {
        dispatch(smsSuccess(verificationCode, phone));
        onSuccess();
      } else {
        dispatch(
          smsFail(
            'No se pudo enviar el mensaje. Verifica el número de teléfono introducido.',
          ),
        );
      }
    } catch (e) {
      dispatch(smsFail(e));
    }
  };
};
