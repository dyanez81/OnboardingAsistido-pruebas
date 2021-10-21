import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {Icon} from 'react-native-material-ui';

import ConfirmNumberKeyboard from 'components/ui/screens/onboarding/confirmNumber/ConfirmNumberKeyboard';

const NumericKeyboardModal = ({
  showKeyboard = false,
  onKeyPress,
  onBackPress = () => {},
  onCancel,
  onAccept,
}) => {
  const pressButtonKeyboard = char => {
    onKeyPress(char);
  };

  const [itemKeys] = useState([
    [
      {
        title: '1',
        onPress: pressButtonKeyboard,
        key: 10,
      },
      {
        title: '2',
        onPress: pressButtonKeyboard,
        key: 11,
      },
      {
        title: '3',
        onPress: pressButtonKeyboard,
        key: 12,
      },
    ],
    [
      {
        title: '4',
        onPress: pressButtonKeyboard,
        key: 13,
      },
      {
        title: '5',
        onPress: pressButtonKeyboard,
        key: 14,
      },
      {
        title: '6',
        onPress: pressButtonKeyboard,
        key: 15,
      },
    ],
    [
      {
        title: '7',
        onPress: pressButtonKeyboard,
        key: 16,
      },
      {
        title: '8',
        onPress: pressButtonKeyboard,
        key: 17,
      },
      {
        title: '9',
        onPress: pressButtonKeyboard,
        key: 18,
      },
    ],
    [
      {
        title: <Icon name="backspace" size={26} color="transparent" />,
        type: 'action',
        onPress: () => {},
        key: 21,
      },
      {
        title: '0',
        onPress: pressButtonKeyboard,
        key: 19,
      },
      {
        title: <Icon name="backspace" size={26} color="#4169a4" />,
        type: 'action',
        onPress: onBackPress,
        key: 20,
      },
    ],
  ]);

  const _renderContent = () => {
    return showKeyboard ? (
      <View style={[styles.container]}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            paddingVertical: 15,
          }}>
          <TouchableHighlight onPress={() => onCancel()} style={{flex: 1}}>
            <Text style={styles.text}>CANCELAR</Text>
          </TouchableHighlight>
          <View style={{flex: 1}} />
          <TouchableHighlight onPress={() => onAccept()} style={{flex: 1}}>
            <Text style={styles.text}>ACEPTAR</Text>
          </TouchableHighlight>
        </View>
        <View style={{width: '75%'}}>
          <ConfirmNumberKeyboard
            style={{alignSelf: 'center'}}
            theme={'BLUE'}
            items={itemKeys}
          />
        </View>
      </View>
    ) : (
      <></>
    );
  };

  return _renderContent();
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingBottom: 12,
    elevation: 3,
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowColor: '#000',
    shadowOffset: {height: 10, width: 10},
    position: 'absolute',
    bottom: 5,
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    lineHeight: 15,
    letterSpacing: 0.22,
    textAlign: 'center',
    margin: 5,
    color: '#4169a4',
  },
});

export default NumericKeyboardModal;
