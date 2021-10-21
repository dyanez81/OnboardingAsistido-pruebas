import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';

const BaseInputMaterial = ({children, baseStyle: customStyle}) => {
  return <View style={[styles.baseInput, {...customStyle}]}>{children}</View>;
};

const styles = StyleSheet.create({
  baseInput: {
    width: '90%',
    fontFamily: 'Montserrat-Regular',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: Platform.OS === 'ios' ? 16 : 0,
    marginBottom: 4,
  },
});

export default BaseInputMaterial;
