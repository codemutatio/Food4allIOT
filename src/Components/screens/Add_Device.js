import React, {useState} from 'react';
import {Text, View, TextInput, TouchableOpacity, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../../styles/styles';
import device_actions from '../../Redux/actions/device_actions';
import {useNavigation} from '@react-navigation/native';

function Add_Device_Screen({navigation}) {
  const [device_association, set_device_association] = useState('');
  const dispatch = useDispatch();
  const add_device_call = device => dispatch(device_actions.add_device(device));
  const unknown_devices = useSelector(
    state => state.device_reducer.unknown_devices,
  );

  const cancel_adding_device = () => {
    navigation.goBack();
  };

  const print_unknown_devices = () => {
    console.log('Unknown devices: ', unknown_devices);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}> Device association (optional): </Text>
      <TextInput
        style={styles.text_input}
        onChangeText={text => set_device_association(text)}
        value={device_association}
        placeholder="This device is used for..."
      />
      <Text style={styles.heading}> Device options: </Text>
      <FlatList
        data={unknown_devices}
        renderItem={({item}) => (
          <Device_Item device={item} association={device_association} />
        )}
        keyExtractor={item => item.name}
      />
      <TouchableOpacity style={styles.button} onPress={cancel_adding_device}>
        <Text> Cancel </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={print_unknown_devices}>
        <Text> Print unknown Devices </Text>
      </TouchableOpacity>
      {/*
      <TouchableOpacity style={styles.button} onPress={validate_and_add_device}>
        <Text> Add Device </Text>
      </TouchableOpacity> */}
    </View>
  );
}

export default Add_Device_Screen;

function Device_Item({device, association}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const call_add_device = device => dispatch(device_actions.add_device(device));

  const add_this_device = () => {
    device.association = association;
    call_add_device(device);
    navigation.goBack();
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={add_this_device}>
        <Text> {device.name} </Text>
      </TouchableOpacity>
    </View>
  );
}
