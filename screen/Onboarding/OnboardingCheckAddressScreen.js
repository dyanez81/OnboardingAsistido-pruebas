import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  onboardCloseModal,
  onboardEndLoading,
  onboardOpenModal,
  onboardRegisterAcceptance,
  onboardSetAddressData,
  onboardStartLoading,
} from 'store/actions';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import SelfieAvatar from 'components/ui/screens/onboarding/selfie/SelfieAvatar';
import FinsusBottomButton from 'components/base/FinsusBottomButton';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import {isMexico} from 'utils/mapsUtils';
import {hasLocationPermission} from 'utils/permissions';
import {GPS_CONFIG} from 'utils/env';
import {ROYAL_BLUE} from 'utils/colors';

const OnboardingCheckAddressScreen = ({navigation}) => {
  // Redux state
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  const imgSelfie = useSelector(
    state => state.onboarding.ineSelfieData.items[0].data,
  );
  const userData = useSelector(state => state.onboarding.userData);
  const addressData = useSelector(state => state.onboarding.addressData);
  const benefetics = useSelector(state => state.onboarding.benefetics.items);

  // Hooks
  const dispatch = useDispatch();

  const fullAddress = `Calle ${addressData.street} núm. ${
    addressData.externalNumber
  }${
    addressData.internalNumber ? ' int. ' + addressData.internalNumber : ''
  }, ${addressData.suburb},\n${addressData.municipality}, ${
    addressData.federalEntity
  }, ${addressData.country},\n${addressData.cp}`;

  const onNextScreen = async () => {
    let _latitude = addressData.latitude;
    let _longitude = addressData.longitude;

    dispatch(onboardStartLoading());

    if (!_latitude || !_longitude) {
      const _permission = await hasLocationPermission();

      // Es obligatorio acceder a la ubicación
      if (!_permission.result) {
        dispatch(onboardOpenModal(_permission.message));
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          _latitude = position.coords.latitude;
          _longitude = position.coords.longitude;

          if (!_latitude || !_longitude) {
            dispatch(
              onboardOpenModal(
                'No se pudo obtener la ubicación.  Intenta de nuevo.',
              ),
            );
            return;
          } else if (!isMexico(_latitude, _longitude)) {
            dispatch(
              onboardOpenModal(
                `El registro no puede realizarse desde tu ubicación actual. \n\nLatitud: ${_latitude} \nLongitud: ${_longitude}`,
              ),
            );
            return;
          } else {
            // Se guarda la ubicación en redux
            dispatch(
              onboardSetAddressData({
                latitude: _latitude,
                longitude: _longitude,
              }),
            );
            dispatch(onboardEndLoading());
            // Se envía ubicación y manifest al back
            dispatch(
              onboardRegisterAcceptance({
                phone: userData.phone,
                latitude: _latitude,
                longitude: _longitude,
              }),
            );
          }
        },
        error => {
          dispatch(
            onboardOpenModal(
              'No se pudo obtener la ubicación:\n' + error.message,
            ),
          );
        },
        GPS_CONFIG,
      );
    } else {
      // Validar si está en la república mexicana
      if (!isMexico(_latitude, _longitude)) {
        dispatch(
          onboardOpenModal(
            `El registro no puede realizarse desde tu ubicación actual. \n\nLatitud: ${_latitude} \nLongitud: ${_longitude}`,
          ),
        );
        return;
      }

      dispatch(onboardEndLoading());
      dispatch(
        onboardRegisterAcceptance({
          phone: userData.phone,
          manifest: userData.manifest,
          latitude: _latitude,
          longitude: _longitude,
        }),
      );
    }
  };

  const editCustomer = () => {
    navigation.push('onboardingUserInfo', {fromCheckAddress: true});
  };

  const editEmail = () => {
    navigation.push('onboardingCreateUser', {fromCheckAddress: true});
  };

  const editAddress = () => {
    navigation.push('onboardingConfirmAddress', {fromCheckAddress: true});
  };

  const getName = firstName => {
    const name = firstName.trim().split(' ')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  return (
    <OnboardingLevelOne
      isBackPress
      onBackPress={() => navigation.goBack()}
      loading={loading && navigation.isFocused()}
      titleBox={
        <SelfieAvatar
          image={
            imgSelfie
              ? {uri: `data:image/jpg;base64,${imgSelfie}`}
              : require('assets/images/user-logo.png')
          }
          title={userData.name ? getName(userData.name) + ', ' : ''}
          subtitle={'Confirma tus datos...'}
        />
      }
      navigation={navigation}>
      <View style={styles.container}>
        <ScrollView>
          <Text style={[styles.dataText, {textTransform: 'capitalize'}]}>
            {userData.fullName}
            {'   '}
            <Icon
              name={'edit'}
              size={18}
              color={ROYAL_BLUE}
              onPress={editCustomer}
            />
          </Text>
          <Text style={{...styles.dataText, marginTop: 12}}>
            {userData.email}
            {'   '}
            <Icon
              name={'edit'}
              size={18}
              color={ROYAL_BLUE}
              onPress={editEmail}
            />
          </Text>
          <Text style={styles.dataText}>{userData.phone}</Text>
          <Text style={styles.dataText}>{userData.birthdate}</Text>
          <Text style={styles.dataText}>
            {fullAddress}
            {'   '}
            <Icon
              name={'edit'}
              size={18}
              color={ROYAL_BLUE}
              onPress={editAddress}
            />
          </Text>
          <Text style={styles.dataText}>{userData.curp}</Text>

          <Text style={styles.dataLabel}>Beneficiario(s):</Text>
          {benefetics.map((beneficiary, key) => (
            <Text style={styles.dataText} key={key}>
              {beneficiary.name}: {beneficiary.percentage}%
            </Text>
          ))}
        </ScrollView>
      </View>
      <FinsusBottomButton text={'Todo Ok'} onPress={onNextScreen} />
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  dataLabel: {
    color: '#ACB1C0',
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  dataText: {
    color: '#ACB1C0',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    letterSpacing: 0.26,
    lineHeight: 20,
    width: '80%',
    alignSelf: 'center',
  },
});

export default OnboardingCheckAddressScreen;
