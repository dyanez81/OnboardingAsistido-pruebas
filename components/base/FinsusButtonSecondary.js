import React from 'react';
import {StyleSheet} from 'react-native';

import {SECONDARY_COLOR} from './../../utils/colors';

import {Button} from 'react-native-material-ui';

const FinsusButtonSecondary = ({
  onPress,
  color = '#0070CD',
  textColor,
  textSize,
  textAlign,
  disabled = false,
  ...props
}) => {
  return (
    <Button
      {...props}
      upperCase={false}
      style={{
        container: [{...styles.container, backgroundColor: color}, props.style],
        text: [
          {
            ...styles.text,
            color: textColor ? textColor : 'white',
            fontSize: textSize ? textSize : 18,
            textAlign: textAlign ? textAlign : 'left',
          },
        ],
      }}
      accent={false}
      disabled={disabled}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat-Medium',
    color: 'white',
    fontSize: 18,
  },
  container: {
    backgroundColor: '#0070CD',
    width: '100%',
    height: 40,
    marginBottom: 12,
  },
});

export default FinsusButtonSecondary;
