import React from 'react'
import SingleStory from './SingleStory'

const Stories = () => {
  return (
    <div className='md:h-28 h-20 flex items-center md:gap-8 gap-6 px-4 overflow-x-scroll no-scrollbar'>
     { Array.from({length:2}).map((story, index)=><SingleStory key={index} />)}
    </div>
  )
}

export default Stories
