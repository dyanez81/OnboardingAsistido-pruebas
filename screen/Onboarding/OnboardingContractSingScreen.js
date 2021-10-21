import React from 'react';
import {View,Text,TouchableHighlight, StatusBar, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  onboardCloseModal,
  onboardOpenModal,
  onboardRegisterSignature,
} from 'store/actions';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import SelfieAvatar from 'components/ui/screens/onboarding/selfie/SelfieAvatar';
import OnboardingOptions from 'components/ui/screens/onboarding/OnboardingOptions';
import {useBackpress} from 'hooks/use-backpress';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';

const OnboardingContractSingScreen= ({navigation}) => {
  // Parameters
  //const level1 = navigation.getParam('levelOne', true);
  
  // Redux state
  const userPhone = useSelector(state => state.onboarding.userData.phone);
  const idAsociado = useSelector(state => state.onboarding.userData.idAsociado);
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  //const items = useSelector(state => state.onboarding.termsConditions.items);

  // Hooks


  const acceptLegals = () => {
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardOpenModal(errorForm));
      return;
    }

    const signInfo = {userPhone, idAsociado, items, levelOne: level1};
    dispatch(onboardRegisterSignature(signInfo));
  };



  const onBackPress = () => {
    navigation.goBack();
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };
return (
    <>
      <StatusBar barStyle="light-content" hidden={true} />
      <View style={styles.container}>

        <Text style={styles.paragraph}>
          {'Por favor, elige el tipo de cuenta\nque deseas registrar.'}
        </Text>
        <View style={styles.viewOptions}>
        <TouchableHighlight style={styles.textOnPress} onPress={navigation.replace('onboardingSignature')}>
          <Text style={styles.textButton}>Capturar firma</Text>
        </TouchableHighlight>
            <TouchableHighlight style={styles.textOnPress} onPress={navigation.replace('onboardingSignature')}>
          <Text style={styles.textButton}>Capturar firma</Text>
        </TouchableHighlight>
        </View>
        <View style={styles.viewBtn}>
          <TouchableHighlight>
            <Text
              style={styles.btn}
              onPress={() => {
                navigation.replace('loginScreen');
              }}>
              Cerrar sesión
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    
    alignItems: 'center',
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  paragraph: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    letterSpacing: 0.15,
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 40,
  },
  bold: {
    color: 'black',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 250,
    height: 150,
    resizeMode:'contain'
  },
  viewBtn: {
    paddingTop:5,
    width: '70%',
    height: 40,
    alignItems: 'center',
    backgroundColor: '#B69852',
    borderRadius:5
  },
  viewOptions: {
    flexDirection: 'column',
    width: '100%',
    alignItems:'center',
    marginTop: 30,
    marginBottom: 50,
  },
  btnAddNew: {
    marginTop:20,
    height: 70,
    width: '70%',
    backgroundColor: '#0070CD',
    borderRadius: 10,
  },
  btnUpGrade: {
    marginTop:20,
    height: 70,
    width: '70%',
    backgroundColor: '#0070CD',
    borderRadius: 10,
  },
  btnAdd: {
    marginTop: 5,
    color: 'white',
    fontSize: 17,
    height: 40,
    textAlign: 'center',
  },
  txtBtnOp: {
    paddingLeft:10,
    color: 'white',
    fontSize: 17,
    textAlign: 'left',
  },
  btn: {
    marginTop: 5,
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
  },
  btnAddAsesor: {
    backgroundColor: 'black',
    color: 'white',
    fontSize: 22,
    paddingVertical: 20,
    height: 40,
    textAlign: 'center',
  },
});

export default OnboardingContractSingScreen;
