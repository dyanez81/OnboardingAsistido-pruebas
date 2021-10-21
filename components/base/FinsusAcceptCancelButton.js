import React from 'react';
import {View, StyleSheet} from 'react-native';
import FinsusButtonSecondary from './FinsusButtonSecondary';

const FinsusAcceptCancelButton = ({
  acceptText = 'Aceptar',
  cancelText = 'Cancelar',
  onAcceptPress,
  onCancelPress,
  showCancel = true,
  disabledAccept = false,
}) => {
  return (
    <View style={styles.buttonsContainer}>
      {showCancel && (
        <View style={styles.buttonArea}>
          <FinsusButtonSecondary
            text={cancelText}
            color={'gray'}
            textColor={'#fff'}
            textSize={14}
            onPress={onCancelPress}
          />
        </View>
      )}
      <View style={styles.buttonArea}>
        <FinsusButtonSecondary
          text={acceptText}
          color={'#0095CA'}
          textColor={'#fff'}
          textSize={14}
          disabled={disabledAccept}
          onPress={onAcceptPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonArea: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 30,
    alignItems: 'center',
  },
});

export default FinsusAcceptCancelButton;
