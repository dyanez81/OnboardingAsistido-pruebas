import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import MainLayout from 'layouts/MainLayout';
import LoginForm from 'components/ui/screens/login/LoginForm';
import FinsusTitle from 'components/base/FinsusTitle';
import {SECONDARY_COLOR} from 'utils/colors';

const SendDataHelpScreen = ({navigation}) => {
  return (
    <MainLayout title={'AYUDA'} navigation={navigation} showBackPress>
      <View style={styles.container}>
        <LoginForm style={styles.form}>
          <FinsusTitle
            title={'¿Por qué debo enviar\nesta información?'}
            style={styles.title}
          />
          <Text style={styles.paragraph}>
            Debemos verificar la información y documentación de todas nuestras
            cuentas para cumplir con los máximos niveles de seguridad para
            proteger tus datos y tu dinero, además de cumplir con las normas
            actuales.
          </Text>
          <Text style={styles.paragraph}>
            Toda tu información está protegida y no será utilizada para ningún
            otro uso adicional a la actualización de tu expediente.
          </Text>
          <Text style={styles.paragraph}>
            Las claves de tu cuenta, así como los mensajes de validación por SMS
            o correo electrónico son privados.{'\n'}Recuerda que{' '}
            <Text style={styles.emphasis}>
              FINSUS no solicita datos por teléfono o correo electrónico,
            </Text>{' '}
            únicamente a través de la aplicación.
          </Text>
        </LoginForm>
      </View>
    </MainLayout>
  );
};

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
    paddingBottom: 32,
  },
  title: {
    fontFamily: 'Montserrat-Light',
    fontSize: 21,
    color: 'black',
    paddingBottom: 20,
    marginTop: 25,
    textAlign: 'center',
  },
  paragraph: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    letterSpacing: 0.15,
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
  },
  emphasis: {
    fontWeight: '700',
    color: SECONDARY_COLOR,
  },
});

export default SendDataHelpScreen;
