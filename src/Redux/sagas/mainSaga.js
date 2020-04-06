import {spawn, fork} from 'redux-saga/effects';
import {bleSaga} from './bleSaga';
import {realmSaga} from './realmSaga';

export function* main() {
  yield fork(realmSaga);
  yield spawn(bleSaga);
}
