import React from 'react';
import {View, Text, TouchableOpacity, StatusBar} from 'react-native';

import styles from '../../styles/styles';

const BateryLevel = ({navigation, route}) => {
  const device = route.params.device;
  const goHome = () => {
    navigation.navigate('HomeScreen');
  };
  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <View style={styles.screenContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.textLarge}>{`Your Device: ${
            device.name
          } battery level is`}</Text>
          <View style={styles.textRateCont}>
            <Text style={styles.textRate}>{device.batteryLevel}</Text>
            <Text>%</Text>
          </View>
        </View>
        <View style={styles.btnCtn}>
          <TouchableOpacity style={styles.backBtn} onPress={goHome}>
            <Text style={styles.removeBtnTxt}>Back Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BateryLevel;
