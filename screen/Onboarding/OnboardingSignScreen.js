import React, {useEffect, useState} from 'react';
import {View, Text, Image, Alert,StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import SignaturePad from 'react-native-signature-pad';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import {
  onboardOpenModal,
  onboardCloseModal,
  onboardSetDocumentData,
  onboardSetActiveDocument,
} from 'store/actions';
import FinsusAccepCancelButton from 'components/base/FinsusAcceptCancelButton';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import FinsusLoading from 'components/ui/modals/FinsusLoading';
import {SECONDARY_COLOR} from 'utils/colors';

const OnboardingSignScreen = ({navigation}) => {
  // Parameters
  const typeMessage = navigation.getParam('type', 'contract');
  
  // Redux state
  const loading = useSelector(state => state.onboarding.loading);
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);

  // Component state
  const [signature, setSignature] = useState(null);
  const [showSign, setShowSign] = useState(false);
  const dispatch = useDispatch();

  // Hooks
  useEffect(() => setShowSign(true), []);

  const onSaveSignature = () => {
    try {
      if (!signature)
        Alert.alert('La firma no puede estar vacía');
      else {
        const _info = {
          datetime: moment().format(),
        };
        switch (typeMessage) {
          case 'contract':
            console.log('estatus 0')
            dispatch(onboardSetDocumentData(signature, _info, 0));
            dispatch(onboardSetActiveDocument(1));
            break;
          case 'econtract':
            console.log('estatus 1')
            dispatch(onboardSetDocumentData(signature, _info, 0));
        }
        Orientation.lockToPortrait();
        navigation.pop(1);
      }
    } catch (ex) {
      Alert.alert('Error: ' + ex.toString());
      console.log('CATCH SIGN::', ex);
    }
  };

  const onEraseSignature = () => {
    setShowSign(!showSign);
    setSignature('');
  };

  const onCancelSignature = () => {
    Orientation.lockToPortrait();
    navigation.goBack();
  };

  const _signaturePadError = error => {
    console.error(error);
  };

  const _signaturePadChange = ({base64DataUrl}) => {
    setSignature(base64DataUrl.split(',')[1]);
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('assets/icons/touch-landscape.png')}
        style={styles.icon}
      />
      <View style={styles.instructionContainer}>
        <Text style={styles.instructions}>
          {`Captura la firma del usuario`}.
        </Text>
      </View>
      <View style={styles.wrapper}>
        {showSign && (
          <SignaturePad
            onError={_signaturePadError}
            onChange={_signaturePadChange}
            style={styles.canvas}
          />
        )}
        {!showSign && (
          <SignaturePad
            onError={_signaturePadError}
            onChange={_signaturePadChange}
            style={styles.canvas}
          />
        )}
      </View>
      <View style={styles.eraseContainer}>
        <Icon
          name="delete"
          size={36}
          color={SECONDARY_COLOR}
          onPress={onEraseSignature}
        />
      </View>
      <FinsusAccepCancelButton
        onAcceptPress={onSaveSignature}
        onCancelPress={onCancelSignature}
      />
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}
        text={messageError}
      />
      <FinsusLoading loading={loading && navigation.isFocused()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginVertical: 5,
    width: '100%',
    height: '100%',
  },
  instructionContainer: {
    height: 25,
    alignItems: 'center',
  },
  instructions: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
  wrapper: {
    marginTop: 1.5,
    marginHorizontal: 15,
    flex: 1,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#0095CA',
    overflow: 'hidden',
  },
  canvas: {
    backgroundColor: 'white',
  },
  icon: {
    position: 'absolute',
    top: '10%',
    left: '3%',
    width: 48,
    height: 48,
    zIndex: 2,
  },
  eraseContainer: {
    position: 'absolute',
    bottom: '27%',
    right: '4%',
    width: 54,
    height: 54,
    borderRadius: 54,
    backgroundColor: '#00000011',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});

export default OnboardingSignScreen;
