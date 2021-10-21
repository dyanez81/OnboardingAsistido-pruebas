import React, {useState} from 'react';
import {View, Text, StatusBar, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useBackpress} from 'hooks/use-backpress';
import FinsusLoading from 'components/ui/modals/FinsusLoading';
import FinsusBaseModal from 'components/base/FinsusBaseModal';

const OnboardingVideoCallScreen = ({navigation}) => {
  // Parameters
  const url = navigation.getParam('param');

  // Component state
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // Hooks
  useBackpress(() => {
    return true;
  });

  // Methods
  const onClose = () => {
    setShowConfirm(true);
  };

  const onNext = () => {
    setShowConfirm(false);
    navigation.replace('onboardVideocallSaved');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden={true} />
      <View style={styles.iconContainer}>
        <Icon name="close" size={32} color={'#000'} onPress={onClose} />
      </View>
      <WebView
        cacheEnabled={false}
        cacheMode={'LOAD_NO_CACHE'}
        source={url ? {uri: url} : null}
        onLoad={() => setLoading(false)}
      />
      <FinsusLoading loading={loading} text={'Cargando...'} />
      <FinsusBaseModal
        visible={showConfirm}
        done={() => setShowConfirm(false)}
        showAccept={true}
        onAccept={onNext}>
        <Text style={styles.modalText}>¿Ha finalizado la videollamada?</Text>
      </FinsusBaseModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 10,
  },
  iconContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 35 : 15,
    right: 15,
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 30,
    zIndex: 1,
  },
  modalText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
    letterSpacing: 0.15,
    textAlign: 'center',
    color: '#fff',
    marginVertical: 16,
  },
});

export default OnboardingVideoCallScreen;
