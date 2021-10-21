import React from 'react';
import {View, StyleSheet} from 'react-native';
import FinsusButtonSecondary from './FinsusButtonSecondary';

const FinsusBottomButton = ({text = 'Ok', onPress}) => {
  return (
    <View style={styles.container}>
      <FinsusButtonSecondary
        text={text}
        onPress={onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    bottom: 8,
    marginVertical: 10,
  },
});

export default FinsusBottomButton;
