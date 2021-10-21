import React from 'react';
import {View, StatusBar, StyleSheet, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import NavigationService from 'router/NavigationService';
import {useSelector} from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import FinsusTitle from 'components/base/FinsusTitle';
import FinsusLoading from 'components/ui/modals/FinsusLoading';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';
import {PRIMARY_COLOR} from 'utils/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FinsusStatusBar from 'components/base/FinsusStatusBar';

/**
 * @Author: Juan de Dios
 * @Date: 2020-02-24 18:45:03
 * @Desc:  Layout para la categoría main
 * @param {string} title Texto que se muestra en la parte superior
 * @param {bool} showError Controla si se muestra el diálogo de Error
 * @param {string} messageError Texto que se muestra en la ventana modal
 * @param {bool} showDrawerIcon Controla si se muestra el icono de menú hamburguesa
 * @param {bool} showBackPress Controla si se muestra el diálogo de regresar
 * @param {bool} showBackPressPicture Controla si se muestra el diálogo de regresar A MENÚ
 * @param {bool} loading Controla si se muestra el diálogo de procesamiento
 * @param {string} message Texto que se muestra en el diálogo de procesamiento
 * @param {object} children Todos los componentes que van dentro del layout
 * @param {function} doneErrorModal Método que se invoca al clicar ACEPTAR en el modal
 * @param {object} navigation Objeto Navigation Actions
 * @param {string} statusBarColor Color de la barra de navegación
 * @param {obj} styles Estilos para personalizar el contenedor principal
 */
const MainLayout = ({
  title = 'FINSUS',
  showError = false,
  messageError = null,
  showDrawerIcon = false,
  showBackPress = false,
  showBackPressPicture = false,
  loading = false,
  message = null,
  scrollDisabled = false,
  children,
  doneErrorModal,
  navigation,
  statusBarColor = PRIMARY_COLOR,
  styles: customStyle,
}) => {
  // Redux state
  const logged = useSelector(state => state.auth.logged);

  /**
   * @author Juan de Dios
   * @description Muestra/Oculta el navigationDrawer
   */
  const onToggleDrawer = () => {
    if (navigation) {
      navigation.toggleDrawer();
    }
  };

  const onBackPress = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const onBackPressPicture = () => {
    if (logged) NavigationService.reset('main');
    else NavigationService.reset('login');
  };

  return (
    <>
      <FinsusStatusBar />
      <KeyboardAwareScrollView
        style={{backgroundColor: 'transparent'}}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={!scrollDisabled}
        enableOnAndroid={true}
        automaticallyAdjustContentInsets={false}>
        <View style={[customStyle]}>
          <View style={styles.container}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={statusBarColor}
            />
            <View style={styles.ovalView} />
            <FinsusTitle title={title} style={styles.title} />
            {children}
          </View>
          <FinsusLoading loading={loading} text={message} />
          <FinsusErrorModal
            done={doneErrorModal}
            visible={showError}
            text={messageError}
          />
          {showDrawerIcon && (
            <Icon
              name="menu"
              size={36}
              color="white"
              style={{position: 'absolute', top: 16, left: 20}}
              onPress={onToggleDrawer}
            />
          )}
          {showBackPress && (
            <Icon
              name="keyboard-arrow-left"
              size={36}
              color="white"
              style={{position: 'absolute', top: 16, left: 20}}
              onPress={onBackPress}
            />
          )}
          {showBackPressPicture && (
            <Icon
              name="keyboard-arrow-left"
              size={36}
              color="white"
              style={{position: 'absolute', top: 16, left: 20}}
              onPress={onBackPressPicture}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

MainLayout.propTypes = {
  showError: PropTypes.bool,
  showDrawerIcon: PropTypes.bool,
  loading: PropTypes.bool,
  messageError: PropTypes.string,
  message: PropTypes.string,
  title: PropTypes.string,
  doneErrorModal: PropTypes.func,
  navigation: PropTypes.object,
};

const widthWindow = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fefefe',
  },
  ovalView: {
    height: widthWindow,
    width: widthWindow,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: widthWindow / 2,
    borderWidth: 0,
    position: 'absolute',
    top: -(widthWindow / 2),
    transform: [{scaleX: 1.8}],
    left: 0,
  },
  title: {
    paddingTop: 20,
    paddingBottom: 30,
  },
});

export default MainLayout;
