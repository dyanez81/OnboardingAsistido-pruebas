import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SECONDARY_COLOR} from 'utils/colors';

const FinsusProgressBar = ({
  progressPercent = 1,
  progressText = '',
  subtitle = '',
  activeColor = SECONDARY_COLOR,
  inactiveColor = '#c0c0c0',
  customStyle = {},
}) => {
  return (
    <View style={[{width: '90%'}, customStyle]}>
      <View style={{height: 3, backgroundColor: inactiveColor}}>
        <View
          style={[
            styles.activeContainer,
            {width: `${progressPercent}%`, backgroundColor: activeColor},
          ]}>
          <View style={[styles.trackBall, {backgroundColor: activeColor}]}>
            <Text style={[styles.progressText, {color: activeColor}]}>
              {progressText}
            </Text>
          </View>
        </View>
      </View>
      <Text style={[styles.subtitle, {color: activeColor}]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  activeContainer: {
    height: 3,
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    maxWidth: '100%',
  },
  trackBall: {
    top: -7,
    height: 16,
    width: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  progressText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 11,
    textAlign: 'center',
    top: -20,
    width: 30,
  },
  subtitle: {
    fontFamily: 'Montserrat-Light',
    fontSize: 11,
    textAlign: 'center',
    top: 15,
  },
});

export default FinsusProgressBar;
