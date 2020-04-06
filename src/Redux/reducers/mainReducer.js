import {combineReducers} from 'redux';
import {deviceReducer} from './deviceReducer';

const mainReducer = combineReducers({
  deviceReducer,
});

export default mainReducer;
