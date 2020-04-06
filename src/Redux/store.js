import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {main} from './sagas/mainSaga';
import mainReducer from './reducers/mainReducer';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(mainReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(main);

export default store;
