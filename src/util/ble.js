import {BleErrorCode} from 'react-native-ble-plx';
import {put} from 'redux-saga/effects';

const getKnownDevices = async (manager, deviceIdList) => {
  try {
    const devices = await manager.devices(deviceIdList);
    return devices;
  } catch (error) {
    console.log('Error getting devices: ', error);
  }
};

// Maybe using uuid, i use this to check if they are
// currently connected to the system??
const devicesConnectedToSystem = async (manager, uuidList) => {
  try {
    const devices = await manager.connectedDevices(uuidList);
    return devices;
  } catch (error) {
    console.log('Error getting devices connected to system: ', error);
  }
};

const connectToDevice = async (manager, deviceId) => {
  try {
    const connected = await manager.connectToDevice(deviceId);
    if (connected) {
      return connected;
    }
  } catch (error) {
    console.log('Error connecting to device: ', JSON.stringify(error));
    if (error.errorCode === BleErrorCode.DeviceAlreadyConnected) {
      console.log('Device was already connected');
      return true;
    }
  }
};

const cancelDeviceConnection = async (manager, deviceId) => {
  try {
    const disconnected = await manager.cancelDeviceConnection(deviceId);
    if (disconnected) {
      return true;
    }
  } catch (error) {
    console.log('Error disconnecting from device: ', error);
  }
};

const discoverDeviceServicesAndCharacteristics = async (manager, deviceId) => {
  try {
    const discovered = await manager.discoverAllServicesAndCharacteristicsForDevice(
      deviceId,
    );
    if (discovered) {
      console.log(
        'Discovered services and characteristics for device: ',
        deviceId,
      );
      return true;
    }
  } catch (error) {
    console.log('Error discovering services and characteristics: ', error);
  }
};

const checkDeviceConnection = async (manager, deviceId) => {
  try {
    const connected = await manager.isDeviceConnected(deviceId);
    if (connected) {
      console.log('is device connected: ', connected);
      return connected;
    }
  } catch (error) {
    console.log('Error checking device connection: ', error);
  }
};

const checkServices = async (manager, deviceId) => {
  try {
    const services = await manager.servicesForDevice(deviceId);
    if (services) {
      console.log('is device connected: ', services);
      return services;
    }
  } catch (error) {
    console.log('Error checking device connection: ', error);
  }
};

const performDeviceTransaction = async (manager, deviceId) => {
  try {
    const data = await manager.servicesForDevice(deviceId);
    console.log(data);
  } catch (error) {
    console.log('Error checking device services: ', error);
  }
};

const restoreStateIdentifier = 'ble_manager';

function restoreStateFunction(restoredState) {
  if (restoredState !== null) {
    const connectedPeripherals = restoredState.connectedPeripherals;
    for (let i = 0; i < connectedPeripherals.length; i++) {
      const peripheral = connectedPeripherals[i];
      console.log('Peripheral: ', peripheral.name, ' is still connected.');
      put({type: 'ACTION_ACTION', device: peripheral});
    }
  }
}

module.exports = {
  getKnownDevices,
  devicesConnectedToSystem,
  checkServices,
  connectToDevice,
  cancelDeviceConnection,
  discoverDeviceServicesAndCharacteristics,
  checkDeviceConnection,
  performDeviceTransaction,
  restoreStateIdentifier,
  restoreStateFunction,
};
