import React, {useEffect, useRef} from 'react';
import {TextInput, Image, Text, StyleSheet} from 'react-native';
import {isNullorEmpty} from 'utils/methods';

import BaseInputMaterial from './BaseInputMaterial';
import {SECONDARY_COLOR} from 'utils/colors';

const FinsusInputTextMaterial = ({
  value,
  onChange,
  placeholder = '',
  placeholderTextColor = 'rgb(172, 177, 192)',
  secureTextEntry,
  keyboardType,
  maxLength,
  editable = true,
  showIcon = true,
  autoCapitalize = 'sentences',
  returnKey = 'default',
  contextMenuHidden = false,
  onSubmitEditing,
  blurOnSubmit = true,
  getRef,
  styles: customStyles,
  icon = require('./../../assets/icons/lock.png'),
  iconStyle,
  ...props
}) => {
  let refInput = useRef(null);

  useEffect(() => {
    if (getRef != null) {
      getRef(refInput);
    }
  }, [refInput]);

  return (
    <BaseInputMaterial {...props}>
      {showIcon && <Image source={icon} style={style.icon} />}
      {!isNullorEmpty(placeholder) && !isNullorEmpty(value) && (
        <Text style={style.label}>{placeholder}</Text>
      )}
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChange}
        onSubmitEditing={onSubmitEditing}
        placeholderTextColor={placeholderTextColor}
        style={[style.placeholder, customStyles]}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        editable={editable}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKey}
        contextMenuHidden={contextMenuHidden}
        blurOnSubmit={blurOnSubmit}
        ref={input => {
          refInput.current = getRef != null ? input : null;
        }}
      />
    </BaseInputMaterial>
  );
};

const style = StyleSheet.create({
  placeholder: {
    width: '90%',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    paddingBottom: 5.5,
    paddingRight: 16,
    paddingLeft: 0,
    paddingTop: 0,
    borderBottomColor: '#0070CD',
    borderBottomWidth: 1,
    marginBottom: 10,
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

export default FinsusInputTextMaterial;
