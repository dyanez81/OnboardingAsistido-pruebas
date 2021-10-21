import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const SelfieImage = ({source, ...props}) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={source} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 115,
    width: 115,
    borderRadius: 115,
    borderWidth: 3,
    borderColor: 'rgb(0,149,206)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    height: 115,
    width: 115,
  },
});

export default SelfieImage;
