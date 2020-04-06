import React from 'react';
import {View, Text, TouchableOpacity, StatusBar} from 'react-native';
import styles from '../../styles/styles';

const HeartRate = ({navigation, route}) => {
  const device = route.params.device;
  console.log(device);
  const goHome = () => {
    navigation.navigate('HomeScreen');
  };
  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <View style={styles.screenContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.textLarge}>Your Heart Rate level is</Text>
          <View style={styles.textRateCont}>
            <Text style={styles.textRate}>{device.bpm}</Text>
            <Text>BPM</Text>
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

export default HeartRate;
