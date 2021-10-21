import React from 'react';
import {View, StyleSheet, Image, Text, TouchableHighlight} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const OnboardingOption = ({
  onPress,
  image,
  title,
  checked,
  outlineCheck,
  disabled,
  active,
}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      disabled={disabled}
      underlayColor={'rgb(65, 105,164)'}
      style={styles.touchContainer}>
      <View
        style={[styles.container, active ? styles.active : styles.disabled]}>
        {image && (
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={image} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.text}>{title}</Text>
        </View>
        <View style={[outlineCheck && styles.successContainer]}>
          {checked && <Icon name="check" size={18} color="#0070CD" />}
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchContainer: {
    height: 60,
    marginBottom: 32,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    position: 'relative',
    height: 60,
  },
  disabled: {
    backgroundColor: 'gray',
    borderBottomColor:'gray',
    borderWidth:0.5,
  },
  active: {
    backgroundColor: 'lightgray',
  },
  imageContainer: {},
  image: {
    width: 56,
    height: 56,
    marginLeft: 8,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  text: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  successContainer: {
    position: 'absolute',
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 28,
    borderWidth: 0.5,
    borderColor: '#0070CD',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  success: {},
});

export default OnboardingOption;
