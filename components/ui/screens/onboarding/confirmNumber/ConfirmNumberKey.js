import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';

const ConfirmNumberKey = ({
  type = 'number',
  theme = 'LIGHT',
  isText = false,
  onPress,
  title,
  children,
}) => {
  const [pressed, setPressed] = useState(false);

  const themeUnderlay = () => {
    if (theme === 'LIGHT') {
      return type === 'number' ? 'rgba(0, 149, 206, 0.5)' : 'transparent';
    } else if (theme === 'DARK') {
      type === 'number' ? 'rgba(0, 149, 206, 0.5)' : 'transparent';
    } else if (theme === 'BLUE') {
      type === 'number' ? 'rgba(0, 149, 206, 0.5)' : 'transparent';
    }
  };

  const themeNumber = () => {
    if (theme === 'LIGHT') {
      return styles.numberLight;
    } else if (theme === 'DARK') {
      return styles.numberDark;
    } else if (theme === 'BLUE') {
      return styles.numberBlue;
    }
  };

  const themeTouchHighlight = () => {
    if (theme === 'LIGHT') {
      if (pressed) {
        return type === 'number' && styles.pressLight;
      } else {
        if (type === 'number') {
          return styles.numberContainerLight;
        } else {
          return styles.actionContainer;
        }
      }
    } else if (theme === 'DARK') {
      if (pressed) {
        return type === 'number' && styles.pressDark;
      } else {
        if (type === 'number') {
          return styles.numberContainerDark;
        } else {
          return styles.actionContainer;
        }
      }
    } else if (theme === 'BLUE') {
      if (pressed) {
        return type === 'number' && styles.pressBlue;
      } else {
        if (type === 'number') {
          return styles.numberContainerBlue;
        } else {
          return styles.actionContainer;
        }
      }
    }
  };

  return (
    <TouchableHighlight
      onPress={() => onPress(title)}
      underlayColor={
        type === 'number' ? 'rgba(0, 149, 206, 0.5)' : 'transparent'
      }
      onHideUnderlay={() => {
        setPressed(false);
      }}
      onShowUnderlay={() => {
        setPressed(true);
      }}
      style={[styles.container, themeTouchHighlight(), isText && {width: 80}]}>
      <View>
        {type === 'number' && <Text style={themeNumber()}>{title}</Text>}
        {type === 'action' && children}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {},
  numberContainerLight: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'white',
  },
  numberContainerDark: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'gray',
  },
  numberContainerBlue: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#4169a4',
  },
  numberLight: {
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    color: 'white',
  },
  numberDark: {
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    color: 'black',
  },
  numberBlue: {
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    color: '#4169a4',
  },
  pressLight: {
    borderRadius: 40,
    backgroundColor: 'rgba(0, 149, 206, 0.5)',
  },
  pressDark: {
    borderRadius: 40,
    backgroundColor: 'red',
  },
  pressBlue: {
    borderRadius: 40,
    backgroundColor: 'gray',
  },
});

export default ConfirmNumberKey;
