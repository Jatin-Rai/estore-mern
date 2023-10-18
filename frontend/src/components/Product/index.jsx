/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import StarRating from '../StarRating'
import { Link } from 'react-router-dom'

const Product = ({ product }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="shadow rounded max-w-sm h-full overflow-hidden text-gray-600">
                <Link to={`/product/${product._id}`}>
                    <img src={product.image} alt={product.name} />
                </Link>
                <div className="px-4 pb-5">
                    <Link to={`/product/${product._id}`}>
                        <h3 className="font-semibold text-xl tracking-tight line-clamp-1">{product.name}</h3>
                    </Link>
                    {/* <p className='text-sm'>{product.description}</p> */}
                    <StarRating rating={product.rating} reviews={product.numReviews} />
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">${product.price}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product