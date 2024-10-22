import React, { ReactNode } from 'react'

const layout = ({children}:{children:ReactNode}) => {
  return (
    <div className=' h-full flex justify-center items-center bg-gradient-to-br from-blue-600 via-blue-200 to-gray-400'>{children}</div>
  )
}

export default layout