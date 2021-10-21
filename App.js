import React from 'react';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import FinsusNavigator from './router';
import configureStore from './store/configureStore';
import NavigationService from 'router/NavigationService';

const store = configureStore();

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <FinsusNavigator
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
