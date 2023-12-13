import { createSlice } from "@reduxjs/toolkit";

import { fetchUserData } from "./asyncThunkApi";

const initialState = {
  userValue: {
    isAuth: false,
    email:"",
    name: "",
    // isAdmin: false,
    assignedTasks:[],
    team:"Team1",
    completedTasks:[]
  } ,
}
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      localStorage.clear();
      console.log("log out")
      return initialState;
    },
    logIn: (state, action) => {

      const { email, psd } = action.payload;
      
      return {
        userValue: {
          // isAdmin: email==="melakabebeee@gmail.com"?true:false,
          isAuth: true,
          email:email,
          name: email,
          assignedTasks:[],
          team:"Team1",
          completedTasks:[]
        },
      };
    },
    register: (state, action) => {
      const { name,email, psd } = action.payload;
      return {
        userValue: {
          // isAdmin: false,
          isAuth: true,
          email:email,
          name: name,
          assignedTasks:[],
          team:"Team1",
          completedTasks:[]
        },
      };
    },
  },
  extraReducers(builder) {
    
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      const userData = action.payload; 
      // console.log("user data builder",userData)
      // localStorage.setItem("userData",userData)
      state.userValue = {
        isAuth: true,
        email:userData.email,
        name: userData.name,
        isAdmin: userData.isAdmin,
        assignedTasks:userData.assignedTasks,
        team:"Team1",
        completedTasks:userData.completedTasks,
      };
    });
  },
  
});
export const { logIn, logOut ,register} = authSlice.actions;
export default authSlice.reducer;