import {combineReducers} from 'redux';

import smsReducer from './modules/sms/reducers';
import onboardingReducer from './modules/onboarding/reducers';

export default combineReducers({
  sms: smsReducer,
  onboarding: onboardingReducer,
});
