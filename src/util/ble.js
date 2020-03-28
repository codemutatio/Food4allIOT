import {BleErrorCode} from 'react-native-ble-plx';
import {eventChannel, END} from 'redux-saga';
import {
  fork,
  take,
  put,
  spawn,
  select,
  cancel,
  cancelled,
} from 'redux-saga/effects';

const get_known_devices = async (manager, device_id_list) => {
  const devices = await manager
    .devices(device_id_list)
    .then(_devices => {
      // console.log('Returned devices: ', _devices);
      return _devices;
    })
    .catch(error => {
      console.log('Error getting devices: ', error);
    });
  return devices;
};

// Maybe using uuid, i use this to check if they are
// currently connected to the system??
const devices_connected_to_system = async (manager, uuid_list) => {
  const devices = await manager
    .connectedDevices(uuid_list)
    .then(_devices => {
      return _devices;
    })
    .catch(error => {
      console.log('Error getting devices connected to system: ', error);
    });
  return devices;
};

const connect_to_device = async (manager, device_id) => {
  const connected = await manager
    .connectToDevice(device_id)
    .then(device => {
      return true;
    })
    .catch(error => {
      console.log('Error connecting to device: ', JSON.stringify(error));
      if (error.errorCode === BleErrorCode.DeviceAlreadyConnected) {
        console.log('Device was already connected');
        return true;
      }
    });
  return connected;
};

const cancel_device_connection = async (manager, device_id) => {
  const disconnected = await manager
    .cancelDeviceConnection(device_id)
    .then(device => {
      return true;
    })
    .catch(error => {
      console.log('Error disconnecting from device: ', error);
    });
  return disconnected;
};

const discover_device_services_and_characteristics = async (
  manager,
  device_id,
) => {
  const discovered = await manager
    .discoverAllServicesAndCharacteristicsForDevice(device_id)
    .then(device => {
      console.log(
        'Discovered services and characteristics for device: ',
        device_id,
      );
      return true;
    })
    .catch(error => {
      console.log('Error discovering services and characteristics: ', error);
    });
  return discovered;
};

const check_device_connection = async (manager, device_id) => {
  const connected = await manager
    .isDeviceConnected(device_id)
    .then(_device => {
      console.log('is device connected: ', _device);
      return _device;
    })
    .catch(error => {
      console.log('Error checking device connection: ', error);
    });
  return connected;
};

const perform_device_transaction = async (manager, device_id) => {
  console.log(
    'This is when a transaction would be performed for device: ',
    device_id,
  );
};

const restore_state_identifier = 'ble_manager';

function restore_state_function(restoredState) {
  if (restoredState !== null) {
    const connected_peripherals = restoredState.connectedPeripherals;
    for (let i = 0; i < connected_peripherals.length; i++) {
      const peripheral = connected_peripherals[i];
      console.log('Peripheral: ', peripheral.name, ' is still connected.');
      put({type: 'ACTION_ACTION', device: peripheral});
    }
  }
}

module.exports = {
  get_known_devices,
  devices_connected_to_system,
  connect_to_device,
  cancel_device_connection,
  discover_device_services_and_characteristics,
  check_device_connection,
  perform_device_transaction,
  restore_state_identifier,
  restore_state_function,
};
