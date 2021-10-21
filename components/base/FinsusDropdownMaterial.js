import React from 'react';
import {Text, StyleSheet, Platform} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {isNullorEmpty} from 'utils/methods';

import {SECONDARY_COLOR} from 'utils/colors';

const FinsusDropdownMaterial = ({
  items,
  placeholder = 'Seleccionar',
  value,
  onChange = () => {},
  zIndex = 2,
  containerStyle = {},
}) => {
  return (
    <>
      {!isNullorEmpty(value) && !isNullorEmpty(placeholder) && (
        <Text style={styles.label}>{placeholder}</Text>
      )}
      <DropDownPicker
        defaultValue={value}
        items={items}
        placeholder={placeholder}
        style={styles.drop}
        dropDownStyle={{zIndex: zIndex, elevation: zIndex}}
        containerStyle={{...styles.dropContainer, ...containerStyle}}
        itemStyle={styles.dropItems}
        labelStyle={styles.dropLabel}
        activeLabelStyle={styles.dropActiveItem}
        placeholderStyle={styles.dropPlaceholder}
        arrowStyle={styles.dropArrow}
        arrowColor={'#acb1c0'}
        dropDownMaxHeight={200}
        zIndex={zIndex}
        onChangeItem={item => {
          onChange(item);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dropContainer: {
    width: Platform.OS == 'android' ? '79%' : '73%',
    height: 28,
    alignSelf: 'center',
    marginBottom: 10,
  },
  drop: {
    borderWidth: 0,
    borderColor: '#fff',
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
    paddingLeft: 4,
  },
  dropItems: {alignItems: 'center', marginVertical: 6},
  dropLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    flex: 1,
    width: '100%',
    textAlign: 'center',
    color: '#acb1c0',
    paddingBottom: 15,
  },
  dropActiveItem: {color: SECONDARY_COLOR},
  dropPlaceholder: {color: 'gray'},
  dropArrow: {paddingBottom: 15},
  label: {
    top: -5,
    paddingLeft: 4,
    width: Platform.OS == 'android' ? '79%' : '65%',
    fontFamily: 'Montserrat-Regular',
    fontSize: 10,
    color: SECONDARY_COLOR,
    alignSelf: 'center',
  },
});

export default FinsusDropdownMaterial;
