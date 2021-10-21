import React from 'react';
import {View, Modal, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {ROYAL_BLUE} from 'utils/colors';

const FinsusBaseModal = ({
  visible,
  done,
  children,
  cancelText = 'Cerrar',
  showAccept = false,
  acceptText = 'Aceptar',
  onAccept = () => {},
  customStyle = {container: {}, button: {}, text: {}},
}) => {
  return (
    <Modal visible={visible} onRequestClose={() => null} transparent={true}>
      <View style={styles.overflow}>
        <View style={[styles.container, customStyle.container]}>
          {children}
          <View style={styles.buttonsContainer}>
            <TouchableHighlight
              style={{flex: 1}}
              onPress={done}
              underlayColor={'transparent'}>
              <View style={styles.buttonContainer}>
                <View style={[styles.button, customStyle.button]}>
                  <Text style={[styles.buttonText, customStyle.text]}>
                    {cancelText}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
            {showAccept && (
              <TouchableHighlight
                style={{flex: 1}}
                onPress={onAccept}
                underlayColor={'transparent'}>
                <View style={styles.buttonContainer}>
                  <View style={[styles.button, customStyle.button]}>
                    <Text style={[styles.buttonText, customStyle.text]}>
                      {acceptText}
                    </Text>
                  </View>
                </View>
              </TouchableHighlight>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overflow: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    borderRadius: 10,
    backgroundColor: ROYAL_BLUE,
    padding: 25,
    width: '90%',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  text: {fontSize: 16, fontFamily: 'Montserrat-Medium', color: 'white'},
  buttonContainer: {
    width: '100%',
    paddingTop: 16,
    alignItems: 'center',
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 10,
    minWidth: 100,
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
});

export default FinsusBaseModal;
