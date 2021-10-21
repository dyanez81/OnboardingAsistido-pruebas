import React from 'react';
import {View, Dimensions, Platform, StyleSheet} from 'react-native';
import {PRIMARY_COLOR} from 'utils/colors';

const _w = Dimensions.get('screen').width;
const FinsusStatusBar = ({color = PRIMARY_COLOR, height = 50}) => {
  return Platform.OS == 'ios' ? (
    <View
      style={{
        ...styles.statusbar,
        height: height,
        backgroundColor: color,
      }}
    />
  ) : null;
};

const styles = StyleSheet.create({
  statusbar: {
    width: _w,
  },
});

export default FinsusStatusBar;
