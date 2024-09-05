import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
    name:"comment",
    initialState:{
        comments:[],
        commentPostId:""
    },
    reducers:{
        setAllComments:(state, action) => {
            state.comments = action.payload
        },
        setComments:(state, action) => {
            state.comments.unshift(action.payload)
        },
        setCommentPostId:(state, action) => {
            state.commentPostId = action.payload
        }
    }
})

export const {setComments, setAllComments, setCommentPostId} = commentSlice.actions
export default commentSlice;