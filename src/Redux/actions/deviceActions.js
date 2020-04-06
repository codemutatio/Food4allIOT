import * as TYPES from '../types/index';

const addDevice = device => ({
  type: TYPES.ADD_DEVICE,
  device,
});

const addRetrievedDevice = device => ({
  type: TYPES.ADD_RETRIEVED_DEVICE,
  device,
});

const removeDevice = device => ({
  type: TYPES.REMOVE_DEVICE,
  device,
});

const knownDevice = device => ({
  type: TYPES.KNOWN_DEVICE,
  device,
});

const updateKnownDevice = device => ({
  type: TYPES.UPDATE_KNOWN_DEVICE,
  device,
});

const unknownDevice = device => ({
  type: TYPES.UNKNOWN_DEVICE,
  device,
});

const clearUnknownDevices = () => ({
  type: TYPES.CLEAR_UNKNOWN_DEVICES,
});

const scan = () => ({
  type: TYPES.SCAN,
});

const connectedToDevice = device => ({
  type: TYPES.DEVICE_CONNECTED,
  device,
});

const disconnectedFromDevice = device => ({
  type: TYPES.DEVICE_DISCONNECTED,
  device,
});

export default {
  addDevice,
  addRetrievedDevice,
  knownDevice,
  updateKnownDevice,
  removeDevice,
  unknownDevice,
  clearUnknownDevices,
  connectedToDevice,
  disconnectedFromDevice,
  scan,
};
