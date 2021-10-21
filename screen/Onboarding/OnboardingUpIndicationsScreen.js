import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {withNavigationFocus} from 'react-navigation';
import {launchCamera} from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {useDispatch, useSelector} from 'react-redux';
import {useBackpress} from 'hooks/use-backpress';
import {
  onboardSetVideoData,
  onboardSetVideoActive,
  onboardCloseModal,
  onboardOpenModal,
  onboardSetDomicileData,
  onboardSetImageDataSelfie,
} from 'store/actions';
import Icon from 'react-native-vector-icons/MaterialIcons';

import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import {SECONDARY_COLOR} from 'utils/colors';

const OnboardingUpIndicationsScreen = ({navigation}) => {
  // Parameters
  const typeMessage = navigation.getParam('type', 'domicile');
  const isPendingLvl2 = navigation.getParam('pendingLvl2', false);

  // Constants
  const MESSAGE_DOMICILE =
    'Coloca el comprobante\nde domicilio a manera\nque quede dentro\ndel recuadro.';

  const MESSAGE_VIDEO =
    'Graba un video que contenga: \n\n1. Tu nombre completo. \n\n2. La frase “Conozco y acepto los términos \ndel contrato”. \n\n3. Muestra tu INE por ambos lados.';

  // Redux state
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);

  // Component state
  const [title, setTitle] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [dataVideo, setDataVideo] = useState(null);
  const dispatch = useDispatch();

  // Hooks
  useEffect(() => {
    switch (typeMessage) {
      case 'domicile':
        setTitle(MESSAGE_DOMICILE);

        // Solo timer en comprobante
        let timer = setTimeout(() => {
          takePicture();
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
        break;
      case 'video':
        setTitle(MESSAGE_VIDEO);
        takeVideo();
        break;
      default:
        setTitle(MESSAGE_DOMICILE);
        break;
    }
  }, [navigation]);

  useBackpress(() => {
    return true;
  });

  const hasStoragePermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return {
        result: true,
        message: '',
      };
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    if (hasPermission)
      return {
        result: true,
        message: '',
      };

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return {
        result: true,
        message: '',
      };
    } else if (status === PermissionsAndroid.RESULTS.DENIED) {
      return {
        result: false,
        message: 'FinsusApp necesita permisos para guardar la foto/video.',
      };
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      return {
        result: false,
        message:
          'FinsusApp necesita permisos para guardar la foto/video..\n\nPor favor, ajusta los permisos de Almacenamiento en configuraciones.',
      };
    }
  };

  const takePicture = async () => {
    const {result, message} = await hasStoragePermission();

    if (!result) {
      dispatch(onboardOpenModal(message));
      return;
    }

    var options = {
      mediaType: 'photo',
      cameraType: 'back',
      maxWidth: 720,
      maxHeight: 720,
      includeBase64: true,
      quality: 0.5,
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        navigation.goBack();
      } else if (response.error) {
        dispatch(onboardOpenModal(response.error));
      } else {
        if (isPendingLvl2) {
          const domicileInfo = {imageProofAddress: response.data};
          dispatch(onboardSetDomicileData(domicileInfo));
        } else {
          dispatch(onboardSetImageDataSelfie(response.base64, 3));
        }
        navigation.goBack();
      }
    });
  };

  const takeVideo = async () => {
    const {result, message} = await hasStoragePermission();

    if (!result) {
      dispatch(onboardOpenModal(message));
      return;
    }

    var options = {
      mediaType: 'video',
      cameraType: 'front',
      videoQuality: 'low',
      durationLimit: 15,
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        navigation.goBack();
      } else if (response.error) {
        dispatch(onboardOpenModal(response.error));
      } else {
        try {
          let _vPath = response.path;
          if (Platform.OS === 'ios') {
            let arr = response.path.split('/');
            const dirs = RNFetchBlob.fs.dirs;
            _vPath = `${dirs.CacheDir}/Camera/${arr[arr.length - 1]}`;
          }
          RNFetchBlob.fs
            .readFile(_vPath, 'base64')
            .then(base64 => {
              dispatch(onboardSetVideoData(base64, 2));
              navigation.pop(2);
            })
            .catch(err => () => {
              dispatch(onboardOpenModal(err.toString()));
            });
        } catch (ex) {
          dispatch(onboardOpenModal(ex.toString()));
        }
      }
    });
  };

  const onRetry = () => {
    setShowPreview(false);
    takePicture();
  };

  const onAccept = () => {
    if (dataVideo) {
      dispatch(onboardSetVideoData(dataVideo, 0));
      dispatch(onboardSetVideoActive(1));
      navigation.goBack();
    } else {
      dispatch(
        onboardOpenModal('No existe foto/video capturada. Intenta de nuevo.'),
      );
    }
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  const renderPreview = () => {
    return (
      <View style={styles.containerPreview}>
        <View style={styles.prevInstructionsContainer}>
          <Text style={styles.prevInstructions}>
            Verifica la claridad de la imagen y el texto.
          </Text>
        </View>
        <View style={styles.prevImgContainer}>
          <Image
            style={styles.prevImage}
            source={{
              uri: `data:image/jpg;base64,${dataVideo}`,
            }}
          />
        </View>
        <View style={styles.prevButtonsContainer}>
          <TouchableOpacity style={styles.prevButton} onPress={onRetry}>
            <Text style={styles.prevTextButton}>
              Volver a{'\n'}
              tomar foto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.prevButton} onPress={onAccept}>
            <Text style={styles.prevTextButton}>Aceptar</Text>
          </TouchableOpacity>
        </View>
        <FinsusErrorModal
          done={onCloseModal}
          visible={hasError && navigation.isFocused()}
          text={messageError}
        />
      </View>
    );
  };

  const renderWarningMessage = () => {
    if (!showPreview) {
      return (
        <View style={styles.container}>
          <Icon
            name="keyboard-arrow-left"
            size={36}
            color={'rgb(172,177,192)'}
            style={{position: 'absolute', top: 10, left: 10}}
            onPress={() => {
              if (typeMessage == 'video') navigation.pop(2);
              else navigation.goBack();
            }}
          />
          <Text style={styles.text}>{title}</Text>
          <FinsusErrorModal
            done={onCloseModal}
            visible={hasError && navigation.isFocused()}
            text={messageError}
          />
        </View>
      );
    } else if (showPreview && dataVideo) {
      return renderPreview();
    } else {
      return <View />;
    }
  };

  return renderWarningMessage();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(40, 52,96)',
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    textAlign: 'center',
    color: 'rgb(172, 177, 192)',
  },
  previewCamera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    textAlign: 'center',
  },
  containerPreview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  prevInstructionsContainer: {
    width: '100%',
    height: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
  },
  prevInstructions: {
    fontFamily: 'Montserrat-Light',
    fontSize: 18,
    textAlign: 'center',
    color: SECONDARY_COLOR,
  },
  prevImgContainer: {flex: 1, padding: 25},
  prevImage: {height: '100%', width: '100%', resizeMode: 'contain'},
  prevButtonsContainer: {
    width: '100%',
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
  },
  prevButton: {
    width: 125,
    height: 50,
    borderRadius: 40,
    backgroundColor: SECONDARY_COLOR,
    justifyContent: 'center',
  },
  prevTextButton: {
    fontFamily: 'Montserrat-Light',
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  },
});

export default withNavigationFocus(OnboardingUpIndicationsScreen);
