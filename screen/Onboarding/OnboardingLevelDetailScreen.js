/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useDispatch} from 'react-redux';
import {View, Text, ScrollView, StatusBar, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LoginForm from 'components/ui/screens/login/LoginForm';
import OnboardRequirement from 'components/ui/screens/onboarding/OnboardRequirement';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';

import {DARK_GREY_BLUE, SECONDARY_COLOR} from 'utils/colors';
import {onboardingSetUser} from 'store/actions';
import {UDIS15_AMOUNT, UDIS20_AMOUNT} from 'utils/env';

const OnboardingLevelDetailScreen = ({navigation}) => {
  // Parameters
  const pLevel = navigation.getParam('level', '1');

  // Redux state
  const dispatch = useDispatch();

  // Constants
  const benefits = [
    {
      text: 'Cero comisiones por uso de cuenta',
      icon: require('assets/icons/commission-blue.png'),
      bold: false,
    },
    {
      text: 'Sin saldo mínimo',
      icon: require('assets/icons/balance-blue.png'),
      bold: false,
    },
    {
      text: 'Envía y recibe dinero con todos los Bancos de México',
      icon: require('assets/icons/transferBlue.png'),
      bold: false,
    },
    {
      text: 'Gana rendimientos por tu ahorro e inversiones',
      icon: require('assets/icons/incomes-blue.png'),
      bold: true,
    },
  ];
  const requirements = [
    {
      text: 'INE vigente',
      icon: require('assets/icons/idcard-blue.png'),
      bold: false,
    },
    {
      text: 'Acceso a internet',
      icon: require('assets/icons/wifi-blue.png'),
      bold: false,
    },
    {
      text: 'Buena iluminación',
      icon: require('assets/icons/light-blue.png'),
      bold: false,
    },
    ...(pLevel == '2'
      ? [
          {
            text: 'Comprobante de domicilio vigente',
            icon: require('assets/icons/home-blue.png'),
            bold: false,
          },
          {
            text: 'RFC con Homoclave',
            icon: require('assets/icons/rfc-blue.png'),
            bold: false,
          },
        ]
      : []),
  ];

  // Methods
  const onRegister = () => {
    dispatch(onboardingSetUser({level: pLevel}));
    navigation.navigate('onboardingCreateUser');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden={true} />
      <Icon
        name="keyboard-arrow-left"
        size={42}
        color={SECONDARY_COLOR}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 9,
          elevation: 9,
        }}
        onPress={() => navigation.goBack()}
      />
      <ScrollView style={{width: '100%'}}>
        <LoginForm style={styles.summary}>
          <View style={styles.columnL}>
            <Text style={styles.level}>Nivel {pLevel}</Text>
          </View>
          <View style={styles.columnR}>
            <Text style={styles.description}>{`Limite de\ndepósitos hasta\n${
              pLevel == '1' ? UDIS15_AMOUNT : UDIS20_AMOUNT
            } al mes`}</Text>
          </View>
        </LoginForm>
        <LoginForm style={styles.benefits}>
          <Text style={styles.title}>Beneficios</Text>
          <View>
            {benefits.map((benefit, i) => (
              <OnboardRequirement
                text={benefit.text}
                icon={benefit.icon}
                bold={benefit.bold}
                key={`ben${i}`}
              />
            ))}
          </View>
        </LoginForm>
        <LoginForm style={styles.benefits}>
          <Text style={styles.title}>Requisitos</Text>
          <View>
            {requirements.map((requirement, i) => (
              <OnboardRequirement
                text={requirement.text}
                icon={requirement.icon}
                bold={requirement.bold}
                key={`req${i}`}
              />
            ))}
          </View>
        </LoginForm>
        <FinsusButtonSecondary
          text={'Comenzar Registro'}
          color={SECONDARY_COLOR}
          onPress={onRegister}
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  summary: {
    marginVertical: 8,
    paddingBottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingLeft: 24,
    alignSelf: 'center',
  },
  columnL: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 26,
  },
  columnR: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  level: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 23,
    color: SECONDARY_COLOR,
    marginVertical: 24,
  },
  description: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: DARK_GREY_BLUE,
    width: '100%',
    paddingRight: 16,
    marginVertical: 8,
    textAlign: 'right',
  },
  benefits: {
    marginVertical: 8,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingLeft: 24,
    paddingRight: 12,
    alignSelf: 'center',
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: DARK_GREY_BLUE,
    marginBottom: 16,
  },
  button: {marginVertical: 16, alignSelf: 'center'},
});

export default OnboardingLevelDetailScreen;
