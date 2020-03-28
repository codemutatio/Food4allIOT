import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home_Screen from '../Components/screens/Home';
import Add_Device_Screen from '../Components/screens/Add_Device';
import Device_Page from '../Components/screens/Device_Page';

const Stack = createStackNavigator();

// const HomeScreen = ({navigation}) => {
//   return (
//     <View>
//       <Text>Home</Text>
//       <Button
//         title="TO FILTER"
//         onPress={() => {
//           navigation.navigate('Filter');
//         }}
//       />
//     </View>
//   );
// };

// const FilterScreen = () => {
//   return (
//     <View>
//       <Text>FilterScreen</Text>
//     </View>
//   );
// };
const MainNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home_Screen} />
      <Stack.Screen name="Add_Device" component={Add_Device_Screen} />
      <Stack.Screen name="Device_Page" component={Device_Page} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainNavigation;
