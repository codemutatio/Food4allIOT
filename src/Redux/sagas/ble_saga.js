import {BleManager} from 'react-native-ble-plx';
import {Platform, PermissionsAndroid} from 'react-native';
import {
  fork,
  take,
  put,
  spawn,
  select,
  cancel,
  cancelled,
} from 'redux-saga/effects';
import {eventChannel, END} from 'redux-saga';
import ble_uuids from '../../config/ble_uuids';
import {
  get_known_devices,
  devices_connected_to_system,
  connect_to_device,
  cancel_device_connection,
  discover_device_services_and_characteristics,
  check_device_connection,
  perform_device_transaction,
  restore_state_identifier,
  restore_state_function,
} from '../../util/ble';

export function* ble_saga() {
  const permission = yield request_permissions();

  if (permission) {
    const manager = new BleManager({
      restoreStateIdentifier: restore_state_identifier,
      restoreStateFunction: restore_state_function,
    });
    yield spawn(ble_state_listener, manager);
    yield spawn(ble_state_handler, manager);
  }
}

function* request_permissions() {
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

function* ble_state_handler(manager) {
  const state_channel = yield eventChannel(emit => {
    const subscription = manager.onStateChange(state => {
      emit(state);
    }, true);

    return () => {
      subscription.remove();
    };
  });

  while (true) {
    const new_ble_state = yield take(state_channel);
    console.log('BLE State: ', new_ble_state);
    if (new_ble_state === 'PoweredOn') {
      yield put({type: 'BLE_STATE_ON', ble_state: true});
    } else {
      yield put({type: 'BLE_STATE_OFF', ble_state: false});
    }
  }
}

function* ble_state_listener(manager) {
  yield spawn(ble_activity_helpers);
  while (yield take('BLE_STATE_ON')) {
    yield fork(rebuild_connections, manager);
    const scanner = yield fork(scan, manager);
    const disconnect_removed_device_handler = yield fork(
      handle_disconnect_removed_device,
      manager,
    );
    const known_device_handler = yield fork(handle_known_devices, manager);
    yield take('BLE_STATE_OFF');
    yield cancel(scanner);
    yield cancel(disconnect_removed_device_handler);
    yield cancel(known_device_handler);
  }
}

function* ble_activity_helpers() {
  yield spawn(separate_devices);
  yield spawn(handle_unknown_devices);
}

function* rebuild_connections(manager) {
  console.log('Rebuild connections.');
  // APPEARS TO HELP REBUILD IOS CONNECTIONS
  const service_list = [ble_uuids.service.uuid];
  const devices_in_system = yield devices_connected_to_system(
    manager,
    service_list,
  );
  console.log('Connected devices: ', devices_in_system);

  // APPEARS TO HELP REBUILD ANDROID CONNECTIONS
  const known_device_id_list = [];
  const known_devices_list = yield select(
    state => state.device_reducer.known_devices,
  );
  for (let i = 0; i < known_devices_list.length; i++) {
    const device_id = known_devices_list[i].id;
    known_device_id_list.push(device_id);
  }
  const known_devices = yield get_known_devices(manager, known_device_id_list);
  console.log('Known devices: ', known_devices);
  const known_devices_keys = Object.keys(known_devices);
  for (let i = 0; i < known_devices_keys.length; i++) {
    const key = known_devices_keys[i];
    const value = known_devices[key];
    const device_id = value.id;
    const connected = yield connect_to_device(manager, device_id);

    console.log('Connected with device id rebuilder: ', connected);
    if (connected) {
      for (let j = 0; j < known_devices_list.length; j++) {
        if (device_id === known_devices_list[j].id) {
          const device = known_devices_list[j];
          yield put({type: 'CONNECTED_TO_DEVICE', device: device});
          yield fork(monitor_device_disconnection, manager, device);
        }
      }
    }
  }
}

function* scan(manager) {
  const scan_channel = yield eventChannel(emit => {
    manager.startDeviceScan(
      [ble_uuids.service.uuid],
      {allowDuplicates: true},
      (error, device) => {
        if (error) {
          console.log('Error in device scan: ', JSON.stringify(error));
          emit(END);
        }

        if (device) {
          emit(device);
        }
      },
    );

    return () => {
      // manager.stopDeviceScan();
      console.log('Stopping Device Scan');
    };
  });

  try {
    while (true) {
      const device = yield take(scan_channel);
      const device_object = {id: device.id, name: device.name};
      yield put({type: 'FOUND_DEVICE', device: device_object});
    }
  } finally {
    console.log('Ending scan.');
    manager.stopDeviceScan();
  }
}

function* separate_devices() {
  while (true) {
    const found_device_action = yield take('FOUND_DEVICE');
    const device = found_device_action.device;
    const known_devices = yield select(
      state => state.device_reducer.known_devices,
    );

    let device_is_known = false;
    for (let i = 0; i < known_devices.length; i++) {
      if (known_devices[i].name === device.name) {
        device_is_known = true;
      }
    }

    if (device_is_known) {
      yield put({type: 'FOUND_KNOWN_DEVICE', device: device});
    } else {
      yield put({type: 'FOUND_UNKNOWN_DEVICE', device: device});
    }
  }
}

function* handle_unknown_devices() {
  while (true) {
    const unknown_device_action = yield take('FOUND_UNKNOWN_DEVICE');
    const device = unknown_device_action.device;
    const list_of_unknown_devices = yield select(
      state => state.device_reducer.unknown_devices,
    );
    let device_in_list = false;
    for (let i = 0; i < list_of_unknown_devices.length; i++) {
      if (list_of_unknown_devices[i].name === device.name) {
        device_in_list = true;
      }
    }

    if (!device_in_list) {
      yield put({type: 'UNKNOWN_DEVICE', device: device});
    }
  }
}

function* handle_known_devices(manager) {
  while (true) {
    const known_device_action = yield take('FOUND_KNOWN_DEVICE');
    const device = known_device_action.device;
    console.log('Known device ready to connect: ', device);

    // Getting the devices association
    const device_reducer = yield select(
      state => state.device_reducer.known_devices,
    );
    device.association = device_reducer.find(
      x => x.name === device.name,
    ).association;

    const device_connected = yield connect_to_device(manager, device.id);
    console.log('Device connected: ', device_connected);

    if (device_connected) {
      yield put({type: 'CONNECTED_TO_DEVICE', device: device});
      const discovered = yield discover_device_services_and_characteristics(
        manager,
        device.id,
      );
      if (discovered) {
        yield fork(monitor_device_disconnection, manager, device);
      }
    }
  }
}

function* monitor_device_disconnection(manager, device) {
  console.log('Monitoring device disconnection', device);
  const device_interaction_handler = yield fork(
    handle_device_interactions,
    manager,
    device,
  );

  const device_disconnect_channel = yield eventChannel(emitter => {
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
      // Note: we could post the disconnected_from_device_action here, or in the finally.
      // Note: we must have something in the while (true) {}; otherwise,
      // saga gets paused (because nothing to iterate to)
      let disconnected = yield take(device_disconnect_channel);
    }
  } finally {
    device_disconnect_channel.close();
    yield put({type: 'DISCONNECTED_FROM_DEVICE', device: device});
    yield cancel(device_interaction_handler);
    console.log('Device disconnected: ', device.id);
  }
}

function* handle_device_interactions(manager, device) {
  const transfer_timer_channel = yield eventChannel(emitter => {
    const timer = setInterval(() => {
      emitter('time');
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  });

  try {
    while (true) {
      let timed = yield take(transfer_timer_channel);
      yield perform_device_transaction(manager, device.id);
    }
  } finally {
    if (yield cancelled()) {
      transfer_timer_channel.close();
    }
  }
}

function* handle_disconnect_removed_device(manager) {
  while (true) {
    const remove_device_action = yield take('REMOVE_DEVICE');
    const device = remove_device_action.device;
    const cancelled = yield cancel_device_connection(manager, device.id);
    console.log(
      'Connection for device: ',
      device.id,
      ' was cancelled: ',
      cancelled,
    );
  }
}
