import React, {useState} from 'react';
import {View, Platform, StyleSheet} from 'react-native';
import moment from 'moment';

import FinsusInputTextMaterial from 'components/base/FinsusInputTextMaterial';
import FinsusTouchableTextMaterial from 'components/base/FinsusTouchableTextMaterial';
import BaseInputMaterial from 'components/base/BaseInputMaterial';
import {TextInput} from 'react-native-gesture-handler';
import FinsusDatePicker from 'components/base/FinsusDatePicker';

const AddBeneficiaryForm = ({form, index, onUpdate}) => {
  // Component state
  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios' ? true : false);
    if (selectedDate) {
      onUpdate(index, {...form, birthdate: selectedDate});
    }
  };

  return (
    <View style={styles.container}>
      <FinsusInputTextMaterial
        showIcon={form}
        icon={require('assets/icons/beneficiaryFace.png')}
        placeholder={'Nombre completo'}
        placeholderTextColor="gray"
        autoCapitalize={'words'}
        value={form.name}
        onChange={text => {
          onUpdate(index, {...form, name: text});
        }}
      />
      <FinsusTouchableTextMaterial
        showIcon={false}
        textcolor={form.birthdate ? 'rgb(172, 177, 192)' : 'gray'}
        placeholder={'Fecha de nacimiento'}
        value={
          form.birthdate ? moment(form.birthdate).format('DD/MM/YYYY') : null
        }
        onPress={() => {
          setShowPicker(!showPicker);
        }}
      />
      {showPicker && (
        <FinsusDatePicker
          value={form.birthdate ? form.birthdate : new Date()}
          onDateChange={onDateChange}
          onAccept={() => setShowPicker(false)}
        />
      )}
      <FinsusInputTextMaterial
        showIcon={false}
        placeholder={'Dirección'}
        placeholderTextColor="gray"
        value={form.address}
        onChange={text => {
          onUpdate(index, {...form, address: text});
        }}
      />
      <FinsusInputTextMaterial
        showIcon={false}
        keyboardType="number-pad"
        maxLength={10}
        contextMenuHidden={true}
        placeholder={'Celular a 10 dígitos'}
        placeholderTextColor="gray"
        value={form.phone}
        onChange={text => {
          onUpdate(index, {...form, phone: text});
        }}
      />
      <BaseInputMaterial>
        <TextInput
          placeholder="Porcentaje:"
          placeholderTextColor="gray"
          editable={false}
          style={[styles.percent, styles.textpercent]}
        />
        <TextInput
          keyboardType="number-pad"
          style={[styles.percent, styles.texteditable]}
          contextMenuHidden={true}
          value={form.percentage}
          onChangeText={text => {
            onUpdate(
              index,
              {
                ...form,
                percentage: text,
                manual: true,
              },
              true,
              false,
            );
          }}
          onEndEditing={text => {
            onUpdate(
              index,
              {
                ...form,
              },
              true,
              true,
            );
          }}
        />
        <TextInput
          placeholder="%"
          placeholderTextColor="rgb(172, 177, 192)"
          editable={false}
          style={[styles.percent, styles.symbolpercent]}
        />
      </BaseInputMaterial>
    </View>
  );
};

const styles = StyleSheet.create({
  percent: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    paddingBottom: 5.5,
    paddingRight: 0,
    paddingLeft: 0,
    paddingTop: 0,
    color: 'rgb(172, 177, 192)',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  texteditable: {
    textAlign: 'right',
    width: '46%',
  },
  symbolpercent: {
    textAlign: 'center',
    width: '10%',
  },
  textpercent: {
    width: '31%',
  },
  container: {
    width: '90%',
    padding: 0,
    paddingVertical: 24,
    backgroundColor: '#1c2647',
    borderRadius: 10,
    marginBottom: 16,
  },
});

export default AddBeneficiaryForm;
