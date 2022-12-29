import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { MusicReducer } from './reducer/musicReducer';


const persistConfig = {
  key: 'root',
  whitelist: ['MusicReducer'],
};

const rootReducer = combineReducers({
    MusicReducer: MusicReducer,
});


export const store = createStore(rootReducer, applyMiddleware(thunk));

