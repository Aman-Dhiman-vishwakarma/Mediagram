import React from 'react'

const Explore = ({posts}) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {posts?.map((post, index)=> <img src={post?.image} className="w-full flex items-center"/>)}
        {/* <div className=" bg-red-400 col-span-2 row-span-2"></div>
        <div className="h-36 bg-red-400"></div>
        <div className="h-36 bg-red-400"></div>
        <div className="h-36 bg-red-400"></div>
        <div className=" bg-red-400 col-span-2 row-span-2"></div>
        <div className="h-36 bg-red-400"></div> */}
      </div>
    </div>
  )
}

export default Explore
