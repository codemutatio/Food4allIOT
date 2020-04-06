import {BleManager} from 'react-native-ble-plx';
import {Platform, PermissionsAndroid} from 'react-native';
import {
  fork,
  take,
  takeEvery,
  put,
  call,
  spawn,
  select,
  cancel,
  cancelled,
} from 'redux-saga/effects';
import {eventChannel, END} from 'redux-saga';
import base64 from 'base64-js';

import {
  getKnownDevices,
  checkServices,
  connectToDevice,
  cancelDeviceConnection,
  discoverDeviceServicesAndCharacteristics,
  performDeviceTransaction,
  restoreStateIdentifier,
  restoreStateFunction,
} from '../../util/ble';
import * as TYPES from '../types/index';
import bleUuids from '../../config/bleUuids';

export function* bleSaga() {
  const permission = yield requestPermissions();

  if (permission) {
    const manager = new BleManager({
      restoreStateIdentifier: restoreStateIdentifier,
      restoreStateFunction: restoreStateFunction,
    });
    yield spawn(bleStateListener, manager);
    yield spawn(bleStateHandler, manager);
    yield takeEvery(TYPES.SCAN, scan, manager);
  }
}

function* requestPermissions() {
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    const granted = yield PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return granted;
  } catch (error) {
    console.log('Error requesting permissions: ', error);
  }
}

function* bleStateHandler(manager) {
  const stateChannel = yield eventChannel(emit => {
    const subscription = manager.onStateChange(state => {
      emit(state);
    }, true);

    return () => {
      subscription.remove();
    };
  });

  while (true) {
    const newBleState = yield take(stateChannel);
    console.log('BLE State: ', newBleState);
    if (newBleState === 'PoweredOn') {
      yield put({type: 'BLE_STATE_ON', ble_state: true});
    } else {
      yield put({type: 'BLE_STATE_OFF', ble_state: false});
    }
  }
}

function* bleStateListener(manager) {
  yield spawn(bleActivityHelpers);
  while (yield take('BLE_STATE_ON')) {
    yield fork(rebuildConnections, manager);
    const scanner = yield fork(scan, manager);
    const disconnectRemovedDeviceHandler = yield fork(
      handleDisconnectRemovedDevice,
      manager,
    );
    const knownDeviceHandler = yield fork(handleKnownDevices, manager);
    yield take('BLE_STATE_OFF');
    yield cancel(scanner);
    yield cancel(disconnectRemovedDeviceHandler);
    yield cancel(knownDeviceHandler);
  }
}

function* bleActivityHelpers() {
  yield spawn(separateDevices);
  yield spawn(handleUnknownDevices);
}

function* rebuildConnections(manager) {
  console.log('Rebuild connections.');

  const knownDeviceIdList = [];
  const knownDevicesList = yield select(
    state => state.deviceReducer.knownDevices,
  );
  for (let i = 0; i < knownDevicesList.length; i++) {
    const deviceId = knownDevicesList[i].id;
    knownDeviceIdList.push(deviceId);
  }
  const knownDevices = yield getKnownDevices(manager, knownDeviceIdList);
  console.log('Known devices: ', knownDevices);
  const knownDevices_keys = Object.keys(knownDevices);
  for (let i = 0; i < knownDevices_keys.length; i++) {
    const key = knownDevices_keys[i];
    const value = knownDevices[key];
    const deviceId = value.id;
    const connected = yield connectToDevice(manager, deviceId);

    console.log('Connected with device id rebuilder: ', connected);
    if (connected) {
      for (let j = 0; j < knownDevicesList.length; j++) {
        if (deviceId === knownDevicesList[j].id) {
          const device = knownDevicesList[j];
          yield put({type: 'CONNECTED_TO_DEVICE', device: device});
          yield fork(monitorDeviceDisconnection, manager, device);
        }
      }
    }
  }
}

function* scan(manager) {
  const scanChannel = yield eventChannel(emit => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Error in device scan: ', JSON.stringify(error));
        emit(END);
      }

      if (device.name !== null) {
        console.log(device);
        manager.stopDeviceScan();
        emit(device);
      }
    });

    return () => {
      manager.stopDeviceScan();
      console.log('Stopping Device Scan');
    };
  });

  try {
    while (true) {
      const device = yield take(scanChannel);
      const deviceObject = {
        id: device.id,
        name: device.name,
        rssi: device.rssi,
        services: device.serviceData,
        tx: device.txPowerLevel,
      };
      yield put({type: 'FOUND_DEVICE', device: deviceObject});
    }
  } finally {
    console.log('Ending scan.');
    manager.stopDeviceScan();
  }
}

function* separateDevices() {
  while (true) {
    const foundDeviceAction = yield take('FOUND_DEVICE');
    const device = foundDeviceAction.device;

    let deviceIsKnown = false;
    if (device.name !== null) {
      deviceIsKnown = true;
    }

    if (deviceIsKnown) {
      yield put({type: 'FOUND_KNOWN_DEVICE', device: device});
    } else {
      yield put({type: 'FOUND_UNKNOWN_DEVICE', device: device});
    }
  }
}

function* handleUnknownDevices() {
  while (true) {
    const unknownDeviceAction = yield take('FOUND_UNKNOWN_DEVICE');
    const device = unknownDeviceAction.device;
    const listOfUnknownDevices = yield select(
      state => state.deviceReducer.unknownDevices,
    );
    let deviceInList = false;
    for (let i = 0; i < listOfUnknownDevices.length; i++) {
      if (listOfUnknownDevices[i].name === device.name) {
        deviceInList = true;
      }
    }

    if (!deviceInList) {
      yield put({type: 'UNKNOWN_DEVICE', device: device});
    }
  }
}

function* handleKnownDevices(manager) {
  while (true) {
    const knownDeviceAction = yield take('FOUND_KNOWN_DEVICE');
    const device = knownDeviceAction.device;
    const listOfKnownDevices = yield select(
      state => state.deviceReducer.knownDevices,
    );
    let deviceInList = false;
    for (let i = 0; i < listOfKnownDevices.length; i++) {
      if (listOfKnownDevices[i].name === device.name) {
        deviceInList = true;
      }
    }

    console.log(device);
    if (!deviceInList) {
      yield put({type: 'KNOWN_DEVICE', device: device});
    }
    console.log('Known device ready to connect: ', device);

    // Getting the devices association
    const deviceReducer = yield select(
      state => state.deviceReducer.knownDevices,
    );
    console.log(deviceReducer);
    // device.association = deviceReducer.find(
    //   x => x.name === device.name,
    // ).association;

    const deviceConnected = yield connectToDevice(manager, device.id);
    console.log('Device connected: ', deviceConnected);

    if (deviceConnected) {
      yield put({type: 'CONNECTED_TO_DEVICE', device: device});
      // console.log(manager.servicesForDevice(device.id)[1]);
      const discovered = yield discoverDeviceServicesAndCharacteristics(
        manager,
        device.id,
      );
      console.log(discovered);
      const services = yield checkServices(manager, device.id);
      console.log(services);

      const servicee = services.filter(
        service => service.uuid === bleUuids.service.uuid,
      )[0];

      const characteristics = yield call(
        [manager, manager.characteristicsForDevice],
        servicee.deviceID,
        servicee.uuid,
      );
      const characteristic = characteristics[0];
      const {deviceID, serviceUUID, uuid} = characteristic;
      console.log(deviceID, serviceUUID, uuid);

      const bpmChannel = yield eventChannel(emit => {
        let emitting = true;
        characteristic._manager.monitorCharacteristicForDevice(
          deviceID,
          serviceUUID,
          uuid,
          (error, char) => {
            try {
              if (char.value !== null) {
                if (emitting) {
                  const bytes = base64.toByteArray(char.value);
                  const bpm = bytes[1];
                  console.log(bpm);
                  console.log('Before emit>>>', bpm);
                  emit([error, bpm]);
                  emitting = false;
                } else {
                  emit(END);
                }
              }
            } catch (e) {
              console.log('e:', e);
              console.log('error', error);
              emit(END);
            }
          },
        );
        return () => {
          console.log('it hung up');
          // manager.stopDeviceScan();
        };
      });
      try {
        while (true) {
          const [error, bpm] = yield take(bpmChannel);
          console.log(bpm);
          device.bpm = bpm;
          console.log(error);
          yield put({type: 'UPDATE_KNOWN_DEVICE', device: device});

          if (error != null) {
            console.log('end');
          }
          if (bpm != null) {
            yield call(console.log, bpm);
          }
        }
      } catch (error) {
        yield call(console.log, 'Catch Error...');
      } finally {
        yield call(console.log, 'BPM stopped...');
        if (yield cancelled()) {
          bpmChannel.close();
        }
      }

      yield call(console.log, servicee);
    }
  }
}

function* monitorDeviceDisconnection(manager, device) {
  console.log('Monitoring device disconnection', device);
  const deviceInteractionHandler = yield fork(
    handleDeviceInteractions,
    manager,
    device,
  );

  const deviceDisconnectChannel = yield eventChannel(emitter => {
    const subscription = manager.onDeviceDisconnected(
      device.id,
      (error_callback, device_callback) => {
        emitter({type: 'DEVICE_DISCONNECTED'});
        emitter(END);
      },
    );

    return () => {
      subscription.remove();
    };
  });

  try {
    while (true) {
      let disconnected = yield take(deviceDisconnectChannel);
    }
  } finally {
    deviceDisconnectChannel.close();
    yield put({type: 'DISCONNECTED_FROM_DEVICE', device: device});
    yield cancel(deviceInteractionHandler);
    console.log('Device disconnected: ', device.id);
  }
}

function* handleDeviceInteractions(manager, device) {
  const transferTimerChannel = yield eventChannel(emitter => {
    const timer = setInterval(() => {
      emitter('time');
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  });

  try {
    while (true) {
      yield performDeviceTransaction(manager, device.id);
    }
  } finally {
    if (yield cancelled()) {
      transferTimerChannel.close();
    }
  }
}

function* handleDisconnectRemovedDevice(manager) {
  while (true) {
    const removeDeviceAction = yield take('REMOVE_DEVICE');
    const device = removeDeviceAction.device;
    const cancelled = yield cancelDeviceConnection(manager, device.id);
    console.log(
      'Connection for device: ',
      device.id,
      ' was cancelled: ',
      cancelled,
    );
  }
}
