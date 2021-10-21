import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {DARK_GREY_BLUE} from 'utils/colors';

/**
 * @Desc: Requerimiento de Onboard. Icono y Texto
 * @date 2021-03-12 18:09:33
 */
const OnboardRequirement = ({
  text = 'Requisito 1',
  icon,
  bold = false,
  customStyle = {},
}) => {
  return (
    <View style={[style.container, customStyle]}>
      <View style={style.iconContainer}>
        {icon && <Image source={icon} style={style.icon} />}
      </View>
      <View style={style.textContainer}>
        <Text style={{...style.text, ...(bold && style.bold)}}>{text}</Text>
      </View>
    </View>
  );
};

const iconSize = 22;
const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  iconContainer: {
    width: iconSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  icon: {
    width: iconSize,
    height: iconSize,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: DARK_GREY_BLUE,
  },
  bold: {
    fontFamily: 'Montserrat-Bold',
  },
});

export default OnboardRequirement;
