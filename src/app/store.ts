import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import authReducer from "../features/auth/authSlice";
import formReducer from "../features/form/formSlice";
import { taskApi } from "../features/api/taskApi";
import { servicesApi } from '../features/api/servicesApi';
import { bookingApi } from '../features/api/bookingApi';
import { taskerApi } from "@/features/api/taskerApi";

import taskFormReducer from "../features/taskForm/taskFormSlice";

export const store = configureStore({
  reducer: {
    // RTK Query reducers
    [authApi.reducerPath]: authApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [taskerApi.reducerPath]: taskerApi.reducer,
    // Normal reducers
    auth: authReducer,
    form: formReducer,
    taskForm: taskFormReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['taskForm.photos', 'taskForm.video'],
      },
    })
      .concat(authApi.middleware)
      .concat(taskApi.middleware)
      .concat(servicesApi.middleware)
      .concat(bookingApi.middleware)
      .concat(taskerApi.middleware),

});

// Typed hooks (optional, but useful)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
