import React from 'react'

export default function navbar() {
  return (
      <div className='h-10 flex justify-center items-center  bg-background-sky  border border-b-white text-sm font-semibold text-white bg'>
         <p className='text-sm font-semibold tracking-wide'> Certified Ethical Manufacturing by</p>
          <img src="/sedex.png"
              alt="Certified by Sedex"
              className=' h-20 w-auto drop-shadow-lg'/>
         
    </div>
  )
}
