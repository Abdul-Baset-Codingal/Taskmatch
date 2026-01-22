import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import authReducer from "../features/auth/authSlice";
import formReducer from "../features/form/formSlice";
import { taskApi } from "../features/api/taskApi";
import { servicesApi } from '../features/api/servicesApi';
import { bookingApi } from '../features/api/bookingApi';
import { taskerApi } from "@/features/api/taskerApi";
import { stripeApi } from '@/features/stripe/stripeApi';
import { adminTaskApi } from "../features/api/adminTaskApi";
import { blogApi } from "../features/api/blogApi";

import taskFormReducer from "../features/taskForm/taskFormSlice";
import { adminBookingApi } from "@/features/api/adminBookingApi";
import { adminQuoteApi } from "@/features/api/adminQuoteApi";
import { adminDashboardPaymentApi } from "@/features/api/adminDashboardPaymentApi"
import { adminLogApi } from "../features/api/adminLogApi";


export const store = configureStore({
  reducer: {
    // RTK Query reducers
    [authApi.reducerPath]: authApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [taskerApi.reducerPath]: taskerApi.reducer,
    [stripeApi.reducerPath]: stripeApi.reducer,
    [adminTaskApi.reducerPath]: adminTaskApi.reducer,
    [adminBookingApi.reducerPath]: adminBookingApi.reducer,
    [adminQuoteApi.reducerPath]: adminQuoteApi.reducer,
    [adminDashboardPaymentApi.reducerPath]: adminDashboardPaymentApi.reducer,
    [adminLogApi.reducerPath]: adminLogApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,

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
      .concat(taskerApi.middleware)
      .concat(stripeApi.middleware)
      .concat(adminTaskApi.middleware)
      .concat(adminDashboardPaymentApi.middleware)
      .concat(adminBookingApi.middleware)
      .concat(adminQuoteApi.middleware)
      .concat(adminLogApi.middleware)
      .concat(blogApi.middleware)

});

// Typed hooks (optional, but useful)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
