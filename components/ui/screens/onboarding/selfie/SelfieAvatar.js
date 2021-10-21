import React from 'react';
import {View, StyleSheet} from 'react-native';

import SelfieImage from './SelfieImage';
import SelfieTitle from './SelfieTitle';
import SelfieSubtitle from './SelfieSubtitle';

const SelfieAvatar = ({image, title, subtitle}) => {
  return (
    <View style={styles.container}>
      <SelfieImage source={image} />
      <View style={styles.titleContainer}>
        {title ? <SelfieTitle text={title} /> : null}
        {subtitle ? <SelfieSubtitle text={subtitle} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 24,
  },
  titleContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
  },
});

export default SelfieAvatar;
