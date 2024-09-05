import React, { useState } from 'react'
import Posts from './Posts'
import { useSelector } from 'react-redux';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

const Feed = () => {
 
  return (
    <div className='overflow-auto'>
     <Posts />
    </div>
  )
}

export default Feed
