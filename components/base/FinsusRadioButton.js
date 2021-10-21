import React from 'react';
import {Text, View, TouchableHighlight, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {WHITE_GREY} from 'utils/colors';

/**
 * @Desc: Radio button
 * @date 2021-05-31 16:59:07
 * @param {String} text Texto a mostrar
 * @param {Boolean} checked Indica si el radioButton estara checked o no
 * @param {Function} onPress Función a realizar al hacer clic
 * @param {Number} iconSize Tamaño del icono en puntos
 * @param {String} iconColor Color del Check
 * @param {Style} style Estilo del contenedor principal
 * @param {Style} textStyle Estilo del Texto
 */
const FinsusRadioButton = ({
  text = '',
  checked = false,
  onPress = () => {},
  iconSize = 22,
  iconColor = '#ddd',
  style = {},
  textStyle = {},
}) => {
  return (
    <TouchableHighlight
      underlayColor={'transparent'}
      onPress={onPress}
      style={[styles.container, style]}>
      <View style={styles.radioBtn}>
        <Icon
          name={checked ? 'check-circle' : 'radio-button-unchecked'}
          size={iconSize}
          color={iconColor}
          style={{paddingRight: iconSize / 3}}
        />
        <Text style={[styles.radioText, textStyle]}>{text}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  radioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    letterSpacing: 0.38,
    color: WHITE_GREY,
    marginVertical: 3,
  },
});

export default FinsusRadioButton;
