/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {DARK_GREY_BLUE} from 'utils/colors';
import OnboardingLevelOne from 'layouts/OnboardingLevelOne';

const OnboardingAccountValidationScreen = ({navigation}) => {
  // Parameters
  const level1 = navigation.getParam('levelOne', true);
  const type = navigation.getParam('type', 'success');

  const onNext = () => {
    navigation.navigate('onboardingLegalList', {levelOne: level1});
  };

  return (
    <OnboardingLevelOne
      loading={false}
      titleBox={null}
      noHeader={true}
      hideHelp={true}
      navigation={navigation}>
      <View style={styles.container}>
        <ScrollView>
          <Text style={[styles.paragraph, styles.firstText]}>
            Tus datos han sido validados correctamente.
          </Text>
          <Text style={[styles.paragraph, styles.lastText]}>
            Puedes continuar con el{'\n'}registro de tu cuenta.
          </Text>
          <View style={styles.logoContainer}>
            <Image
              source={
                type === 'success'
                  ? require('assets/images/shieldSuccess.png')
                  : require('assets/images/shieldFail.png')
              }
              style={styles.logo}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <FinsusButtonSecondary
            text={'Ok'}
            color={'rgba(0,0,0,0.25)'}
            textColor={'#fff'}
            textSize={13}
            textAlign={'center'}
            onPress={onNext}
          />
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
    backgroundColor: DARK_GREY_BLUE,
  },
  paragraph: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    letterSpacing: 0.15,
    color: 'rgb(172,177,192)',
    textAlign: 'center',
    marginHorizontal: 30,
    marginVertical: 10,
  },
  firstText: {marginTop: 80},
  lastText: {marginBottom: 40},
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 50,
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

export default OnboardingAccountValidationScreen;
