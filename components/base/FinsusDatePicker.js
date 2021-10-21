import React from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-06-03 22:37:38
 * @Desc: Date Picker Modal
 * @param {date} value Fecha inicial
 * @param {function} onDateChange Función que se dispara al cambiar fecha
 * @param {function} onAccept Función que se dispara al cerrar dialog (iOS)
 */
const FinsusDatePicker = ({
  value = new Date(),
  onDateChange = () => {},
  onAccept = () => {},
  customStyle = {},
}) => {
  return (
    <View style={[styles.container, customStyle]}>
      <DateTimePicker
        mode={'date'}
        display={'spinner'}
        locale={'es'}
        minimumDate={new Date(1900, 1, 1)}
        value={value}
        onChange={onDateChange}
      />
      {Platform.OS === 'ios' && (
        <TouchableHighlight underlayColor={'transparent'} onPress={onAccept}>
          <Text style={styles.datepickText}>Aceptar</Text>
        </TouchableHighlight>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '80%',
  },
  datepickText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#000',
    textAlign: 'right',
    paddingBottom: 10,
  },
});

export default FinsusDatePicker;
