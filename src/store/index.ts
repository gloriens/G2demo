import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import announcementReducer from './slices/announcementSlice';
import employeeReducer from './slices/employeeSlice';
import newsReducer from './slices/newsSlice';
import documentsReducer from './slices/documentsSlice';
import eventsReducer from './slices/eventsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    announcements: announcementReducer,
    employees: employeeReducer,
    news: newsReducer,
    documents: documentsReducer,
    events: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;