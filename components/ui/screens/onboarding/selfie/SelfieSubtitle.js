import React from 'react';
import {Text, StyleSheet} from 'react-native';

const SelfieSubtitle = ({text}) => {
  return <Text style={styles.container}>{text}</Text>;
};

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },
});

export default SelfieSubtitle;
