import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../../styles/styles';
import {useDispatch} from 'react-redux';
import device_actions from '../../Redux/actions/device_actions';

function Device_Page({navigation, route}) {
  const dispatch = useDispatch();
  const remove_device_call = device =>
    dispatch(device_actions.remove_device(device));
  const device = route.params.device;

  const validate_and_remove_device = () => {
    remove_device_call(device);
    navigation.navigate('Home');
  };

  const return_to_device_list = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, styles.topBottomSpread]}>
      <View>
        <Text style={styles.heading}> Name: </Text>
        <Text style={styles.info}> {device.name} </Text>
        <Text style={styles.heading}> Id: </Text>
        <Text style={styles.info}> {device.id} </Text>
        <Text style={styles.heading}> Association: </Text>
        <Text style={styles.info}> {device.association} </Text>
        <Text style={styles.heading}> Connected: </Text>
        {device.connected && <Text style={styles.info}> True </Text>}
        {!device.connected && <Text style={styles.info}> False </Text>}
      </View>
      <View>
        <TouchableOpacity
          style={[styles.button, styles.footer]}
          onPress={return_to_device_list}>
          <Text> Go Back </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={validate_and_remove_device}>
          <Text> Remove Device </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Device_Page;
