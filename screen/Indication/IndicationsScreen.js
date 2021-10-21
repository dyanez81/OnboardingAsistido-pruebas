import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useBackpress} from 'hooks/use-backpress';

import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {DARK_GREY_BLUE, SECONDARY_COLOR} from 'utils/colors';
import {
  onboardCloseModal,
  onboardingSetUser,
  onboardSetPassword,
  onboardUpdatePushToken,
} from 'store/actions';
import {decrypt} from 'utils/methods';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import FinsusLoading from 'components/ui/modals/FinsusLoading';

const IndicationsScreen = ({navigation}) => {
  // Parameters
  const level1 = navigation.getParam('levelOne', true);

  //Redux state
  const dispatch = useDispatch();
  const loading = useSelector(state => state.onboarding.loading);
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const userOB = useSelector(state => state.onboarding.userData);
  const userAuth = useSelector(state => state.auth.usuario);

  //Constants
  const secondTitle =
    'Asegúrate de tener \nacceso a Internet \ny una buena \niluminación.';

  const getTitle = () => {
    if (level1)
      return (
        <Text style={styles.textIndicator}>
          Por favor, ten a la mano:{'\n'}tu INE.
        </Text>
      );
    else
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.textIndicator}>Por favor, ten a la mano:</Text>
          <Text style={styles.textIndicator}>
            <Text style={styles.accent}>Comprobante de domicilio</Text>. Puede
            ser agua, luz ó teléfono.
          </Text>
          <Text style={styles.textIndicator}>
            <Text style={styles.accent}>La INE </Text>
            con la que te registraste.
          </Text>
          <Text style={styles.textIndicator}>
            <Text style={styles.accent}>Tu RFC </Text>
            con homoclave.
          </Text>
          <Text style={styles.textIndicator}>
            Te haremos una entrevista a través de una
            <Text style={styles.accent}> videollamada</Text>.
          </Text>
        </View>
      );
  };

  //Hooks
  useBackpress(() => {
    return true;
  });

  /**
   * @author Juan de Dios
   * @description navega hacia otro screen
   */
  const goToNextScreen = () => {
    if (level1) navigation.push('onboardingCreateUser');
    else {
      setValuesLevelTwo();
    }
  };

  const setValuesLevelTwo = () => {
    if (userAuth.phone && !userOB.phone) {
      // Si tiene data en Auth y no en OB es que viene de Login. Se copian los valores que se usan en el OB N2 para que se usen del State de OB indistintamente si viene de Login o Registro corrido.
      try {
        const account = userAuth.accounts[0];
        const names = userAuth.nameUser.trim().split(' ');
        dispatch(
          onboardingSetUser({
            phone: userAuth.phone,
            email: userAuth.email,
            name: names[0],
            paternal: names.slice(1).join(' '),
            fullName: userAuth.nameUser,
            curp: userAuth.curp,
            level: userAuth.level,
            idAsociado: account.idAsociado,
            interbankKey: account.interbankKey,
            accountNumber: account.accountNumber,
            customerCode: account.customerCode,
          }),
        );
        dispatch(onboardSetPassword({password: decrypt(userAuth.password)}));

        // Se actualiza el Token Push
        dispatch(onboardUpdatePushToken({phone: userAuth.phone}));
      } catch (err) {
        dispatch(onboardOpenModal(`No se pudo recuperar la información:`));
        console.log('\nCATCH REDUX ::', err);
        return;
      }
    } else {
      navigation.push('onboardingVideo');
    }
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" hidden={true} />
        <Icon
          name="keyboard-arrow-left"
          size={36}
          style={{position: 'absolute', top: 8, left: 8, zIndex: 2}}
          color={'black'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={{marginTop: 30}}>
          {getTitle()}
          <View style={styles.imageContainer}>
            <Image
              source={require('assets/images/indicator-docs.png')}
              style={styles.imageDocs}
            />
          </View>
        </View>
        <View>
          <Text style={styles.textIndicator}>{secondTitle}</Text>
          <View style={[styles.imageContainer]}>
            <Image
              source={require('assets/images/indicator-wifi.png')}
              style={styles.imageWifi}
            />
            <Image
              source={require('assets/images/indicator-light.png')}
              style={styles.imageLight}
            />
          </View>
        </View>
        <View
          style={{
            ...styles.buttonContainer,
            marginVertical: level1 ? 50 : 30,
          }}>
          <FinsusButtonSecondary
            text={'¡Adelante!'}
            color={'#3495ce'}
            onPress={goToNextScreen}
          />
          {level1 ? null : (
            <TouchableHighlight
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={styles.cancelUpgradeText}>
                Cancelar avance de nivel
              </Text>
            </TouchableHighlight>
          )}
        </View>
      </View>
      <FinsusLoading
        loading={loading && navigation.isFocused()}
        text={'Actualizando información'}
      />
      <FinsusErrorModal
        visible={hasError && navigation.isFocused()}
        text={messageError}
        done={onCloseModal}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    width: '65%',
  },
  textIndicator: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    textAlign: 'center',
    color: DARK_GREY_BLUE,
    marginVertical: 5,
  },
  accent: {
    color: SECONDARY_COLOR,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 22,
  },
  imageDocs: {
    width: 100,
    height: 100,
  },
  imageWifi: {
    resizeMode: 'contain',
    height: 60,
    width: 45,
  },
  imageLight: {
    resizeMode: 'contain',
    width: 35,
    height: 60,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelUpgradeText: {
    fontSize: 20,
    fontFamily: 'Montserrat-Regular',
    marginTop: 16,
    marginBottom: 20,
    color: SECONDARY_COLOR,
  },
});

export default IndicationsScreen;
