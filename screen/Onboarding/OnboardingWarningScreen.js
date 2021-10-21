import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {withNavigationFocus} from 'react-navigation';
import {RNCamera} from 'react-native-camera';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation-locker';

import {onboardSetImageDataSelfie, onboardSetActiveImage} from 'store/actions';
import {useBackpress} from 'hooks/use-backpress';
import CameraFrame from 'components/base/CameraFrame';
import {PRIMARY_COLOR, SECONDARY_COLOR} from 'utils/colors';

const OnboardingWarningScreen = ({navigation, isFocused}) => {
  const MESSAGE_SELFIE =
    'Ubica el rostro del usuario\ndentro del recuadro y toma la foto';

  const MESSAGE_FRONT_INE =
    'Coloca el anverso de la INE o del pasaporte\nde manera que quede\ndentro del recuadro';

  const MESSAGE_BACK_INE =
    'Coloca el reverso de la INE o del pasaporte\nde manera que quede\ndentro del recuadro';

  // Redux state
  const items = useSelector(state => state.onboarding.ineSelfieData.items);

  // Component state
  const [title, setTitle] = useState(null);
  const [indexImage, setIndexImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const camera = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const typeMessage = navigation.getParam('type', 'selfie');
    setShowCamera(false);

    switch (typeMessage) {
      case 'selfie':
        setTitle(MESSAGE_SELFIE);
        setIndexImage(0);
        break;
      case 'frontalINE':
        setTitle(MESSAGE_FRONT_INE);
        setIndexImage(1);
        break;
      case 'anversoINE':
        setTitle(MESSAGE_BACK_INE);
        setIndexImage(2);
        break;
      default:
        setTitle(MESSAGE_SELFIE);
        setIndexImage(0);
        break;
    }

    let timer = setTimeout(() => {
      setShowCamera(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigation]);

  useBackpress(() => {
    return true;
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const takePicture = async () => {
    if (camera) {
      const typeMessage = navigation.getParam('type', 'selfie');
      const options = {
        quality: typeMessage === 'selfie' ? 0.8 : 0.97,
        width: typeMessage === 'selfie' ? 480 : 848,
        base64: true,
        fixOrientation: false,
      };
      const data = await camera.current.takePictureAsync(options);

      dispatch(onboardSetImageDataSelfie(data.base64, indexImage));

      switch (typeMessage) {
        case 'selfie':
          dispatch(onboardSetActiveImage(1));
          break;
        case 'frontalINE':
          dispatch(onboardSetActiveImage(2));
          break;
        case 'anversoINE':
          dispatch(onboardSetActiveImage(3));
          break;
      }

      Orientation.lockToLandscape();
      setShowPreview(true);
    }
  };

  const renderCamera = () => {
    return (
      <View style={styles.containerCamera}>
        <RNCamera
          ref={ref => {
            camera.current = ref;
          }}
          style={styles.previewCamera}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          androidCameraPermissionOptions={{
            title: 'Permiso para usar la cámara',
            message: 'Necesitamos permiso para usar la cámara.',
            buttonPositive: 'Aceptar',
            buttonNegative: 'Cancelar',
          }}
          captureAudio={false}
          ratio="16:9">
          <CameraFrame
            textVertical={
              indexImage === 0
                ? 'Ubica el rostro del usuario\ndentro del recuadro y toma la foto'
                : null
            }
            textHorizontal={
              indexImage > 0
                ? 'Coloca el anverso de la INE o del pasaporte\nde manera que quede\ndentro del recuadro'
                : null
            }
          />
        </RNCamera>
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          <View style={styles.captureCamera}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={takePicture}
            />
          </View>
          <Icon
            name="keyboard-arrow-left"
            size={50}
            style={{position: 'absolute', bottom: 20, left: 30, zIndex: 2}}
            color={'white'}
            onPress={onBackPress}
          />
        </View>
      </View>
    );
  };

  const getImage = () => {
    const typeMessage = navigation.getParam('type', 'selfie');
    const _idx =
      typeMessage === 'frontalINE' ? 1 : typeMessage === 'anversoINE' ? 2 : 0;

    return items[_idx].data;
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
            source={{uri: `data:image/jpg;base64,${getImage()}`}}
          />
        </View>
        <View style={styles.prevButtonsContainer}>
          <TouchableOpacity
            style={styles.prevButton}
            onPress={() => {
              Orientation.lockToPortrait();
              setShowPreview(false);
            }}>
            <Text style={styles.prevTextButton}>Volver a{'\n'}tomar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.prevButton}
            onPress={() => {
              Orientation.lockToPortrait();
              navigation.goBack();
            }}>
            <Text style={styles.prevTextButton}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderWarningMessage = () => {
    const typeMessage = navigation.getParam('type', 'selfie');
    if (!showCamera) {
      return (
        <View style={styles.container}>
          <Image source={require('/assets/icons/ROSTRO.png')} style={styles.imageWarng}></Image>
          <Text style={styles.text}>{title}</Text>
        </View>
      );
    } else if (showPreview && getImage() !== null) {
      return renderPreview();
    } else if (showCamera && isFocused) {
      return renderCamera();
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
    backgroundColor: PRIMARY_COLOR,
  },
  imageWarng:{
    width:50,
    height:50,
    marginBottom:90,
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    textAlign: 'center',
    color: SECONDARY_COLOR,
  },
  containerCamera: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  previewCamera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  captureCamera: {
    backgroundColor: '#fff',
    borderRadius: 50,
    margin: 10,
    padding: 2,
  },
  cameraButton: {
    flex: 0,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 50,
    padding: 30,
    paddingHorizontal: 30,
    alignSelf: 'center',
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

export default withNavigationFocus(OnboardingWarningScreen);
