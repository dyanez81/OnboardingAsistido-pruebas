import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {isNullorWhitespace} from 'utils/methods';

const FinsusHeader = ({
  title,
  subtitle,
  titleCase = true,
  containerStyle = {},
  titleStyle = {},
  subtitleStyle = {},
}) => {
  /**
   * @Desc: Poner la primera letra en mayúscula y el resto en minúsculas
   * @date 2021-01-28 20:36:21
   */
  const capitalize = text => {
    let result = '';

    if (!isNullorWhitespace(text)) {
      const parts = text.split(' ');
      parts.forEach(item => {
        if (item.length > 0)
          result +=
            item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() + ' ';
      });
    }

    return result.trim();
  };

  return (
    <View style={[styles.titleContainer, containerStyle]}>
      {!isNullorWhitespace(title) && (
        <Text style={[styles.title, titleStyle]}>
          {titleCase == true ? capitalize(title) : title}
        </Text>
      )}
      {!isNullorWhitespace(subtitle) && (
        <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    width: '80%',
    alignSelf: 'flex-start',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Montserrat-Medium',
    marginLeft:20,
    fontSize: 25,
    textAlign: 'left',
    letterSpacing: 0.35,
    color: 'black',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    marginLeft:20,
    textAlign: 'left',
    letterSpacing: 0.27,
    color: 'black',
  },
});

export default FinsusHeader;
