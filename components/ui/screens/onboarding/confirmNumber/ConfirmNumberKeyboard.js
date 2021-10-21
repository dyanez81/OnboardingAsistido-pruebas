import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

import ConfirmNumberKey from './ConfirmNumberKey';

const ConfirmNumberKeyboard = ({items, theme}) => {
  useEffect(() => {});

  return (
    <View style={styles.container}>
      {items.map((row, i) => (
        <View style={styles.rowKeys} key={i}>
          {row.map(key => (
            <ConfirmNumberKey
              theme={theme}
              isText={key.isText}
              title={key.title}
              type={key.type}
              onPress={key.onPress}
              key={key.key}>
              {key.title}
            </ConfirmNumberKey>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  rowKeys: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  keyContainer: {
    width: '33.3%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConfirmNumberKeyboard;
