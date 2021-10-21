/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {SECONDARY_COLOR} from 'utils/colors';
import {
  onboardSendSMS,
  onboardSetUserCloseModal,
  onboardSetUserOpenModal,
} from 'store/actions';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';

const OnboardingVideoIndicationScreen = ({navigation}) => {
  // Parameters
  const completeFile = navigation.getParam('completeFile', false);

  // Component state
  const [manifest, setManifest] = useState(false);

  // Redux state
  const hasError = useSelector(state => state.onboarding.userData.hasError);
  const messageError = useSelector(state => state.onboarding.userData.error);
  const loading = useSelector(state => state.onboarding.userData.loading);
  const userPhone = useSelector(state => state.onboarding.userData.phone);

  // Hooks
  const dispatch = useDispatch();

  const onLater = () => {
    navigation.goBack();
  };

  const onUpgrade = () => {
    if (manifest == false) {
      dispatch(
        onboardSetUserOpenModal('Debes aceptar grabación de voz y video.'),
      );
      return;
    }

    if (!completeFile) dispatch(onboardSendSMS(userPhone, true, 'recordVideo'));
    else
      navigation.navigate('onboardingUpInstructions', {
        type: 'video',
        completeFile: true,
      });
  };

  const onCloseModal = () => {
    dispatch(onboardSetUserCloseModal());
  };

  return (
    <OnboardingLevelOne
      loading={loading && navigation.isFocused()}
      titleBox={null}
      noHeader={true}
      hideHelp={true}
      navigation={navigation}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.logoContainer}>
            <Image
              source={require('assets/images/shieldSuccess.png')}
              style={styles.logo}
            />
          </View>
          <Text style={styles.paragraph}>
            En<Text style={styles.bold}> FINSUS </Text>nos preocupamos por tu
            seguridad, y para ofrecerte mayor
            <Text style={styles.bold}> protección </Text>necesitamos agregar
            validaciones. Por lo anterior te pedimos grabar un video:
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>1.- </Text>Diciendo tu nombre completo y
            “acepto términos y condiciones”.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>2.- </Text>Mostrando tu INE por ambos
            lados
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>3.- </Text>Mostrando tu comprobante de
            domicilio
          </Text>
          <Text style={styles.paragraph}>
            Así, tu cuenta y tu dinero estarán
            <Text style={styles.bold}> siempre asegurados </Text>para que vivas
            tu{'\n'}experiencia financiera.
          </Text>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => {}}
            style={{marginTop: 30}}>
            <Text style={[styles.label10, styles.link]}>
              Términos y condiciones
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => setManifest(!manifest)}
            style={{marginTop: 16}}>
            <Text style={styles.paragraph}>
              Acepto grabación de voz y video{'  '}
              <Icon
                name={manifest ? 'check-circle' : 'radio-button-unchecked'}
                size={24}
                color={'gray'}
              />
            </Text>
          </TouchableHighlight>
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonArea}>
            <FinsusButtonSecondary
              text={'Continuar'}
              color={'rgba(0,0,0,0.25)'}
              textColor={'#fff'}
              textSize={13}
              textAlign={'center'}
              onPress={onUpgrade}
            />
          </View>
          <View style={styles.buttonArea}>
            <FinsusButtonSecondary
              text={'Volver después'}
              color={'rgba(0,0,0,0.25)'}
              textColor={'#fff'}
              textSize={13}
              textAlign={'center'}
              onPress={onLater}
            />
          </View>
        </View>
      </View>
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}
        text={messageError}
      />
    </OnboardingLevelOne>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  paragraph: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    letterSpacing: 0.15,
    color: 'rgb(172,177,192)',
    textAlign: 'center',
    marginHorizontal: 30,
    marginVertical: 5,
  },
  bold: {
    color: SECONDARY_COLOR,
  },
  label10: {
    fontFamily: 'Montserrat-Light',
    fontSize: 10,
    color: 'rgb(172,177,192)',
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
  },
  titleBoxContainer: {},
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonArea: {
    flex: 1,
    marginVertical: 25,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 110,
    height: 110,
  },
});

export default OnboardingVideoIndicationScreen;
