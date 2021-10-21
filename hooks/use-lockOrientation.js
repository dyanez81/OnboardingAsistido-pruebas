import {useEffect} from 'react';
import Orientation from 'react-native-orientation-locker';

/**
 * @Author: AZozaya
 * @Date: 2020-02-12 15:10:42
 * @Desc: Bloquea la orientación de la pantalla
 * @param {bool} mode: Modo a bloquear => 1: portrait, 2: landscape, 3: auto
 * @param {bool} next: Modo a regresar => 0: ninguno, 1: portrait, 2: landscape, 3: auto
 */
export const useLockOrientation = (mode = 1, next = 0) => {
  useEffect(() => {
    LockScreen(mode);

    return () => {
      if (next !== 0) {
        LockScreen(next);
      }
    };
  }, []);

  const LockScreen = newmode => {
    switch (newmode) {
      case 1:
        Orientation.lockToPortrait();
        break;
      case 2:
        Orientation.lockToLandscape();
        break;
      default:
        Orientation.unlockAllOrientations();
        break;
    }
  };
};
