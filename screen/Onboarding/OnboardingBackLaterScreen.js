/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import RNExitApp from 'react-native-exit-app';
import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import SelfieAvatar from 'components/ui/screens/onboarding/selfie/SelfieAvatar';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import NavigationService from 'router/NavigationService';

const OnboardingBackLaterScreen = ({navigation}) => {
  // Parameters
  const isOnboard = navigation.getParam('onboard', false);
  const optional = navigation.getParam('optional', false);

  // Redux state
  const firstName = useSelector(state => state.onboarding.userData.name);
  const imgSelfie = useSelector(
    state => state.onboarding.ineSelfieData.items[0].data,
  );

  const onBackLater = () => {
    if (optional === true) NavigationService.reset('main');
    else RNExitApp.exitApp();
  };

  const getName = firstName => {
    const name = firstName.trim().split(' ')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <OnboardingLevelOne
      loading={false}
      titleBox={
        <SelfieAvatar
          image={
            imgSelfie
              ? {uri: `data:image/jpg;base64,${imgSelfie}`}
              : require('assets/images/user-logo.png')
          }
          title={firstName ? getName(firstName) + ', ' : ''}
          subtitle={''}
        />
      }
      navigation={navigation}>
      <View style={styles.container}>
        <ScrollView>
          {isOnboard ? (
            <>
              <Text style={[styles.paragraph, styles.marginV]}>
                Recibimos tu solicitud para apertura de cuenta en finsus app.
              </Text>
              <Text style={[styles.paragraph, styles.marginV]}>
                Tu información se validará y te avisaremos si tu cuenta ha sido
                aprobada.
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.paragraph, styles.marginV]}>
                Recibimos la actualización de tu información y/o documentos.
              </Text>
              <Text style={[styles.paragraph, styles.marginV]}>
                En cuanto finalicemos la validación de calidad y seguridad te
                notificaremos.
              </Text>
              <Text style={styles.paragraph}>
                Si tienes alguna duda estamos para servirte en nuestro centro de
                contacto.
              </Text>
            </>
          )}
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonArea}>
            <FinsusButtonSecondary
              text={optional ? 'Ok' : 'Volver más tarde'}
              color={'rgba(0,0,0,0.25)'}
              textColor={'#fff'}
              textSize={13}
              textAlign={'center'}
              onPress={onBackLater}
            />
          </View>
        </View>
      </View>
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
    fontSize: 16,
    letterSpacing: 0.15,
    color: 'rgb(172,177,192)',
    textAlign: 'center',
    marginHorizontal: 40,
    marginVertical: 15,
  },
  marginV: {
    marginTop: 35,
  },
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
});

export default OnboardingBackLaterScreen;
