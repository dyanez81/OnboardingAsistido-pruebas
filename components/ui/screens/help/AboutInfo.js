import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SECONDARY_COLOR} from 'utils/colors';

const AboutInfo = ({title, subtitle}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
    letterSpacing: 0.15,
    color: '#000',
  },
  subtitle: {
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
    letterSpacing: 0.15,
    color: SECONDARY_COLOR,
  },
});

export default AboutInfo;
