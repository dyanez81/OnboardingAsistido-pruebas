import React, {useState, useEffect, useCallback} from 'react';
import Orientation from 'react-native-orientation-locker';
import RNExitApp from 'react-native-exit-app';
import {authOpenModal} from 'store/actions';

import WelcomeSplash from 'components/ui/screens/welcome/WelcomeSplash';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import {WEB_API_DIMMER} from 'utils/env';

Orientation.lockToPortrait();
const SplashScreen = ({navigation}) => {
  // Redux state
  const [errorForm, setErrorForm] = useState({
    state: false,
    message: '',
  });

  //Hooks
  useEffect(() => {
    const timer = setTimeout(() => onLoad(), 1500);

    return () => {
      clearTimeout(timer);
    };
  });

  //Methods
  const showError = msg => {
    setErrorForm({
      state: true,
      message: msg,
    });
  };

  const closeError = () => {
    setErrorForm({
      state: false,
      message: '',
    });
    RNExitApp.exitApp();
  };

  const onLoad = useCallback(async () => {
    // Se verifica conetividad
    fetch(WEB_API_DIMMER)
      .then(response => {
        if (response.status === 200) {
          navigation.replace('loginScreen');
        } else {
          showError(
            'No se puede conectar a Finsus. Revisa tu conexión a internet.',
          );
          console.log('\nERROR STATUS::', response.status);
        }
      })
      .catch(err => {
        showError('No se puede conectar a Finsus:\n' + err.toString());
      });
  }, []);

  return (
    <>
      <WelcomeSplash />
      <FinsusErrorModal
        done={closeError}
        visible={errorForm.state}
        text={errorForm.message}
      />
    </>
  );
};

export default SplashScreen;
