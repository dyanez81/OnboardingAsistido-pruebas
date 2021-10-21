import React from 'react';
import {Text, TouchableHighlight, Image, StyleSheet} from 'react-native';
import {isNullorEmpty} from 'utils/methods';

import BaseInputMaterial from './BaseInputMaterial';
import {SECONDARY_COLOR} from 'utils/colors';

const FinsusTouchableTextMaterial = ({
  value,
  placeholder = 'Ingrese campo',
  onPress,
  showIcon = true,
  icon = require('./../../assets/icons/lock.png'),
  textcolor = 'rgb(172, 177, 192)',
  textalign = 'left',
  styles: customStyles,
  ...props
}) => {
  return (
    <BaseInputMaterial {...props}>
      {showIcon && <Image source={icon} style={[style.icon, iconStyle]} />}
      {!isNullorEmpty(placeholder) && !isNullorEmpty(value) && (
        <Text style={style.label}>{placeholder}</Text>
      )}
      <TouchableHighlight style={style.datebirthTouch} onPress={onPress}>
        <Text
          style={[style.datebirth, {color: textcolor, textAlign: textalign}]}>
          {value ?? placeholder}
        </Text>
      </TouchableHighlight>
    </BaseInputMaterial>
  );
};

const style = StyleSheet.create({
  datebirthTouch: {
    paddingBottom: 5.5,
    paddingRight: 16,
    paddingLeft: 0,
    paddingTop: 0,
    borderBottomColor: '#0070CD',
    borderBottomWidth: 1,
    width: '87%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  datebirth: {
    width: '100%',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    paddingVertical: 6,
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: 6,
    width: 18,
    height: 18,
  },
  label: {
    position: 'absolute',
    top: -8,
    width: '87%',
    fontFamily: 'Montserrat-Regular',
    fontSize: 10,
    color: SECONDARY_COLOR,
  },
});

export default FinsusTouchableTextMaterial;
