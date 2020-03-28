import React from 'react';
import {Text, TouchableOpacity, View, FlatList} from 'react-native';
import styles from '../../styles/styles';
import {useDispatch, useSelector} from 'react-redux';
import device_actions from '../../Redux/actions/device_actions';
import Device_Item from './Device_Item';

function Home_Screen({navigation}) {
  const known_devices = useSelector(
    state => state.device_reducer.unknown_devices,
  );
  const dispatch = useDispatch();
  const call_clear_unknown_devices = () =>
    dispatch(device_actions.clear_unknown_devices());

  const go_to_add_device = () => {
    call_clear_unknown_devices();
    navigation.navigate('Add_Device');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}> Saved Devices: </Text>
      <FlatList
        data={known_devices}
        renderItem={({item}) => <Device_Item device={item} />}
        keyExtractor={item => item.name}
      />
      <TouchableOpacity style={styles.button} onPress={go_to_add_device}>
        <Text> Add New Device </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log('Known devices: ', known_devices)}>
        <Text> Print known Devices </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Home_Screen;
