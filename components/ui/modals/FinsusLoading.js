import React from 'react';
import {View, Modal, Text, ActivityIndicator, StyleSheet} from 'react-native';

const FinsusLoading = ({loading, text}) => {
  return (
    <Modal onRequestClose={() => null} visible={loading} transparent={true}>
      <View style={styles.container}>
        <View style={{borderRadius: 10, backgroundColor: 'white', padding: 25}}>
          <Text style={{fontFamily: 'Montserrat-Regular',fontSize: 17, fontWeight: '400'}}>
            {text ? text : 'Cargando...'}
          </Text>
          <ActivityIndicator size="large" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FinsusLoading;
