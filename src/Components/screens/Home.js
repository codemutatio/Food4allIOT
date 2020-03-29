import React from 'react';
import {Text, TouchableOpacity, View, FlatList} from 'react-native';
import styles from '../../styles/styles';
import {useSelector} from 'react-redux';
import Device_Item from './Device_Item';

const Home_Screen = () => {
  const known_devices = useSelector(
    state => state.device_reducer.known_devices,
  );
  const unknown_devices = useSelector(
    state => state.device_reducer.unknown_devices,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}> Saved Devices (Known): </Text>
      <FlatList
        data={known_devices}
        renderItem={({item}) => <Device_Item device={item} />}
        keyExtractor={item => item.name}
      />
      <Text style={styles.heading}> Saved Devices (Unknown): </Text>
      <FlatList
        data={unknown_devices}
        renderItem={({item}) => <Device_Item device={item} />}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log('Known devices: ', known_devices)}>
        <Text> Print known Devices </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home_Screen;
