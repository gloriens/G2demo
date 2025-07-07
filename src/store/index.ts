import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import announcementReducer from './slices/announcementSlice';
import employeeReducer from './slices/employeeSlice';
import newsReducer from './slices/newsSlice';
import documentsReducer from './slices/documentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    announcements: announcementReducer,
    employees: employeeReducer,
    news: newsReducer,
    documents: documentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;