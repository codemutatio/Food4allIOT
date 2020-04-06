/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import MainNavigator from './src/Navigation/MainNavigation';
import SplashScreen from 'react-native-splash-screen';

import {Provider} from 'react-redux';
import store from './src/Redux/store';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
};

export default App;
