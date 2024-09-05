import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    selectedMessageUser: null,
  },
  reducers: {
    setMessage: (state, action) => {
      state.messages = action.payload;
    },
    setSelectedMessageUser: (state, action) => {
      state.selectedMessageUser = action.payload;
    },
  },
});

export const { setMessage, setSelectedMessageUser } = messageSlice.actions;
export default messageSlice;
