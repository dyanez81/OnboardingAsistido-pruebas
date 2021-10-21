import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import HelpOption from './HelpOption';

const Help = ({style: customStyle, customHeader, customOptions}) => {
  return (
    <View style={[styles.container, {...customStyle.container}]}>
      <Text style={[customStyle.title, styles.title]}>{customHeader}</Text>
      <View style={styles.options}>
        <View style={styles.optionsContainer}>
          {customOptions.map((option, i) => (
            <HelpOption
              text={option.title}
              icon={option.icon}
              customStyle={customStyle}
              onPress={option.onPress}
              key={i}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    marginBottom: 16,
  },
  options: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  optionsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default Help;
