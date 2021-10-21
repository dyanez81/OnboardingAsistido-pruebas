import React from 'react';
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native';

const HelpOption = ({icon, text, customStyle, onPress}) => {
  return (
    <View style={[style.container]}>
      <View style={customStyle.optionContainerIcon}>
        <Image source={icon} style={customStyle.optionIcon} />
      </View>
      <TouchableHighlight onPress={onPress} underlayColor="#f5f5dc">
        <Text style={customStyle.optionTitle}>{text}</Text>
      </TouchableHighlight>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
  },
});

export default HelpOption;
