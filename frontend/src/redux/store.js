import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import taskReducer from "./features/taskSlice";
import projectReducer from "./features/projectSlice";
export const store = configureStore({
  reducer: {
    user: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
  },
});

