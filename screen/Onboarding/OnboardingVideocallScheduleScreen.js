/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {
  onboardOpenModal,
  onboardCloseModal,
  onboardScheduleVCall,
  onboardSetVideocallData,
} from 'store/actions';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import FinsusDropdownMaterial from 'components/base/FinsusDropdownMaterial';
import {setCalendarLang} from 'utils/methods';
import {MAX_DAYS_VIDEOCALL} from 'utils/env';
import {DARK_GREY_BLUE, SECONDARY_COLOR} from 'utils/colors';

const OnboardingVideocallScheduleScreen = ({navigation}) => {
  // Parameters
  const isPending = navigation.getParam('pending', false);

  // Constants
  const times = [
    {label: '09:00-11:00', value: '1'},
    {label: '11:00-13:00', value: '2'},
    {label: '13:00-15:00', value: '3'},
    {label: '15:00-17:00', value: '4'},
    {label: '17:00-19:00', value: '5'},
    {label: '19:00-21:00', value: '6'},
    {label: '21:00-23:00', value: '7'},
  ];

  // Redux state
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  const userData = useSelector(state => state.onboarding.userData);

  // Component state
  const [showHead, setHead] = useState(true);
  const [form, setForm] = useState({
    day: null,
    date: null,
    time: null,
    timestr: null,
  });

  // Hooks
  const dispatch = useDispatch();

  const setData = (id, value) => {
    setForm({
      ...form,
      [id]: value,
    });
  };

  const changeDay = day => {
    setData('day', day);
    setHead(day !== '3');
  };

  const getMinDate = () => {
    return moment().format('YYYY-MM-DD');
  };

  const getMaxDate = () => {
    return moment()
      .add(MAX_DAYS_VIDEOCALL, 'days')
      .format('YYYY-MM-DD');
  };

  const getMarkDate = () => {
    // Armar el array con el formato correcto
    let _dates = [];
    if (form.date) _dates.push(form.date);
    else return null;

    // Armar el objeto con las fechas
    return _dates.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: {selected: true, marked: true, selectedColor: DARK_GREY_BLUE},
        }),
      {},
    );
  };

  const getStart = () => {
    return form.timestr.split('-')[0];
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!form.day) {
      isError = true;
      errorForm += ', Día';
    } else if (form.day === '3' && !form.date) {
      isError = true;
      errorForm += ', Fecha del calendario';
    }
    if (!form.time) {
      isError = true;
      errorForm += ', Rango de horario';
    }

    if (isError && errorForm.length > 0) {
      errorForm =
        'Los siguientes campos son obligatorios:\n\n' +
        errorForm.substring(2) +
        '.';

      return {
        isError,
        errorForm,
      };
    }

    // Validaciones adicionales
    if (form.day === '3' && form.date < moment().format('YYYY-MM-DD')) {
      isError = true;
      errorForm += '\n- La fecha seleccionada debe ser mayor a hoy.';
    }
    if (form.day === '1' && getStart() <= moment().format('HH:mm')) {
      isError = true;
      errorForm += '\n- El rango de horas debe ser posterior a la hora actual.';
    } else if (
      form.day === '3' &&
      moment(`${form.date} ${getStart()}`, 'YYYY-MM-DD HH:mm') <= moment()
    ) {
      isError = true;
      errorForm += '\n- El rango de horas debe ser posterior a la hora actual.';
    }

    if (isError && errorForm.length > 0) {
      errorForm =
        'Se encontraron las siguientes inconsistencias:\n' + errorForm;

      return {
        isError,
        errorForm,
      };
    }

    return {
      isError,
      errorForm,
    };
  };

  const onSchedule = () => {
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardOpenModal(errorForm));
      return;
    }

    let _fechaIni, _fechaFin;
    const _hIni = form.timestr.split('-')[0];
    const _hFin = form.timestr.split('-')[1];
    switch (form.day) {
      case '1':
        const hDay = moment().format('DD/MM/YYYY');
        _fechaIni = `${hDay} ${_hIni}:00`;
        _fechaFin = `${hDay} ${_hFin}:00`;
        break;
      case '2':
        const mDay = moment()
          .add(1, 'days')
          .format('DD/MM/YYYY');
        _fechaIni = `${mDay} ${_hIni}:00`;
        _fechaFin = `${mDay} ${_hFin}:00`;
        break;
      case '3':
        const sDay = moment(form.date).format('DD/MM/YYYY');
        _fechaIni = `${sDay} ${_hIni}:00`;
        _fechaFin = `${sDay} ${_hFin}:00`;
        break;
    }

    if (isPending) {
      const vcInfo = {fechaInicio: _fechaIni, fechaFin: _fechaFin, status: '6'};
      dispatch(onboardSetVideocallData(vcInfo));
      navigation.pop(3); //De regreso a Pendientes
    } else dispatch(onboardScheduleVCall(userData, _fechaIni, _fechaFin, '1'));
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  const onBack = () => {
    navigation.goBack();
  };

  setCalendarLang();

  return (
    <OnboardingLevelOne
      loading={loading && navigation.isFocused()}
      messageLoading={'Agendando videollamada'}
      titleBox={
        showHead ? (
          <Text style={styles.title}>
            {userData.name + ',\nPrograma tu videollamada'}
          </Text>
        ) : null
      }
      noHeader={!showHead}
      hideHelp={true}
      isBackPress
      onBackPress={onBack}
      navigation={navigation}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          {showHead
            ? 'Elige el día y rango de horario de tu preferencia'
            : 'Programa tu videollamada'}
        </Text>
        <Text style={styles.label}>Día</Text>
        <FinsusDropdownMaterial
          items={[
            {label: 'Hoy', value: '1'},
            {label: 'Mañana', value: '2'},
            {label: 'Otro día', value: '3'},
          ]}
          value={form.day}
          placeholder={''}
          onChange={item => changeDay(item.value)}
          zIndex={3}
        />
        {!showHead && (
          <Calendar
            current={form.date}
            minDate={getMinDate()}
            maxDate={getMaxDate()}
            onDayPress={date => setData('date', date.dateString)}
            markedDates={getMarkDate()}
            monthFormat={'MMM yyyy'}
            showWeekNumbers={true}
            hideExtraDays={true}
            style={{width: '85%', marginVertical: 16}}
          />
        )}
        <Text style={styles.label}>Elige un rango de horario</Text>
        <FinsusDropdownMaterial
          items={times}
          value={form.time}
          placeholder={''}
          onChange={item =>
            setForm({...form, time: item.value, timestr: item.label})
          }
        />
        <View style={styles.buttonsContainer}>
          <FinsusButtonSecondary
            text={'Programar cita'}
            color={'rgba(0,0,0,0.25)'}
            textColor={'#fff'}
            textSize={13}
            textAlign={'center'}
            onPress={onSchedule}
          />
        </View>
      </View>
      <FinsusErrorModal
        done={onCloseModal}
        visible={hasError && navigation.isFocused()}
        text={messageError}
      />
    </OnboardingLevelOne>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 21,
    letterSpacing: 0.35,
    color: '#fff',
    textAlign: 'left',
    marginHorizontal: 30,
    marginVertical: 10,
    top: '20%',
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    letterSpacing: 0.19,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 30,
    marginVertical: 10,
  },
  label: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    letterSpacing: 0.15,
    color: 'rgb(172,177,192)',
    textAlign: 'left',
    marginHorizontal: 30,
    marginVertical: 16,
    width: '80%',
  },
  point: {
    textAlign: 'left',
  },
  bold: {
    color: SECONDARY_COLOR,
  },
  label10: {
    fontFamily: 'Montserrat-Light',
    fontSize: 10,
    color: 'rgb(172,177,192)',
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 26,
  },
  buttonsSubContainer: {
    width: '75%',
    alignItems: 'center',
    marginVertical: 20,
  },
  modalText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 15,
    letterSpacing: 0.15,
    textAlign: 'center',
    color: '#fff',
    width: '80%',
    marginBottom: 15,
  },
});

export default OnboardingVideocallScheduleScreen;
