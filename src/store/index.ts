import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventsSlice';
import newsReducer from './slices/newsSlice';
import employeeReducer from './slices/employeeSlice'; // ✅ Import ekle

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    news: newsReducer,
    employees: employeeReducer, // ✅ Employee reducer'ı ekle
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;