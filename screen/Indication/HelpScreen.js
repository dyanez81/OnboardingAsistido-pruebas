import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Linking} from 'react-native';
import {useSelector} from 'react-redux';

import MainLayout from 'layouts/MainLayout';
import LoginForm from 'components/ui/screens/login/LoginForm';

import FinsusTitle from 'components/base/FinsusTitle';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import Help from 'components/ui/screens/help/Help';
import {SECONDARY_COLOR} from 'utils/colors';
import {EMAIL_HELP_URL, FAQ, WHATSAPP_HELP_URL} from 'utils/env';

const HelpScreen = ({navigation}) => {
  // Parameters
  const fromMain = navigation.getParam('fromMain', false);
  const fromApp = navigation.getParam('fromApp', true);

  // Redux state
  const logged = useSelector(state => state.auth.logged);

  const [options1] = useState([
    {
      title: 'Conectar vía Whatsapp',
      icon: require('assets/icons/whatsapp-white.png'),
      onPress: () => {
        Linking.openURL(WHATSAPP_HELP_URL).catch(err =>
          console.error('WHATSAPP ERROR:', err),
        );
      },
    },
    {
      title: 'Enviar un correo electrónico',
      icon: require('assets/icons/email-white.png'),
      onPress: () => {
        Linking.openURL(EMAIL_HELP_URL).catch(err =>
          console.error('EMAIL ERROR:', err),
        );
      },
    },
  ]);

  const [options2] = useState([
    {
      title: 'Contraseña',
      icon: require('assets/icons/key-white.png'),
      onPress: () => {
        navigation.navigate('changePassHelp', {
          type: 'contract',
          onBoarding: false,
        });
      },
    },
    // {
    //   title: 'Cambié de número celular',
    //   icon: require('assets/icons/smartphone-white.png'),
    //   onPress: () => {
    //     navigation.navigate('confirmCodePass', {
    //       fromDrawer: false,
    //       isPassChange: false,
    //     });
    //   },
    // },
  ]);

  const onViewFAQ = () => {
    navigation.navigate('webview', {url: FAQ});
  };

  return (
    <MainLayout
      title={'AYUDA'}
      navigation={navigation}
      showBackPress={!fromMain}
      showBackPressPicture={fromMain}>
      <View style={styles.container}>
        <LoginForm style={styles.form}>
          <FinsusTitle
            title={'¿En qué podemos ayudarte?'}
            style={styles.title}
          />
          <Help style={componentStyles} customOptions={options1} />
          {logged && fromApp && (
            <Text style={styles.faqText}>Ayuda rápida:</Text>
          )}
          {logged && fromApp && (
            <Help style={componentStyles} customOptions={options2} />
          )}
          <FinsusButtonSecondary
            text="Preguntas frecuentes"
            onPress={onViewFAQ}
            style={{
              alignSelf: 'center',
              width: '100%',
              marginTop: 40,
            }}
          />
          <FinsusButtonSecondary
            text="Salir"
            onPress={() => navigation.goBack()}
            style={{
              alignSelf: 'center',
              width: '100%',
              marginBottom: 30,
            }}
          />
        </LoginForm>
      </View>
    </MainLayout>
  );
};

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    paddingHorizontal: 30,
  },
  title: {
    fontFamily: 'Montserrat-Light',
    fontSize: 21,
    color: 'black',
    paddingBottom: 20,
    marginTop: 25,
    textAlign: 'center',
  },
  shareContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  legalText: {
    fontSize: 14,
    marginTop: 36,
    marginBottom: 20,
    fontFamily: 'Montserrat-Light',
  },
  faqText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
    color: SECONDARY_COLOR,
    marginTop: 30,
  },
});

const iconSize = 55;

const componentStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    height: 1,
  },
  optionTitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    textAlign: 'left',
    marginTop: 14,
    marginLeft: 20,
    marginBottom: 8,
  },
  optionContainerIcon: {
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize / 2,
    backgroundColor: '#0095ce',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  optionIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default HelpScreen;
