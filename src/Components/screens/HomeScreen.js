import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import deviceActions from '../../Redux/actions/deviceActions';

const HomeScreen = () => {
  const navigation = useNavigation();
  const device = useSelector(state => state.deviceReducer.knownDevices);
  const dispatch = useDispatch();
  const scan_again = () => {
    dispatch(deviceActions.scan());
  };
  const goToDevicePage = devicee => {
    console.log('Device: ', devicee);
    navigation.navigate('DevicePage', {device: devicee});
  };
  console.log(device);

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <View>
        <Text style={styles.pageTitle}>BLE Devices</Text>
        <View style={styles.deviceBtnCtn}>
          {device[0] ? (
            <TouchableOpacity
              style={{
                backgroundColor: device[0].connected ? '#9ce66e' : '#c73e32',
                padding: 10,
                marginTop: 25,
                borderRadius: 10,
                elevation: 5,
                width: '70%',
              }}
              onPress={() => {
                device[0].batteryLevel = 70;
                goToDevicePage(device[0]);
              }}>
              <Text style={styles.deviceBtnTxt}>
                {device[0] ? device[0].name : ''}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: '#c73e32',
                padding: 10,
                marginTop: 25,
                borderRadius: 10,
                elevation: 5,
                width: '70%',
              }}>
              <Text style={styles.deviceBtnTxt} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.btnCtn}>
        <TouchableOpacity style={styles.scanBtn} onPress={scan_again}>
          <Text style={styles.scanBtnTxt}>Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 24,
    color: 'rgba(0,0,0,0.7)',
    fontWeight: 'bold',
  },
  btnCtn: {
    width: '100%',
    alignItems: 'center',
  },
  scanBtn: {
    backgroundColor: '#1C58E2',
    width: 100,
    padding: 13,
    borderRadius: 50,
    elevation: 5,
  },
  scanBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  deviceBtnCtn: {
    width: '100%',
    alignItems: 'center',
  },
  deviceBtn: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 25,
    borderRadius: 10,
    elevation: 5,
    width: '70%',
  },
  deviceBtnTxt: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HomeScreen;
