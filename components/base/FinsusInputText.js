import React from 'react';
import {TextInput, Image, TouchableOpacity, StyleSheet} from 'react-native';
import BaseInput from './BaseInput';

const FinsusInputText = ({
  value,
  onChange,
  placeholder = '',
  autocorrect = true,
  secureTextEntry,
  keyboardType,
  contextMenuHidden = false,
  maxLength,
  showIcon = true,
  icon = require('assets/icons/lock.png'),
  iconStyle,
  returnKey = 'default',
  onSubmitEditing,
  iconButton = null,
  iconAction = () => {},
  ...props
}) => {
  return (
    <BaseInput {...props}>
      {showIcon && <Image source={icon} style={[style.icon, iconStyle]} />}
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChange}
        placeholderTextColor="gray"
        autoCorrect={autocorrect}
        style={style.placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        contextMenuHidden={contextMenuHidden}
        maxLength={maxLength}
        returnKeyType={returnKey}
        onSubmitEditing={onSubmitEditing}
      />
      {iconButton && (
        <TouchableOpacity onPress={iconAction}>
          <Image
            source={iconButton}
            style={{width: 28, height: 28, right: 5}}
          />
        </TouchableOpacity>
      )}
    </BaseInput>
  );
};

const style = StyleSheet.create({
  placeholder: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    paddingLeft: 40,
    paddingRight: 16,
  },
  icon: {
    position: 'absolute',
    left: 10,
    width: 18,
    height: 18,
  },
});

export default FinsusInputText;
