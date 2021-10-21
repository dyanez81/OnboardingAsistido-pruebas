/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Text, View, ScrollView, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import NavigationService from 'router/NavigationService';
import getRealm from 'repository/offline/realm';
import {RepositoryFactory} from 'repository/RepositoryFactory';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {MIN_SCORE_LEVELONE, UDIS15_AMOUNT, UDIS15_CANT} from 'utils/env';

const OnboardingUpgradeScreen = ({navigation}) => {
  // Component state
  const [score, setScore] = useState(null);

  // Methods
  const getScore = async () => {
    try {
      if (score) return score;
      else {
        const realm = await getRealm();
        const ScoreRepo = RepositoryFactory.getRealm('scoring', realm);
        const totalScr = ScoreRepo.getOne({type: 'total'}).score ?? 0;
        setScore(totalScr);
        return totalScr;
      }
    } catch (err) {
      console.log('\nCATCH GETSCORE:: ', err);
      return 0;
    }
  };

  const onLater = async () => {
    const _scr = await getScore();
    if (_scr >= MIN_SCORE_LEVELONE) navigation.navigate('onboardingLegalList');
    else NavigationService.reset('onboardBackLater');
  };

  const onUpgrade = () => {
    navigation.push('indicator', {levelOne: false});
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
          <View style={styles.iconContainer}>
            <LottieView
              source={require('assets/animations/check.json')}
              autoPlay
              loop
            />
          </View>
          <Text style={styles.paragraph}>
            Con estos datos, ya podrás{'\n'}ser cliente
            <Text style={styles.bold}> nivel 1 </Text>de{'\n'}Financiera
            Sustentable.
          </Text>
          <Text style={styles.paragraph}>
            El máximo de transacciones entrantes al mes es de {UDIS15_CANT}{' '}
            UDIS, es decir,<Text style={styles.bold}> {UDIS15_AMOUNT} </Text>
            aproximadamente.
          </Text>
          <Text style={styles.paragraph}>
            Si quieres recibir más o quieres invertir a plazo fijo, debes subir
            a<Text style={styles.bold}> nivel 2 </Text>como cliente de
            Financiera Sustentable.
          </Text>
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonArea}>
            <FinsusButtonSecondary
              text={'Subir Ahora'}
              color={'rgba(0,0,0,0.25)'}
              textColor={'#fff'}
              textSize={13}
              textAlign={'center'}
              onPress={onUpgrade}
            />
          </View>
          <View style={styles.buttonArea}>
            <FinsusButtonSecondary
              text={'Subir después'}
              color={'rgba(0,0,0,0.25)'}
              textColor={'#fff'}
              textSize={13}
              textAlign={'center'}
              onPress={onLater}
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
    fontSize: 14,
    letterSpacing: 0.15,
    color: 'rgb(172,177,192)',
    textAlign: 'center',
    marginHorizontal: 30,
    marginVertical: 10,
  },
  bold: {
    fontFamily: 'Montserrat-Bold',
  },
  titleBoxContainer: {},
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonArea: {
    flex: 1,
    marginVertical: 25,
    marginHorizontal: 30,
  },
  iconContainer: {
    width: '80%',
    height: 150,
    alignSelf: 'center',
    left: -8,
    marginVertical: 50,
  },
});

export default OnboardingUpgradeScreen;
