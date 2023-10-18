/* eslint-disable no-unused-vars */
import React from 'react'
import Product from '../../components/Product';
import { useGetProductsQuery } from '../../features/slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {FaExclamation } from 'react-icons/fa';

const HomePage = () => {

    const { data: products, isLoading, error } = useGetProductsQuery();

    return (
        <>
            {isLoading ? (<Loader />) : error ? (<Message variant="bg-red-500" icon={<FaExclamation />}>{error?.data?.message || error.error}</Message>) : (<>
                <h1 className='text-3xl font-bold pb-5'>Latest Products</h1>
                <div className=''>
                    <ul className='grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                        {products.map((product) => (
                            <Product key={product._id} className='border border-red-500 rounded-md shadow' product={product} />
                        ))}

                    </ul>
                </div>
            </>)}

        </>
    )
}

export default HomePage