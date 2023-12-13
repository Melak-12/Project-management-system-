import { createSlice } from "@reduxjs/toolkit";
import { fetchTaskData } from "./asyncThunkApi";


const initialState = {
  taskValue: {
    tasks: [],
  },
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchTaskData.fulfilled, (state, action) => {
      state.taskValue.tasks = action.payload;
    });
  },
});
export default taskSlice.reducer;