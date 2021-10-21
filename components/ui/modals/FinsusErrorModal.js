import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FinsusBaseModal from 'components/base/FinsusBaseModal';

const FinsusErrorModal = ({visible, text, done}) => {
  return (
    <FinsusBaseModal visible={visible} done={done}>
      <View>
        <Text style={styles.text}>
          {text ? text : 'Error desconocido. Por favor reintente.'}
        </Text>
      </View>
    </FinsusBaseModal>
  );
};

const styles = StyleSheet.create({
  text: {fontSize: 16, fontFamily: 'Montserrat-Medium', color: 'white'},
});

export default FinsusErrorModal;
