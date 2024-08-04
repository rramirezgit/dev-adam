import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth0Store';
import NewsletterReducer from './slices/newsletterStore';
import NoteReducer from './slices/noteStore';

const rootReducer = combineReducers({
  auth: authReducer,
  newsletter: NewsletterReducer,
  note: NoteReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
