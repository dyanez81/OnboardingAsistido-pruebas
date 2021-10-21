import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableHighlight,
  Alert,
  Keyboard,
  StatusBar
} from 'react-native';
import firebase from 'utils/firebaseO';
import { validateEmail } from '../../utils/validations'
import 'firebase/auth';
import {SafeAreaView} from 'react-navigation';
import Loader from 'components/base/Loader';

global.threeAccountLevel  = false;
global.levelAccount = '2';
global.telefono = '';
global.nameRegisterUser = '';
global.curpRegisterUser = '';
const login = ({navigation}) => {

  const [showPass, setShowPass] = useState(false);
  const [formData, setformData] = useState(defautlValue);
  const [formError, setformError] = useState({})
  const [loading, setloading] = useState(false);
  const [text, setText] = useState('');


  const onChange = (e, type) => {
    setformData({...formData, [type]: e.nativeEvent.text})
  }

  const handleSumit = () => {
    // perform the summit operation
    formData.email = '';
    formData.password = '';
}

  const login = () => {
    let errors = {};
    if (!formData.email || !formData.password) {
        if (!formData.email) errors.email = true;
        if (!formData.email) errors.password = true;
        Alert.alert('Oops!', 'Ningún campo puede estar vacio', [
          {text:'Ok', onPress: () => console.log('Campos vacios')}
        ]);
    }else if (!validateEmail(formData.email)) {
        errors.email = true;
        Alert.alert('Oops!', 'Revisa el formato de tu cuenta de correo', [
          {text:'Ok', onPress: () => console.log('email con formato erroneo')}
        ]);
    } else if (formData.password.length < 6) {
      errors.password = true;
      Alert.alert('Oops!', 'La contraseña es incorrecta, revisa e intenta nuevamente por favor', [
        {text:'Ok', onPress: () => console.log('Se queda aqui la contraseña es menor a 6 caracteres')}
      ]);
    } else {
      setloading(true);
        firebase.auth()
            .signInWithEmailAndPassword(formData.email, formData.password)
            .then(() => {
                navigation.replace('onboardPickLevel');
            })
            .catch((e) => {
              const error = e.toString();
                console.log(error);
                if(error == 'Error: The password is invalid or the user does not have a password.'){
                  Alert.alert('Lo sentimos', 'La contraseña es incorrecta, revisa e intenta nuevamente por favor', [
                    {text:'Ok', onPress: () => {
                      setloading(false);
                    }}
                  ]);
                }else if(error == 'Error: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.'){
                  Alert.alert('Lo sentimos', 'Se supero el número de intentos de inicio de sesión, por favor comunicate con el administrador', [
                    {text:'Ok', onPress: () =>  {
                      setloading(false);
                    }}
                  ]);
                }else if(error == 'Error: There is no user record corresponding to this identifier. The user may have been deleted.'){
                  Alert.alert('Lo sentimos', 'La cuenta de correo no está registrada, por favor valida e intenta nuevamente', [
                    {text:'Ok', onPress: () =>  {
                      setloading(false);
                    }}
                  ]);
                }
            });
    }
    setformError(errors);
};
const getData = async () => {
  try {
    const value = await AsyncStorageStatic.getItem('correo');
    if (value !== null) {
      // We have data!!
      defautlValue.email = value
    }
  } catch (error) {
    // Error retrieving data
    console.log(error)
  }
};

function adminUser(){
  if (formData.email == 'dyanez@dimmer.mx' || formData.email == 'gmarmolejo@dimmer.mx'){
    console.log('si reconoce el email de admin');
    userAdmin = false;
    login();
  }else{
    console.log('NO reconoce el email de admin')
    userAdmin = false;
    login();
  }
}

function defautlValue(){
  return{
      email:"",
      password:"",
  }
}

  return (
    <>
      <SafeAreaView  style={styles.container}>
      <StatusBar barStyle="light-content" hidden={true} />
        <Loader loading={loading}></Loader>
        <Image style={styles.logo} source={require('/assets/images/LogoHD_FS.png')}/><Image />
        <TextInput
          style={styles.textID}
          placeholder="Correo electrónico"
          keyboardType={'email-address'}
          underlineColorAndroid = "transparent"
          autoCapitalize='none'
          placeholderTextColor="lightgray"
          onChange={(e) => {onChange(e, 'email');
          }}
          returnKey={Keyboard.dismiss}
        />
        <TextInput
          style={styles.textPass}
          placeholder="Contraseña"
          underlineColorAndroid = "transparent"
          maxLength={10}
          placeholderTextColor="lightgray"
          secureTextEntry={!showPass}
          onChange={(e) => {onChange(e, 'password')
          }}
          returnKey={Keyboard.dismiss}
        />
        <TouchableHighlight style={styles.touchImg} onPress={() => setShowPass(!showPass)}>
          <Image style={styles.imgShow}
            source={showPass
                ? require('assets/icons/show-password.png')
                : require('assets/icons/hide-password.png')
            }
          ></Image>
        </TouchableHighlight>
        <TouchableHighlight style={styles.textOnPress} onPress={adminUser}>
          <Text style={styles.textButton}>Iniciar Sesión</Text>
        </TouchableHighlight>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor:'white' ,
    height: '100%',
  },
  viewSwitch: {
    marginTop:30,
    alignContent: 'center',
    flexDirection: 'row',
  },
  textSwitch: {
    paddingTop: 2,
    color: 'white',
    fontWeight: '100',
    fontSize: 15,
  },
  touchImg:{
    width:40,
    marginTop:5,
    position:'relative',
    alignContent:'flex-end',
  },
  imgShow:{
    width:40,
    height:40,
  },
  textButton: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: 20,
    paddingTop:5,
    
  },
  textID: {
    marginTop: 120,
    textAlign:'center',
    marginBottom: 20,
    fontFamily: 'Montserrat-Regular',
    color:'#0070CD',
    fontSize:17,
    width: 300,
    height: 40,
    borderBottomColor: '#0070CD',
    borderBottomWidth: 0.5
  },
  textPass: {
    marginTop: 20,
    textAlign:'center',
    fontFamily: 'Montserrat-Regular',
    color:'#0070CD',
    fontSize:17,
    marginBottom: 20,
    width: 300,
    height: 40,
    borderBottomColor: '#0070CD',
    borderBottomWidth: 0.5
  },
  logo:{
    width: 250,
    height: 170,
    resizeMode:'contain'
  },
  textOnPress: {
    marginTop:90,
    backgroundColor: '#0070CD',
    paddingTop: 5,
    width: 320,
    height: 45,
    borderRadius:5
  },
});

export default login;
