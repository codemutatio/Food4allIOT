import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home_Screen from '../Components/screens/Home';
import Device_Page from '../Components/screens/Device_Page';

const Stack = createStackNavigator();

const MainNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home_Screen} />
      <Stack.Screen name="Device_Page" component={Device_Page} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainNavigation;
