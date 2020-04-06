import * as TYPES from '../types/index';

const initialState = {
  knownDevices: [],
  unknownDevices: [],
};

export const deviceReducer = (state = initialState, {type, device}) => {
  switch (type) {
    case TYPES.ADD_DEVICE: {
      return {
        knownDevices: [...state.knownDevices, device],
        unknownDevices: state.unknownDevices,
      };
    }

    case TYPES.ADD_RETRIEVED_DEVICE: {
      return {
        knownDevices: [...state.knownDevices, device],
        unknownDevices: state.unknownDevices,
      };
    }

    case TYPES.REMOVE_DEVICE: {
      return {
        knownDevices: state.knownDevices.filter(
          item => item.name !== device.name,
        ),
        unknownDevices: state.unknownDevices,
      };
    }

    case TYPES.KNOWN_DEVICE: {
      console.log('New device detected: ', device);
      return {
        knownDevices: [...state.knownDevices, device],
        unknownDevices: state.unknownDevices,
      };
    }

    case TYPES.UPDATE_KNOWN_DEVICE: {
      console.log('BPM detected: ', device);
      console.log(device.bpm);
      const deviceUpdated = [];
      for (let i = 0; i < state.knownDevices.length; i++) {
        if (device.name === state.knownDevices[i].name) {
          const updatedDevice = {
            ...state.knownDevices[i],
            bpm: device.bpm,
          };
          deviceUpdated.push(updatedDevice);
        } else {
          deviceUpdated.push(state.knownDevices[i]);
        }
      }
      return {
        knownDevices: deviceUpdated,
        unknownDevices: state.unknownDevices,
      };
    }

    case TYPES.UNKNOWN_DEVICE: {
      console.log('New device detected: ', device);
      return {
        knownDevices: state.knownDevices,
        unknownDevices: [...state.unknownDevices, device],
      };
    }

    case TYPES.CLEAR_UNKNOWN_DEVICES: {
      return {
        knownDevices: state.knownDevices,
        unknownDevices: [],
      };
    }

    case TYPES.CONNECTED_TO_DEVICE: {
      const connectionUpdated = [];
      for (let i = 0; i < state.knownDevices.length; i++) {
        if (device.name === state.knownDevices[i].name) {
          const updatedDevice = {
            id: state.knownDevices[i].id,
            name: state.knownDevices[i].name,
            association: state.knownDevices[i].association,
            connected: true,
          };
          connectionUpdated.push(updatedDevice);
        } else {
          connectionUpdated.push(state.knownDevices[i]);
        }
      }

      return {
        knownDevices: connectionUpdated,
        unknownDevices: state.unknownDevices,
      };
    }

    case TYPES.DISCONNECTED_FROM_DEVICE: {
      const connectionUpdated = [];
      for (let i = 0; i < state.knownDevices.length; i++) {
        if (device.name === state.knownDevices[i].name) {
          const updatedDevice = {
            id: state.knownDevices[i].id,
            name: state.knownDevices[i].name,
            association: state.knownDevices[i].association,
            connected: false,
          };
          connectionUpdated.push(updatedDevice);
        } else {
          connectionUpdated.push(state.knownDevices[i]);
        }
      }

      return {
        knownDevices: connectionUpdated,
        unknownDevices: state.unknownDevices,
      };
    }

    default:
      return state;
  }
};
