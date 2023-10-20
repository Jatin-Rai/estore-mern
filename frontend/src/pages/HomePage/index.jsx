import React from 'react';

import Meta from '../../components/Meta/Meta'

import Product from '../../components/Product';
import { useGetProductsQuery } from '../../features/slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaArrowLeft, FaExclamation } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../../components/Paginate';
import ProductCarousel from '../../components/ProductCarousel';

const HomePage = () => {
    const { keyword, pageNumber } = useParams();
    const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber });

    return (
        <div>
            <div className='pb-6'>

                {!keyword ? <ProductCarousel /> : (
                    <Link to='/'>
                        <FaArrowLeft className='text-xl' />
                    </Link>
                )}
            </div>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="bg-red-500" icon={<FaExclamation />}>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div>
                    <Meta />
                    <h1 className='text-3xl font-bold pb-5'>Latest Products</h1>
                    <ul className='grid grid-flow-row sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                        {data.products.map((product) => (
                            <Product
                                key={product._id}
                                className='border border-red-500 rounded-md shadow'
                                product={product}
                            />
                        ))}
                    </ul>
                    <div className='mt-10 flex justify-center items-center'>
                        <Paginate
                            pages={data.pages}
                            page={data.page}
                            keyword={keyword ? keyword : ''}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
