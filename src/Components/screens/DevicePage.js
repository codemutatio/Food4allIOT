import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../../styles/styles';
import {useDispatch} from 'react-redux';
import deviceActions from '../../Redux/actions/deviceActions';

const DevicePage = ({navigation, route}) => {
  const dispatch = useDispatch();
  const removeDeviceCall = device =>
    dispatch(deviceActions.removeDevice(device));
  const device = route.params.device;

  const validateAndRemoveDevice = () => {
    removeDeviceCall(device);
    navigation.navigate('HomeScreen');
  };

  const heartRate = () => {
    navigation.navigate('HeartRate', {device: device});
  };

  const batteryLevel = () => {
    navigation.navigate('BatteryLevel', {device: device});
  };

  navigation.setOptions({
    headerTitle: device.name,
  });

  return (
    <View style={[styles.container, styles.topBottomSpread]}>
      <View>
        <Text style={styles.heading}> Name: </Text>
        <Text style={styles.info}> {device.name} </Text>
        <Text style={styles.heading}> Connected: </Text>
        {device.connected && <Text style={styles.info}> True </Text>}
        {!device.connected && <Text style={styles.info}> False </Text>}
      </View>
      <View>
        <View style={styles.functionBtns}>
          <View style={styles.btnCtn}>
            <TouchableOpacity style={styles.heartBtn} onPress={heartRate}>
              <Text style={styles.removeBtnTxt}>Heart Rate</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnCtn}>
            <TouchableOpacity style={styles.batBtn} onPress={batteryLevel}>
              <Text style={styles.removeBtnTxt}>Battery Level</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.btnCtn}>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={validateAndRemoveDevice}>
            <Text style={styles.removeBtnTxt}>Remove Device</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DevicePage;
