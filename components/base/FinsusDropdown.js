import React from 'react';
import {StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import {SECONDARY_COLOR} from 'utils/colors';

const FinsusDropdown = ({
  items,
  placeholder = 'Seleccionar',
  value,
  disabled = false,
  maxHeight = 200,
  zIndex = 2,
  onChange = () => {},
  style = {},
}) => {
  return (
    <DropDownPicker
      defaultValue={value}
      items={items}
      placeholder={placeholder}
      disabled={disabled}
      style={styles.drop}
      dropDownStyle={{zIndex: zIndex, elevation: zIndex}}
      containerStyle={{...styles.dropContainer, ...style}}
      itemStyle={styles.dropItems}
      labelStyle={styles.dropLabel}
      activeLabelStyle={styles.dropActiveItem}
      placeholderStyle={styles.dropPlaceholder}
      arrowStyle={styles.dropArrow}
      arrowColor={'#acb1c0'}
      dropDownMaxHeight={maxHeight}
      zIndex={zIndex}
      onChangeItem={item => {
        onChange(item);
      }}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    left: 10,
    top: 6,
    width: 18,
    height: 18,
  },
  dropContainer: {
    width: '90%',
    height: 40,
    marginBottom: 25,
  },
  drop: {
    borderWidth: 0,
    borderColor: '#ddd',
    borderBottomWidth: 1,
  },
  dropItems: {alignItems: 'center', marginVertical: 8},
  dropLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#484848',
    flex: 1,
    textAlign: 'left',
  },
  dropActiveItem: {color: SECONDARY_COLOR},
  dropPlaceholder: {color: 'gray'},
});

export default FinsusDropdown;
