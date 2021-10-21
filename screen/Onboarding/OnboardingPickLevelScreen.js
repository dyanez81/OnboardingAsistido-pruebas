/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  StatusBar,
} from 'react-native';
import {SECONDARY_COLOR} from 'utils/colors';

const OnboardingPickLevelScreen = ({navigation}) => {
  
  useEffect(() => {
    //getData();
  }, []);

  function upGrade() {
    levelAccount = '2';
    threeAccountLevel = true;
    navigation.replace('onboardingCreateUser');

  }
  function newAccount() {
    levelAccount = '3';
    threeAccountLevel = false;
    isChecking = true;
    navigation.replace('onboardingCreateUser');
  }

  return (
    <>
      <StatusBar barStyle="light-content" hidden={true} />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('/assets/images/LogoHD_FS.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.paragraph}>
          {'Por favor, elige el tipo de\ncuenta que deseas registrar.'}
        </Text>
        <View style={styles.viewOptions}>
          <TouchableHighlight style={styles.btnAddNew}>
              <Text
                style={styles.txtBtnOp}
                onPress={() => {
                  newAccount();
                }}>
                {'\nNivel 3'}
              </Text>
            </TouchableHighlight >
            <Image source={require('/assets/icons/mas-gris.png')} style={styles.imagePlus2}></Image>
            <Text style={styles.subtittle}>Cuenta nueva</Text>
          <TouchableHighlight style={styles.btnUpGrade}>
              <Text
                style={styles.txtBtnOp}
                onPress={() => {
                  upGrade();
                }}>
                {'\nNivel 3'}
              </Text>
            </TouchableHighlight>
            <Image source={require('/assets/icons/mas-gris.png')} style={styles.imagePlus}></Image>
            <Text style={styles.subtittle}>Usuario registrado</Text>
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
    marginBottom: 50,
  },
  imagePlus:{
    marginTop:-65,
    marginRight:'-75%'
  },
  imagePlus2:{
    marginTop:-65,
    marginRight:'-75%',
  },
  subtittle:{
    marginTop:-23,
    fontSize:15,
    fontFamily:'Montserrat-Regular',
    textAlign:'left',
    marginLeft:-200,
    height:40,

  },
  bold: {
    color: SECONDARY_COLOR,
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
    width: '100%',
    height: 40,
    alignItems: 'center',
    backgroundColor: '#0070CD',
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
    height: 80,
    width: '100%',
    backgroundColor: 'lightgray',
  },
  btnUpGrade: {
    flexDirection:'row',
    marginTop:40,
    height: 80,
    width: '100%',
    backgroundColor: 'lightgray',
  },
  btnAdd: {
    marginTop: 5,
    color: 'white',
    fontSize: 17,

    width:'100%',
    height: 50,
    textAlign: 'center',
  },
  txtBtnOp: {
    fontFamily:'Montserrat-Medium',
    paddingLeft:60,
    width:'100%',
    color: 'black',
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

export default OnboardingPickLevelScreen;
