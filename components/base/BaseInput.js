import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';

const BaseInput = ({children, style: customStyle}) => {
  return <View style={[styles.baseInput, {...customStyle}]}>{children}</View>;
};

const styles = StyleSheet.create({
  baseInput: {
    width: '90%',
    borderColor: '#eaecef',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    fontFamily: 'Montserrat-Regular',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 16 : 0,
  },
});

export default BaseInput;
