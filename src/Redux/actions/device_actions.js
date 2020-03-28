import * as TYPES from '../types/index';

const add_device = device => ({
  type: TYPES.ADD_DEVICE,
  device,
});

const add_retrieved_device = device => ({
  type: TYPES.ADD_RETRIEVED_DEVICE,
  device,
});

const remove_device = device => ({
  type: TYPES.REMOVE_DEVICE,
  device,
});

const unknown_device = device => ({
  type: TYPES.UNKNOWN_DEVICE,
  device,
});

const clear_unknown_devices = () => ({
  type: TYPES.CLEAR_UNKNOWN_DEVICES,
});

const connected_to_device = device => ({
  type: TYPES.DEVICE_CONNECTED,
  device,
});

const disconnected_from_device = device => ({
  type: TYPES.DEVICE_DISCONNECTED,
  device,
});

export default {
  add_device,
  add_retrieved_device,
  remove_device,
  unknown_device,
  clear_unknown_devices,
  connected_to_device,
  disconnected_from_device,
};
