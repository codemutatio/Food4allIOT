const Realm = require('realm');
import {Device_Schema} from '../../config/realm_schemas';
import {fork, take, put, spawn} from 'redux-saga/effects';

export function* realm_saga() {
  const schema_version = 0;
  const realm = yield Realm.open({
    schema: [Device_Schema],
    schemaVersion: schema_version,
  }).then(ret_realm => {
    return ret_realm;
  });

  yield fork(retrieve_saved_devices, realm);
  yield spawn(add_device_handler, realm);
  yield spawn(remove_device_handler, realm);
  yield spawn(update_device_uuid, realm);
}

function* retrieve_saved_devices(realm) {
  const saved_devices = realm.objects('Device');
  const saved_device_keys = Object.keys(saved_devices);
  for (let i = 0; i < saved_device_keys.length; i++) {
    const key = saved_device_keys[i];
    const item = saved_devices[key];
    const device = {
      name: item.name,
      id: item.ble_id,
      association: item.association,
      connected: false,
    };
    yield put({type: 'ADD_RETRIEVED_DEVICE', device: device});
  }
}

function* add_device_handler(realm) {
  while (true) {
    const add_device_action = yield take('ADD_DEVICE');
    const device = add_device_action.device;
    console.log('Realm is saving device: ', device);
    realm.write(() => {
      realm.create('Device', {
        name: device.name,
        ble_id: device.id,
        association: device.association,
      });
    });
  }
}

function* remove_device_handler(realm) {
  while (true) {
    const remove_device_action = yield take('REMOVE_DEVICE');
    const device = remove_device_action.device;
    console.log('Realm is removing device: ', device);
    realm.write(() => {
      const device_to_delete = realm
        .objects('Device')
        .filtered('name = $0', device.name);
      realm.delete(device_to_delete);
    });
  }
}

function* update_device_uuid(realm) {
  while (true) {
    const known_device_action = yield take('CONNECTED_TO_DEVICE');
    const device = known_device_action.device;
    const device_id = device.id;
    const device_to_update = realm
      .objects('Device')
      .filtered('name = $0', device.name);
    realm.write(() => {
      device_to_update.ble_id = device_id;
    });
  }
}
