import {NavigationActions, StackActions} from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function goBack(routeName, params) {
  _navigator.dispatch(NavigationActions.back());
}

function replace(routeName) {
  _navigator.dispatch(
    StackActions.replace({
      routeName,
    }),
  );
}

function push(routeName) {
  _navigator.dispatch(
    StackActions.push({
      routeName,
    }),
  );
}

function pop(routeName) {
  _navigator.dispatch(
    StackActions.pop({
      routeName,
    }),
  );
}

function popToTop(routeName) {
  _navigator.dispatch(
    StackActions.popToTop({
      routeName,
    }),
  );
}

/**
 * @Author: AZozaya
 * @Date: 2020-02-20 22:41:34
 * @Desc: Redirige a una nueva pantalla después de limpiar todo el historial.
 * @param: {string} clave de la pantalla a la que dirigirá
 */
function reset(routeName, params) {
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({routeName, params})],
    }),
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  goBack,
  replace,
  push,
  pop,
  popToTop,
  reset,
  setTopLevelNavigator,
};
