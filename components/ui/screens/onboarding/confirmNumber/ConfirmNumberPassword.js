import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import ConfirmNumberDigitPassword from './ConfirmNumberDigitPassword';

const ConfirmNumberPassword = ({
  items,
  title,
  fontSize = 15,
  fontColor = 'rgb(172,177,194)',
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={{...styles.title, fontSize: fontSize, color: fontColor}}>
          {title}
        </Text>
      </View>
      <TouchableHighlight onPress={onPress} underlayColor={'transparent'}>
        <View style={styles.digitsContainer}>
          {items.map((item, i) => (
            <ConfirmNumberDigitPassword key={i + 10 * 3} number={item.number} />
          ))}
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontFamily: 'Montserrat-Regular',
    marginBottom: 26,
  },
  digitsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ConfirmNumberPassword;
