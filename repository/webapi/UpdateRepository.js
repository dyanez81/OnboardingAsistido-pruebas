import {Platform, Linking} from 'react-native';
import VersionCheck from 'react-native-version-check';
import RNFetchBlob from 'rn-fetch-blob';
import validator from 'validator';
import {ANDROID_ID, IOS_ID, VERSION_PATTERN} from 'utils/env';

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-06-20 10:41:00
 * @Desc: Obtiene la última versión de la tienda (PlayStore)
 */
const getPlaystoreVersion = async () => {
  try {
    const latestVersion = await VersionCheck.getLatestVersion();

    if (!latestVersion) return '';
    else if (!validator.matches(latestVersion, VERSION_PATTERN)) return '';
    else return latestVersion;
  } catch (err) {
    console.log('\nERROR ANDROID:::', err.toString());
    return '';
  }
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-06-20 10:39:21
 * @Desc: Obtiene la última versión de la tienda (AppStore)
 */
const getAppstoreVersion = async () => {
  const packageName = 'com.financierasustentable.finsus';

  try {
    const latestVersion = await VersionCheck.getLatestVersion({
      forceUpdate: true,
      provider: () =>
        RNFetchBlob.fetch(
          'GET',
          `https://itunes.apple.com/MX/lookup?bundleId=${packageName}`,
        )
          .then(r => JSON.parse(r.data))
          .then(({results}) => results[0].version),
    });

    if (!latestVersion) return '';
    else if (!validator.matches(latestVersion, VERSION_PATTERN)) return '';
    else return latestVersion;
  } catch (err) {
    console.log('\nERROR iOS:::', err.toString());
    return '';
  }
};

export default {
  /**
   * javascript comment
   * @Author: AZozaya
   * @Date: 2020-06-20 10:19:20
   * @Desc: Obtiene la última versión de la tienda
   * @param {string} OS Sistema Operativo ios/android, si no se proporciona se define automáticamente
   */
  getLastVersion(OS = Platform.OS) {
    if (OS == 'android') return getPlaystoreVersion();
    else if (OS == 'ios') return getAppstoreVersion();
    else throw 'El sistema operativo proporcionado no es válido.';
  },
  /**
   * javascript comment
   * @Author: AZozaya
   * @Date: 2020-06-20 11:51:32
   * @Desc: Abre la tienda de aplicaciones
   * @param {string} OS Sistema Operativo ios/android, si no se proporciona se define automáticamente
   */
  openStore(OS = Platform.OS) {
    if (OS == 'android') Linking.openURL(`market://details?id=${ANDROID_ID}`);
    else if (OS == 'ios')
      Linking.openURL(`itms-apps://itunes.apple.com/us/app/id${IOS_ID}?mt=8`);
  },
};
