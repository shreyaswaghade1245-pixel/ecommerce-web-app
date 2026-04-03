import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import postSlice from './postSlice'
import socketSlice from './socketSlice'
import chatSlice from './chatSlice';
import rtnSlice from './rtnSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'chat']
}

const rootReducer = combineReducers({
    auth: authSlice,
    post: postSlice,
    socket: socketSlice,
    chat: chatSlice,
    realTimeNotification: rtnSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['register'],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };

export default store;
