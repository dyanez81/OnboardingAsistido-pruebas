import React from 'react';
import {StyleSheet} from 'react-native';

import {Button} from 'react-native-material-ui';

const FinsusButton = React.memo(({width, ...props}) => {
  return (
    <Button
      {...props}
      upperCase={false}
      style={{
        container: {...styles.container, width: width ?? '90%'},
        text: {...styles.text},
      }}
      raised={true}
    />
  );
});

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 16,
  },
  container: {
    backgroundColor: '#0095ce',
    borderRadius: 10,
    height: 38,
  },
});

export default FinsusButton;
