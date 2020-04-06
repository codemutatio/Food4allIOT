const Realm = require('realm');
import {DeviceSchema} from '../../config/realmSchemas';
import {fork, take, put, spawn} from 'redux-saga/effects';

export function* realmSaga() {
  const schemaVersion = 0;
  const realm = yield Realm.open({
    schema: [DeviceSchema],
    schemaVersion: schemaVersion,
  }).then(retRealm => {
    return retRealm;
  });

  yield fork(retrieveSavedDevices, realm);
  yield spawn(addDeviceHandler, realm);
  yield spawn(removeDeviceHandler, realm);
  yield spawn(updateDeviceUuid, realm);
}

function* retrieveSavedDevices(realm) {
  const savedDevices = realm.objects('Device');
  const savedDeviceKeys = Object.keys(savedDevices);
  for (let i = 0; i < savedDeviceKeys.length; i++) {
    const key = savedDeviceKeys[i];
    const item = savedDevices[key];
    const device = {
      name: item.name,
      id: item.ble_id,
      association: item.association,
      connected: false,
    };
    yield put({type: 'ADD_RETRIEVED_DEVICE', device: device});
  }
}

function* addDeviceHandler(realm) {
  while (true) {
    const addDeviceAction = yield take('ADD_DEVICE');
    const device = addDeviceAction.device;
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

function* removeDeviceHandler(realm) {
  while (true) {
    const removeDeviceAction = yield take('REMOVE_DEVICE');
    const device = removeDeviceAction.device;
    console.log('Realm is removing device: ', device);
    realm.write(() => {
      const deviceToDelete = realm
        .objects('Device')
        .filtered('name = $0', device.name);
      realm.delete(deviceToDelete);
    });
  }
}

function* updateDeviceUuid(realm) {
  while (true) {
    const knownDeviceAction = yield take('CONNECTED_TO_DEVICE');
    const device = knownDeviceAction.device;
    const deviceId = device.id;
    const deviceToUpdate = realm
      .objects('Device')
      .filtered('name = $0', device.name);
    realm.write(() => {
      deviceToUpdate.ble_id = deviceId;
    });
  }
}
