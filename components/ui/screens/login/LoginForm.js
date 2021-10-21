import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

const widthWindow = Dimensions.get('window').width;

const LoginForm = ({style: customStyle, absolute = false, children}) => {
  return (
    <View
      style={[styles.container, absolute && styles.absolute, {...customStyle}]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: widthWindow * 0.9,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingBottom: 12,
    elevation: 1,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: '#000',
    shadowOffset: {height: 10, width: 0},
  },
  absolute: {
    position: 'absolute',
    top: -80 + widthWindow / 2,
  },
});

export default LoginForm;
