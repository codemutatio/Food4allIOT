import DEVICE_ACTIONS from '../actions/device_actions';
import * as TYPES from '../types/index';

/*

state = {known: [], unknown: []}

Device:
{
  name: string,
  id: string,
  connected: boolean,
  association: string,
}

*/
const initialState = {
  known_devices: [],
  unknown_devices: [],
};

export const device_reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.ADD_DEVICE: {
      // return [...state, action.device];
      return {
        known_devices: [...state.known_devices, action.device],
        unknown_devices: state.unknown_devices,
      };
    }

    case TYPES.ADD_RETRIEVED_DEVICE: {
      return {
        known_devices: [...state.known_devices, action.device],
        unknown_devices: state.unknown_devices,
      };
    }

    case TYPES.REMOVE_DEVICE: {
      // return state.filter(item => item.name !== action.device.name);
      return {
        known_devices: state.known_devices.filter(
          item => item.name !== action.device.name,
        ),
        unknown_devices: state.unknown_devices,
      };
    }

    case TYPES.UNKNOWN_DEVICE: {
      console.log('New device detected: ', action.device);
      return {
        known_devices: state.known_devices,
        unknown_devices: [...state.unknown_devices, action.device],
      };
    }

    case TYPES.CLEAR_UNKNOWN_DEVICES: {
      return {
        known_devices: state.known_devices,
        unknown_devices: [],
      };
    }

    case TYPES.CONNECTED_TO_DEVICE: {
      const connection_updated = [];
      for (let i = 0; i < state.known_devices.length; i++) {
        if (action.device.name === state.known_devices[i].name) {
          const updated_device = {
            id: state.known_devices[i].id,
            name: state.known_devices[i].name,
            association: state.known_devices[i].association,
            connected: true,
          };
          connection_updated.push(updated_device);
        } else {
          connection_updated.push(state.known_devices[i]);
        }
      }

      return {
        known_devices: connection_updated,
        // known_devices: state.known_devices.map(
        //   item => item.name === action.device.name ?
        //   item.connected = true :
        //   item.connected = item.connected
        // ),
        unknown_devices: state.unknown_devices,
      };
    }

    case TYPES.DISCONNECTED_FROM_DEVICE: {
      const connection_updated = [];
      for (let i = 0; i < state.known_devices.length; i++) {
        if (action.device.name === state.known_devices[i].name) {
          const updated_device = {
            id: state.known_devices[i].id,
            name: state.known_devices[i].name,
            association: state.known_devices[i].association,
            connected: false,
          };
          connection_updated.push(updated_device);
        } else {
          connection_updated.push(state.known_devices[i]);
        }
      }

      return {
        known_devices: connection_updated,
        // known_devices: state.known_devices.map(
        //   item => item.name === action.device.name ?
        //   item.connected = false :
        //   item.connected = item.connected
        // ),
        unknown_devices: state.unknown_devices,
      };
    }

    default:
      return state;
  }
};
