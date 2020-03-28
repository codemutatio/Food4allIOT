import {combineReducers} from 'redux';
import {device_reducer} from './device_reducer';

const main_reducer = combineReducers({
  device_reducer,
});

export default main_reducer;
