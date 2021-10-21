import React, { useEffect } from 'react';
import {View,Text, StyleSheet, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  onboardCloseModal,
  onboardOpenModal,
  onboardRegisterSignature,
  onboardSetOnPress,
  onboardStartLoading,
  onboardEndLoading,
  onboardSetDocumentData,
} from 'store/actions';
import moment from 'moment';
import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import SelfieAvatar from 'components/ui/screens/onboarding/selfie/SelfieAvatar';
import OnboardingOptions from 'components/ui/screens/onboarding/OnboardingOptions';
import {useBackpress} from 'hooks/use-backpress';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import NavigationService from 'router/NavigationService';
import {RepositoryFactory} from 'repository/RepositoryFactory';
import DocumentPicker from 'react-native-document-picker';
import ContractImage from 'assets/icons/conntratos.png';
var RNFS = require('react-native-fs');

const OnboardingLegalListScreen = ({navigation}) => {
  // Parameters
  const level1 = navigation.getParam('levelOne', true);
  const OnboardRepository = RepositoryFactory.get('onboard');
  
  // Redux state
  const userPhone = useSelector(state => state.onboarding.userData.phone);
  const idAsociado = useSelector(state => state.onboarding.userData.idAsociado);
  const userCurp = useSelector(state => state.onboarding.userData.curp);
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  const items = useSelector(state => state.onboarding.termsConditions.items);
  const dispatch = useDispatch();

  const goToSignature = () => {
    NavigationService.navigate('onboardingSignature', {
      type: 'econtract',
    });
  }

  const downloadContract = async() => {
    dispatch(onboardStartLoading());
    try {
      if (items[0]) {
        if (items[0].data) {
          const cont = items[0].data;
          const request = {
            phone: userPhone,
            signature: JSON.stringify(cont),
            signatureDigital: JSON.stringify(cont),
            type: threeAccountLevel ? '0' : '1'
          };
          const {data} = await OnboardRepository.ActivateNewAccountLevel3(request);
          dispatch(onboardEndLoading());
          if (data.statusCode === '000') {
            const _info = {
              datetime: moment().format(),
            };
            if (data.pdf) {
              dispatch(onboardSetDocumentData(data.pdf, _info, 1));
              dispatch(onboardStartLoading());
              var path = RNFS.DocumentDirectoryPath + '/contract.pdf';
              RNFS.writeFile(path, data.pdf,'base64')
                .then((success) => {
                  dispatch(onboardEndLoading());
                  NavigationService.navigate('onboardingPdfContract', {
                    pdf: data.pdf,
                    path: path,
                  });
                })
                .catch((err) => {
                  dispatch(onboardEndLoading());
                  dispatch(onboardOpenModal('Error al convertir archivo'));
                })
            }
          } else {
            dispatch(onboardOpenModal(data.messageCode));
          }
        } else {
          dispatch(onboardOpenModal('Es necesario capturar la firma'));
        }
      } else {
        dispatch(onboardOpenModal('Es necesario capturar la firma'));
      }
    } catch (err) {
      dispatch(onboardEndLoading());
    }
  }

  const uploadContract = async() => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (res) {
        if (res[0]) {
          dispatch(onboardStartLoading());
          RNFS.readFile(res[0].uri,'base64')
          .then((success) => {
            dispatch(onboardEndLoading());
            sendContract(success);
          })
          .catch((err) => {
            dispatch(onboardEndLoading());
            dispatch(onboardOpenModal('Error al convertir archivo'));
          })
        }
      }
    } catch (err) {
      console.log('err', err);
    }
  }

  const sendContract = async(doc) => {
    dispatch(onboardStartLoading());
    try {
      const body = {
        curp: userCurp.toUpperCase(),
        level: "3",
        docPdf: doc
      }
      const {data} = await OnboardRepository.UpdateContract(body);
      if (data.statusCode === '000') {
        const _info = {
          datetime: moment().format(),
        };
        dispatch(onboardSetDocumentData('Check', _info, 2));
      } else {
        dispatch(onboardOpenModal(data.messageCode));
      }
      dispatch(onboardEndLoading());
    } catch (err) {
      dispatch(onboardEndLoading());
    }
  }

  useEffect(() => {
    if (items) {
      if (items[0]) {
        dispatch(onboardSetOnPress(goToSignature,0));
      }
      if (items[1]) {
        dispatch(onboardSetOnPress(downloadContract,1));
      }
      if (items[2]) {
        dispatch(onboardSetOnPress(uploadContract,2));
      }
    }
  }, []);

  const imgSelfie = useSelector(
    state => state.onboarding.ineSelfieData.items[0].data,
  );
  const firstName = useSelector(state => state.onboarding.userData.name);

  // Hooks
  useBackpress(() => {
    return true;
  });

  const acceptLegals = () => {
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardOpenModal(errorForm));
      return;
    }
    const signInfo = {userPhone, idAsociado, items, levelOne: level1, activateAcc: true};
    dispatch(onboardRegisterSignature(signInfo));
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!items[0].data) {
      isError = true;
      errorForm += ', Firma de Contrato';
    }
    if (!items[1].data) {
      isError = true;
      errorForm += ', Firma de Contrato de Servicios electrónicos';
    }

    if (isError && errorForm.length > 0) {
      errorForm =
        'Los siguientes campos son obligatorios:\n\n' +
        errorForm.substring(2) +
        '.';
    }

    return {
      isError,
      errorForm,
    };
  };

  const getName = firstName => {
    const name = firstName.trim().split(' ')[0];

    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  return (
    <OnboardingLevelOne
      isBackPress
      onBackPress={onBackPress}
      title={`Contratos`}
      loading={loading && navigation.isFocused()}
      navigation={navigation}>
      <View style={styles.container}>
        <Image source={ContractImage} style={styles.imagetitle}></Image>
        <View style={styles.informationTitleContainer}>
          <Text
            style={[
              styles.informationTitle,
              {
                marginBottom: 2,
              },
            ]}
          />
          <Text style={styles.informationTitle}>{'Ahora por favor descarga el\ncontrato y pide al usuario que\nlo firme.'}</Text>
        </View>
        <OnboardingOptions items={items.slice(0, 3)}/>
        <View style={styles.buttonContainer}>
          {items[0].data && items[1].data && items[2].data && (
            <FinsusButtonSecondary
              text={'Ok'}
              onPress={acceptLegals}
            />
          )}
        </View>
      </View>
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}
        text={messageError}
      />
    </OnboardingLevelOne>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  imagetitle:{
    marginTop:-100,
    marginLeft:'80%',
    width: 60,
    height: 60,
  },
  titulo:{
    fontSize:25,
    fontFamily:'Montserrat-Medium',
    color:'black',
  },
  informationTitleContainer: {
    marginBottom: 40,
  },
  informationTitle: {
    paddingLeft:15,
    marginTop:15,
    fontSize: 15,
    textAlign: 'left',
    color: 'black',
  },
  buttonContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContainer: {
    width: '100%',
    marginVertical: 20,
    flexDirection: 'column',
    alignSelf: 'center',
    borderRadius:0,
  },
  text:{
    textAlign:'left',
    fontFamily:'Montserrat-Regular',
    marginLeft: 8,
  },
});

export default OnboardingLegalListScreen;
