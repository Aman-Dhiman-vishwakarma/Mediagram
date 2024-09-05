import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    caption:{type:String, default:''},
    image:{type:String, required:true},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    privet:{type:Boolean, default:false},
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],
}, {timestamps:true});

export const Post = mongoose.model('Post', postSchema);