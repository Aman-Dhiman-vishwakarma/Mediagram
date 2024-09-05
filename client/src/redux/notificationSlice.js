import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name:"notification",
    initialState:{
        rtmNotification:[]
    },
    reducers:{
        setrRtmNotification:(state, action)=> {
            state.rtmNotification.push(action.payload)
        },
        setNullrRtmNotification:(state, action)=> {
            state.rtmNotification = []
        },

    }
})

export const {setrRtmNotification, setNullrRtmNotification} = notificationSlice.actions
export default notificationSlice;