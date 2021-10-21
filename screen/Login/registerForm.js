import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  Switch,
  Alert,
  StatusBar
} from 'react-native';
import {validateEmail} from '../../utils/validations';
import firebase from '../../utils/firebaseO';
import Loader from 'components/base/Loader';


export default function RegisterForm({navigation}) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [formData, setformData] = useState(defaultValue);
  const [formError, setformError] = useState({});
  const [loading, setloading] = useState(false);
 
  const submitHandler = () => {
    setformData(defaultValue);
    setloading(false);
   }

   const alertError = () =>
   Alert.alert(
     "Lo sentimos",
     "Ocurrio un problema al intentar crear la cuenta, por favor intenta de nuevo más tarde",
     [
       { text: "OK", onPress: () => submitHandler() }
     ]
   );
   
   const alertSuccess = () =>
   Alert.alert(
     "Felicidades",
     "Nuevo usuario registrado",
     [
       { text: "OK", onPress: () => {
         submitHandler();
         setloading(false)
        }}
     ]
     
   );

  const register = () => {
    let errors = {};
    console.log(formData);
    console.log('si entro al register')
    if (!formData.email || !formData.password || !formData.repeatPassword) {
      if (!formData.email) errors.email = true;
      if (!formData.password) errors.password = true;
      if (!formData.repeatPassword) errors.repeatPassword = true;
      Alert.alert('Lo sentimos', 'ningun campo puede estar vacio', [
        {text:'Ok', onPress: () => {
          setloading(false);
        }}
      ]);
    } else if (!validateEmail(formData.email)) {
      errors.email = true;
      console.log('Se queda aqui email');
      Alert.alert('Lo sentimos', 'El formato de la cuenta de correo no es correcto, valida e intenta nuevamente', [
        {text:'Ok', onPress: () => {
          setloading(false);
        }}
      ]);
    } else if (formData.password !== formData.repeatPassword) {
      errors.password = true;
      errors.repeatPassword = true;
      console.log('Se queda aqui la contraseña esta mal');
      Alert.alert('Lo sentimos', 'Las contraeñas no coincideo por favor intenta nuevamente', [
        {text:'Ok', onPress: () => {
          setloading(false);
        }}
      ]);
    } else if (formData.password.length < 6) {
      errors.password = true;
      errors.repeatPassword = true;
      console.log('Se queda aqui la contraseña es menor a 6 caracteres');
      Alert.alert('Lo sentimos', 'La contraseña debe ser de 6 caracteres como minimo', [
        {text:'Ok', onPress: () => {
          setloading(false);
        }}
      ]);
    } else {
      setloading(true);
      console.log('si hace la peticion');
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
          alertSuccess();
          console.log('cuenta creada');
          submitHandler();
        })
        .catch(() => {
          setformError({
            email: true,
            password: true,
            repeatPassword: true,
          });
          
          alertError();
        });
    }
    setformError(errors);
  };
  return (
    <>
    <StatusBar barStyle="light-content" hidden={true} />
      <View style={styles.container}>
        <Loader loading={loading}></Loader>
        {isEnabled ? <Text style={styles.textButton}>Registrar Asesor</Text> : 
            <Text style={{backgroundColor:'#0070ce'}}></Text>}
        <Text style={styles.text}>Registra a un usuario</Text>
        <TextInput
          style={[styles.input, formError.email && styles.error]} //se pone & por que se valida solo el if
          placeholder="Correo electronico"
          placeholderTextColor="#969696"
          onChange={e => setformData({...formData, email: e.nativeEvent.text})}
          value={formData.email}
        />
        <TextInput
          style={[styles.input, formError.password && styles.error]}
          placeholder="Contraseña"
          placeholderTextColor="#969696"
          secureTextEntry={true}
          onChange={e =>
            setformData({...formData, password: e.nativeEvent.text})
          }
          value={formData.password}
        />
        <TextInput
          style={[styles.input, formError.repeatPassword && styles.error]}
          placeholder="Repite Password"
          placeholderTextColor="#969696"
          secureTextEntry={true}
          onChange={e =>
            setformData({...formData, repeatPassword: e.nativeEvent.text})
          }
          value={formData.repeatPassword}
        />
        <View style={styles.viewSwitch}>
          <Text style={styles.textSwitch}>{'Es administrador'}</Text>
          <Switch
            trackColor={{false: '#969696', true: 'green'}}
            thumbColor={isEnabled ? 'white' : 'white'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
          <TouchableHighlight style={styles.button} onPress={register}>
            <Text style={styles.btnText}>Registrar Asesor</Text>
          </TouchableHighlight>

          <View style={styles.login}>
            <TouchableHighlight style={styles.button} onPress={() => navigation.replace('onboardPickLevel')}>
            <Text style={styles.btnText}>Volver</Text>
          </TouchableHighlight>
        </View>
      </View>
    </>
  );
}

function defaultValue() {
  return {
    email: '',
    password: '',
    repeatPassword: '',
    isAdmin: false,
    loading: false
  };
}


const styles = StyleSheet.create({
  btnText: {
    paddingTop:2,
    textAlign:'center',
    color: '#fff',
    fontSize: 20,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 	'rgba(0, 0, 0, 0.25)',
    opacity:0.7,
    padding: 8,
  },
  spinnerTextStyle: {
    color: 'black',
  },
  text:{
    color:'white',
    fontSize:20,
    marginBottom:30,
  },
  login: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 22,
  },
  container: {
    alignItems: 'center',
    backgroundColor:'#283460' ,
    height: '100%',
    paddingVertical: 110,
  },
  input: {
    height: 50,
    color: '#000',
    width: 320,
    marginBottom: 25,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderRadius: 8,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#1e3040',
  },
  error: {
    borderColor: 'red',
  },
  button:{
    marginTop: 85,
    backgroundColor: '#0070ce',
    paddingTop: 5,
    width: 320,
    height: 45,
  },
  viewSwitch: {
    flexDirection: 'row',
    alignContent:'space-between',
    alignItems:'flex-end',
  },
  textSwitch: {
    paddingRight: 120,
    color: 'white',
    fontWeight: '100',
    fontSize: 17,
  },
});
