import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name:"post",
    initialState:{
        posts:null,
    },
    reducers:{
        setPosts:(state, action)=>{
           state.posts = action.payload
        },
        setMorePosts:(state, action)=>{
            state.posts = [... state.posts, ...action.payload] 
        },
        setLikeUnlikePosts:(state, action)=>{
            const index = state.posts.findIndex(post=>post._id === action.payload._id)
            state.posts.splice(index, 1, action.payload)
         },
         setDeletePosts:(state, action)=>{
            const index = state.posts.findIndex(post=>post._id === action.payload)
            state.posts.splice(index, 1)
         },
    }
})

export const {setPosts, setMorePosts, setLikeUnlikePosts, setDeletePosts} = postSlice.actions
export default postSlice;