import React from 'react';
import {View, StyleSheet} from 'react-native';

import OnboardingOption from './OnboardingOption';

const OnboardingOptions = ({items = [], customStyle = {}}) => {
  return (
    <View style={[styles.container, customStyle]}>
      {items.map((item, i) => (
        <OnboardingOption
          onPress={item.onPress}
          image={item.checked ? ( item.imageActive ? item.imageActive : item.image) : item.image}
          disabled={item.disabled}
          active={item.active}
          title={item.title + (item.isTextData ? `\n${item.data ?? ''}` : '')}
          checked={item.checked}
          outlineCheck={item.outlineCheck}
          key={i}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default OnboardingOptions;
