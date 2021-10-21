import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';
import ConfirmNumberKeyboard from 'components/ui/screens/onboarding/confirmNumber/ConfirmNumberKeyboard';

const FinsusKeyboard = ({show, itemKeys, theme}) => {
  return (
    <Modal onRequestClose={() => null} visible={show} transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.keyboardContainer}>
            <ConfirmNumberKeyboard items={itemKeys} theme={theme} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'red',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 24,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    width: '80%',
  },
});

export default FinsusKeyboard;
