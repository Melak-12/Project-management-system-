import { createSlice } from "@reduxjs/toolkit";
import { fetchprojectData } from "./asyncThunkApi";
const initialState = {
  projectValue: {
    projects: [],
  },
};

export const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchprojectData.fulfilled, (state, action) => {
      state.projectValue.projects = action.payload;
    });
  },
});
export default projectSlice.reducer;