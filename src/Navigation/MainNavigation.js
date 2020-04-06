import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Screens
// impo;
import HomeScreen from '../Components/screens/HomeScreen';
import HeartRate from '../Components/screens/HeartRate';
import BatteryLevel from '../Components/screens/BatteryLevel';
import DevicePage from '../Components/screens/DevicePage';

const Stack = createStackNavigator();

const MainNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1C58E2',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#fff',
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Scan Devices',
        }}
      />
      <Stack.Screen name="HeartRate" component={HeartRate} />
      <Stack.Screen name="BatteryLevel" component={BatteryLevel} />
      <Stack.Screen
        name="DevicePage"
        component={DevicePage}
        options={{title: 'Device Page'}}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainNavigation;
