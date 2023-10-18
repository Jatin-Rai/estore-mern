import React from 'react'

const Message = ({ icon, variant, children }) => {
  return (
    <div className={`px-8 py-3 ${variant} text-white flex justify-between rounded`}>
      <div className="flex items-center gap-4">
        {icon}
        <p>{children}</p>
      </div>
    </div>
  )
}

export default Message