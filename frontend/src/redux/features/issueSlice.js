import { createSlice } from "@reduxjs/toolkit";
import { fetchIssueData } from "./asyncThunkApi";
const initialState = {
    issueValue: {
        issues: [],
    },
};

export const issueSlice = createSlice({
    name: "issues",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchIssueData.fulfilled, (state, action) => {
            state.issueValue.issues = action.payload;
        });
    },
});
export default issueSlice.reducer;