import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className='bg-gray-300 py-4'>
            <div className='text-center'>eStore &copy; {currentYear}</div>
        </footer>
    )
}

export default Footer