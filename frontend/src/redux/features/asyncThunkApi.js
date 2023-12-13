import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const fetchTaskData = createAsyncThunk("taskData/fetch", async () => {
  try {
    const response = await axios.get("http://localhost:9000/api/tasks/");
    const data = response.data;
    console.log("fetched tasks in asyncthunk",data);

    return data;
  } catch (error) {
    throw error;
  }
});



export const fetchprojectData = createAsyncThunk("projectData/fetch", async () => {
  try {
    const response = await axios.get("http://localhost:9000/api/projects/");
    const data = response.data;
    console.log("fetch project in asyncthunk ",data);
    return data
  } catch (error) {
    throw error;
  }
});
export const fetchIssueData = createAsyncThunk("issueData/fetch", async () => {
  try {
    const response = await axios.get("http://localhost:9000/api/issues/");
    const data = response.data;
    console.log("fetch issue in asyncthunk ",data);
    return data
  } catch (error) {
    throw error;
  }
});
export const fetchUserData = createAsyncThunk("userData/fetch", async (email) => {
  try {
    const response = await axios.get(`http://localhost:9000/api/users/getme?email=${email}`);
    const userData = response.data;
    // console.log("fetch data from thunk ",userData);


    return userData;
  } catch (error) {
    throw error;
  }
});