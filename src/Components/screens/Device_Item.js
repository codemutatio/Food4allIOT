import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../../styles/styles';
import {useNavigation} from '@react-navigation/native';

const Device_Item = ({device}) => {
  const navigation = useNavigation();

  const go_to_device_page = () => {
    console.log('Device: ', device);
    navigation.navigate('Device_Page', {device: device});
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={{flexDirection: 'row', justifyContent: 'space-between'}}
        onPress={go_to_device_page}>
        <Text> {device.name} </Text>
        <Text> {device.id} </Text>
        <Text
          style={{
            backgroundColor: device.connected ? '#9ce66e' : '#c73e32',
            width: 14,
            height: 14,
            borderRadius: 7,
            marginTop: 5,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Device_Item;
