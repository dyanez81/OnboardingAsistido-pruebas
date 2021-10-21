import React from 'react';
import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';
import {SECONDARY_COLOR} from 'utils/colors';

const _h = Dimensions.get('window').height;
const _w = Dimensions.get('window').width;
const CameraFrame = ({children, textVertical, textHorizontal}) => {
  return (
    <View style={{flex: 1}}>
      {textVertical && (
        <View style={{position: 'absolute', width: '100%', elevation: 2}}>
          <Text
            style={{
              flex: 1,
              fontFamily: 'Montserrat-Regular',
              fontSize: 16,
              textAlign: 'center',
              color: '#fff',
              paddingTop: _h * 0.06,
              paddingHorizontal: 20,
            }}>
            {textVertical}
          </Text>
        </View>
      )}
      {textHorizontal && (
        <View
          style={{
            height: '100%',
            width: _w,
            elevation: 2,
            flexDirection: 'column',
            overflow: 'hidden',
            alignItems: 'flex-end',
          }}>
          <Text
            style={{
              left: 20,
              top: _h * 0.45,
              height: 40,
              width: _h * 0.9,
              fontFamily: 'Montserrat-Regular',
              fontSize: 16,
              textAlign: 'center',
              transform: [{rotate: '90deg'}],
              color: '#fff',
              borderWidth: 0,
            }}>
            {textHorizontal}
          </Text>
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          elevation: 2,
        }}>
        <Image
          source={require('assets/icons/corner-white-ul.png')}
          style={[styles.corner, styles.corner1]}
        />
        <Image
          source={require('assets/icons/corner-white-ur.png')}
          style={[styles.corner, styles.corner2]}
        />
        <Image
          source={require('assets/icons/corner-white-dl.png')}
          style={[styles.corner, styles.corner3]}
        />
        <Image
          source={require('assets/icons/corner-white-dr.png')}
          style={[styles.corner, styles.corner4]}
        />
      </View>
      {children}
    </View>
  );
};

const iconSize = 56;
const margin = 10;
const styles = StyleSheet.create({
  corner: {
    width: iconSize,
    height: iconSize,
    resizeMode: 'contain',
    position: 'absolute',
  },
  corner1: {
    top: margin,
    left: margin,
  },
  corner2: {
    top: margin,
    right: margin,
  },
  corner3: {
    bottom: margin,
    left: margin,
  },
  corner4: {
    bottom: margin,
    right: margin,
  },
});

export default CameraFrame;
