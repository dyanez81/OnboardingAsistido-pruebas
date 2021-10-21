import React from 'react';
import {Text, StyleSheet} from 'react-native';

const SelfieTitle = ({text}) => {
  return <Text style={styles.container}>{text}</Text>;
};

const styles = StyleSheet.create({
  container: {
    fontSize: 21,
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 12,
  },
});

export default SelfieTitle;
