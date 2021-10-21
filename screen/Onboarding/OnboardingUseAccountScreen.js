/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RepositoryFactory} from 'repository/RepositoryFactory';

import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';
import {SECONDARY_COLOR} from 'utils/colors';
import {
  onboardCloseModal,
  onboardEndLoading,
  onboardOpenModal,
  onboardRegisterUseAccount,
  onboardStartLoading,
} from 'store/actions';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import FinsusDropdownMaterial from 'components/base/FinsusDropdownMaterial';
import FinsusHeader from 'components/base/FinsusHeader';

const obRepository = RepositoryFactory.get('onboard');
const OnboardingUseAccountScreen = ({navigation}) => {
  // Redux state
  const hasError = useSelector(state => state.onboarding.hasError);
  const messageError = useSelector(state => state.onboarding.error);
  const loading = useSelector(state => state.onboarding.loading);
  const phone = useSelector(state => state.onboarding.userData.phone);
  const firstName = useSelector(state => state.onboarding.userData.name);

  // Component state
  const [accJob, setAccJob] = useState([]);
  const [accExpend, setAccExpend] = useState([]);
  const [accAmount, setAccAmount] = useState([]);
  const [accFrequency, setAccFrequency] = useState([]);
  const [accMovements, setAccMovements] = useState([]);
  const [form, setForm] = useState({
    job: null,
    expenditure: null,
    amount: null,
    frequency: null,
    movements: null,
  });

  // Hooks
  const dispatch = useDispatch();
  useEffect(() => {
    onGetCatalogs();
  }, []);

  const onGetCatalogs = useCallback(async () => {
    dispatch(onboardStartLoading());

    try {
      const {data} = await obRepository.GetUseAccountCatalog();

      if (
        data.accountUsageJob &&
        data.accountUsageExpenditure &&
        data.accountUsageAmount &&
        data.accountUsageFrequency &&
        data.accountUsageMonthlyMovements
      ) {
        const _accJob = data.accountUsageJob.map(item => {
          return {
            label: item.description,
            value: item.code,
          };
        });
        setAccJob(_accJob);

        const _accExpend = data.accountUsageExpenditure.map(item => {
          return {
            label: item.description,
            value: item.code,
          };
        });
        setAccExpend(_accExpend);

        const _accAmount = data.accountUsageAmount.map(item => {
          return {
            label: item.description,
            value: item.code,
          };
        });
        setAccAmount(_accAmount);

        const _accFrequency = data.accountUsageFrequency.map(item => {
          return {
            label: item.description,
            value: item.code,
          };
        });
        setAccFrequency(_accFrequency);

        const _accMovements = data.accountUsageMonthlyMovements.map(item => {
          return {
            label: item.description,
            value: item.code,
          };
        });
        setAccMovements(_accMovements);

        dispatch(onboardEndLoading());
      } else {
        // El formulario no se envió correctamente
        dispatch(
          onboardOpenModal('No se obtuvo los catálogos de uso de cuenta.'),
        );
      }
    } catch (err) {
      dispatch(
        onboardOpenModal(`No se obtuvo los catálogs:\n${err.toString()}`),
      );
    }
  }, []);

  const setData = (id, value) => {
    setForm({
      ...form,
      [id]: value,
    });
  };

  const validateForm = () => {
    let isError = false;
    let errorForm = '';

    // Validación de obligatorios
    if (!form.job) {
      isError = true;
      errorForm += '\n- Principal fuente de ingresos';
    }
    if (!form.expenditure) {
      isError = true;
      errorForm += '\n- Uso principal que darás a tu dinero';
    }
    if (!form.frequency) {
      isError = true;
      errorForm += '\n- Frecuencia aproximada de uso';
    }
    if (!form.amount) {
      isError = true;
      errorForm += '\n- Cantidad aproximada de dinero que recibirás al mes';
    }
    if (!form.movements) {
      isError = true;
      errorForm += '\n- Cantidad de movimientos mensuales aproximados';
    }

    if (isError && errorForm.length > 0) {
      errorForm =
        'Los siguientes campos son obligatorios:\n\n' + errorForm.substring(1);
    }

    return {
      isError,
      errorForm,
    };
  };

  const onContinue = () => {
    const {isError, errorForm} = validateForm();

    if (isError) {
      dispatch(onboardOpenModal(errorForm));
      return;
    }

    dispatch(
      onboardRegisterUseAccount({
        phone,
        job: form.job,
        amount: form.amount,
        expenditure: form.expenditure,
        frequency: form.frequency,
        movements: form.movements,
      }),
    );
  };

  const onCloseModal = () => {
    dispatch(onboardCloseModal());
  };

  return (
    <OnboardingLevelOne
      isBackPress
      onBackPress={() => navigation.goBack()}
      loading={loading && navigation.isFocused()}
      messageLoading={'Cargando'}
      titleBox={
        <FinsusHeader
          title={firstName}
          subtitle={'Danos información sobre el uso de tu cuenta. '}
          containerStyle={styles.titleContainer}
        />
      }
      noHeader={true}
      navigation={navigation}>
      <View style={styles.container}>
        <FinsusDropdownMaterial
          items={accJob}
          value={form.job}
          placeholder={'Principal fuente de ingresos'}
          onChange={item => setData('job', item.value)}
          containerStyle={styles.dropContainer}
          zIndex={6}
        />
        <FinsusDropdownMaterial
          items={accExpend}
          value={form.expenditure}
          placeholder={'Uso principal que darás a tu dinero'}
          onChange={item => setData('expenditure', item.value)}
          containerStyle={styles.dropContainer}
          zIndex={5}
        />
        <FinsusDropdownMaterial
          items={accFrequency}
          value={form.frequency}
          placeholder={'Frecuencia aproximada de uso'}
          onChange={item => setData('frequency', item.value)}
          containerStyle={styles.dropContainer}
          zIndex={4}
        />
        <FinsusDropdownMaterial
          items={accAmount}
          value={form.amount}
          placeholder={'Cantidad aproximada de dinero que recibirás al mes'}
          onChange={item => setData('amount', item.value)}
          containerStyle={styles.dropContainer}
          zIndex={3}
        />
        <FinsusDropdownMaterial
          items={accMovements}
          value={form.movements}
          placeholder={'Cantidad de movimientos mensuales aproximados'}
          onChange={item => setData('movements', item.value)}
          containerStyle={styles.dropContainer}
        />
        <View style={{height: 30}} />
        <FinsusButtonSecondary
          text={'Continuar'}
          color={'rgba(0,0,0,0.25)'}
          textColor={'#fff'}
          textSize={13}
          textAlign={'center'}
          onPress={onContinue}
        />
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
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  bold: {
    color: SECONDARY_COLOR,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 60,
  },
  titleContainer: {
    marginTop: 80,
    marginBottom: 80,
  },
  dropContainer: {
    marginBottom: 24,
  },
});

export default OnboardingUseAccountScreen;
