import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FinsusLoading from 'components/ui/modals/FinsusLoading';

const FinsusWebViewScreen = ({navigation}) => {
  // Parameters
  const url = navigation.getParam('url', 'https://www.finsus.app/');
  const onClose = navigation.getParam('onClose', () => navigation.goBack());

  // Component state
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="close" size={32} color={'#000'} onPress={onClose} />
      </View>
      <WebView
        cacheEnabled={false}
        cacheMode={'LOAD_NO_CACHE'}
        source={url ? {uri: url} : null}
        style={{margin: 10}}
        onLoad={() => setLoading(false)}
      />
      <FinsusLoading loading={loading} text={'Cargando...'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginVertical: 5,
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
});

export default FinsusWebViewScreen;
