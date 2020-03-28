import {spawn, fork} from 'redux-saga/effects';
import {ble_saga} from './ble_saga';
import {realm_saga} from './realm_saga';

export function* main() {
  console.log('Main Saga');
  yield fork(realm_saga);
  console.log('Realm setup finished');
  yield spawn(ble_saga);
}
