import { configureStore, combineReducers } from '@reduxjs/toolkit';

import NoteReducer from './slices/noteStore';
import authReducer from './slices/auth0Store';
import NewsletterReducer from './slices/newsletterStore';

const rootReducer = combineReducers({
  auth: authReducer,
  newsletter: NewsletterReducer,
  note: NoteReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
