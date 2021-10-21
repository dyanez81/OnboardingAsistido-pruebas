import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {WebView} from 'react-native-webview';
import Orientation from 'react-native-orientation-locker';
import moment from 'moment';
import {onboardSetDocumentData} from 'store/actions';

import FinsusAccepCancelButton from 'components/base/FinsusAcceptCancelButton';
import FinsusLoading from 'components/ui/modals/FinsusLoading';
import {
  DOC_LEGAL_CONTRACT,
  DOC_LEGAL_ECONTRACT,
  DOC_LEGAL_PRIVACY,
} from 'utils/env';

const OnboardingReadLegalScreen = ({navigation}) => {
  // Parameters
  const type = navigation.getParam('type', 'contract');
  const onBoarding = navigation.getParam('onBoarding', false);

  // Redux
  const dispatch = useDispatch();

  // Component state
  const [urlDoc, setUrlDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hooks
  useEffect(() => {
    switch (type) {
      case 'contract':
        navigation.navigate('onboardingSignature', {type});
        break;
      case 'econtract':
        navigation.navigate('onboardingSignature', {type});
        break;
      default:
        setUrlDoc(DOC_LEGAL_PRIVACY);
        break;
    }
  }, []);

  const onBackScreen = () => {
    navigation.goBack();
  };

  const onAcceptTerms = () => {
    if (onBoarding) {
      if (type !== 'privacy') {
        Orientation.lockToLandscape();
        navigation.navigate('onboardingSignature', {type});
      } else {
        const _info = {
          datetime: moment().format(),
        };

        dispatch(onboardSetDocumentData('ACCEPT', _info, 2));
        navigation.goBack();
      }
    } else {
      navigation.goBack();
    }
  };

  return (
<>
</>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginVertical: 5,
  },
});

export default OnboardingReadLegalScreen;
