import React from 'react';
import {Text, StyleSheet} from 'react-native';

const FinsusTitle = ({title, style: customStyle}) => {
  return <Text style={[styles.finsusTitle, {...customStyle}]}>{title}</Text>;
};

const styles = StyleSheet.create({
  finsusTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 26,
    fontFamily: 'Montserrat-Regular',
  },
});

export default FinsusTitle;
