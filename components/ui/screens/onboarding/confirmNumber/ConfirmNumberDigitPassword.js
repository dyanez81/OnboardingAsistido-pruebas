import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';

const ConfirmNumberDigitPassword = ({number}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [fadeAnimOut] = useState(new Animated.Value(1));

  useEffect(() => {
    if (number) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
      }).start();

      Animated.timing(fadeAnimOut, {
        toValue: 0,
        duration: 500,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
      }).start();

      Animated.timing(fadeAnimOut, {
        toValue: 1,
        duration: 500,
      }).start();
    }
  }, [fadeAnim, fadeAnimOut, number]);

  return (
    <View style={styles.container}>
      {number && (
        <Animated.View style={{opacity: fadeAnimOut}}>
          <Text style={styles.title}>{number}</Text>
        </Animated.View>
      )}
      <Animated.View style={{opacity: fadeAnim}}>
        <View style={[styles.circleContainer]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 40,
    borderRadius: 40,
    backgroundColor: 'rgb(216, 216, 216)',
    position: 'relative',
  },
  circleContainer: {
    height: 12,
    width: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 149, 206, 0.5)',
    position: 'absolute',
    top: 14,
    left: 14,
  },
  title: {
    fontSize: 18,
    top: 8,
    left: 14,
    color: 'rgb(0, 149, 206)',
    position: 'absolute',
  },
});

export default ConfirmNumberDigitPassword;
