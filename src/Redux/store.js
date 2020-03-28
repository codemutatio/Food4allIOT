import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {main} from './sagas/main_saga';
import main_reducer from './reducers/main_reducer';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(main_reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(main);

export default store;
