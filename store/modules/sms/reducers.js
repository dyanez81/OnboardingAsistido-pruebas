import {
  SMS_START,
  SMS_SUCCESS,
  SMS_FAIL,
  SMS_OPEN_MODAL,
  SMS_CLOSE_MODAL,
  SMS_FROM_VIEW,
} from './actionTypes';

const initState = {
  codeSMS: null,
  phone: null,
  loading: false,
  error: null,
  hasError: false,
  fromLogin: false,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SMS_START:
      return {
        ...state,
        loading: true,
        error: null,
        hasError: false,
      };
    case SMS_SUCCESS:
      return {
        ...state,
        phone: action.phone,
        codeSMS: action.code,
        loading: false,
        error: null,
        hasError: false,
      };
    case SMS_FAIL:
      return {
        ...state,
        code: null,
        loading: false,
        error: action.error,
        hasError: true,
      };
    case SMS_CLOSE_MODAL:
      return {
        ...state,
        error: null,
        hasError: false,
      };
    case SMS_OPEN_MODAL:
      return {
        ...state,
        error: action.error,
        hasError: true,
      };
    case SMS_FROM_VIEW:
      return {
        ...state,
        fromLogin: action.fromLogin,
      };
    default:
      return state;
  }
};

export default reducer;
