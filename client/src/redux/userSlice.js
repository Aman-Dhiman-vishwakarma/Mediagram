import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        profileData:null,
        userPosts:[],
        findSearchUser:[]
    },
    reducers:{
        setProfileData:(state, action) => {
            state.profileData = action.payload
        },
        setUserPosts:(state, action) => {
            state.userPosts = action.payload
        },
        setfindSearchUser:(state, action) => {
            state.findSearchUser = action.payload
        },
    }
})

export const {setProfileData, setUserPosts, setfindSearchUser} = userSlice.actions
export default userSlice;