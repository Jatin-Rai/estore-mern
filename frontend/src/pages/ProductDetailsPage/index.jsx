import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useGetProductDetailsQuery, useCreateReviewMutation } from '../../features/slices/productsApiSlice'

import { FaArrowLeft, FaStar } from 'react-icons/fa'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../features/slices/cartSlice';
import { toast } from 'react-toastify';
import StarRating from '../../components/StarRating';
import Meta from '../../components/Meta/Meta'


const ProductDetailsPage = () => {
    const { userInfo } = useSelector(state => state.auth);

    const { id: productId } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);

    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createReview({
                productId,
                rating,
                comment
            }).unwrap();
            refetch();
            toast.success('Review Submitted');
            setRating(0);
            setComment('');
        } catch (error) {
            toast.error(error?.data?.message || error.error);
            setRating(0);
            setComment('');
        }
    }

    return (
        <div className='h-full'>
            <Link to="/">
                <FaArrowLeft className='text-xl' />
            </Link>
            {isLoading ? (<Loader />) : error ? (<Message variant="bg-red-500">{error.data.message || error.error}</Message>) : (
                <>
                    <Meta title={product.name} />
                    <div className="flex flex-col justify-center mt-2">
                        <div
                            className="flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg max-w-6xl mx-auto border border-white bg-white">
                            <div className="w-full md:w-full bg-white grid place-items-center">
                                <img src={product.image} alt={product.name} className='h-fit' />
                            </div>
                            <div className='flex flex-col gap-2 px-5'>
                                <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
                                    <div className="flex justify-between item-center">
                                        <p className="text-gray-500 font-medium hidden md:block">{product.category}</p>
                                        <div className="flex items-center">
                                            <FaStar className='text-yellow-400' />
                                            <p className="text-gray-600 font-bold text-sm ml-1">
                                                {product.rating}{" "}
                                                <span className="text-gray-500 font-normal">({product.numReviews} reviews)</span>
                                            </p>
                                        </div>

                                        <div className="bg-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-800 hidden md:block">
                                            {product.brand}
                                        </div>
                                    </div>
                                    <h3 className="font-black text-gray-800 md:text-3xl text-xl">{product.name}</h3>
                                    <p className="md:text-lg text-gray-500 text-base">
                                        {product.description}
                                    </p>
                                    <p className="text-xl font-black text-gray-800">
                                        Price: ${product.price}
                                    </p>
                                    <span className="font-normal text-gray-600 text-base">
                                        Status: {product.countInStock > 0 ? `${product.countInStock} In Stocks` : "Out of Stock"}</span>

                                </div>
                                {product.countInStock > 0 && (
                                    <div className='px-3 py-2'>
                                        <label className='font-semibold'>Qty:</label>
                                        <select
                                            className='ml-2 border-2 px-1'
                                            onChange={(e) => setQty(Number(e.target.value))}
                                        >
                                            {[...Array(product.countInStock).keys()].map((x) => (
                                                <option
                                                    key={x + 1}
                                                    value={x + 1}
                                                >
                                                    {x + 1}
                                                </option>
                                            ))}
                                            <option></option>
                                        </select>
                                    </div>
                                )}
                                <button
                                    className={`rounded-md text-white py-2  shadow ${product.countInStock === 0 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`} disabled={product.countInStock === 0}
                                    onClick={addToCartHandler}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <h2 className='pt-10 pb-5'>Reviews</h2>
                        {product.reviews.length === 0 && <Message variant='bg-gray-500 italic'>
                            No Reviews
                        </Message>}
                        <div>
                            {product.reviews.map(review => (
                                <div key={review._id} className='py-5'>
                                    <strong>{review.name}</strong>
                                    <StarRating rating={review.rating} reviews={review.numReviews} />
                                    <p className='text-xs italic pb-1'>{review.createdAt.substring(0, 10)}</p>
                                    <p>{review.comment}</p>
                                </div>
                            ))}
                            <div className='pt-5'>
                                <h2>Write a review</h2>
                                {loadingProductReview && <Loader />}

                                {userInfo && !userInfo.isAdmin ? (
                                    <form onSubmit={submitHandler}>
                                        <div className='flex flex-col gap-2 py-2'>
                                            <label htmlFor="rating" className=''>Rating</label>
                                            <select
                                                name="rating" id="rating"
                                                className='border-2 border-gray-600 rounded w-1/6'
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                            >
                                                <option value=''>Select...</option>
                                                <option value='1'>1 - Poor</option>
                                                <option value='2'>2 - Fair</option>
                                                <option value='3'>3 - Good</option>
                                                <option value='4'>4 - Very Good</option>
                                                <option value='5'>5 - Excellent</option>
                                            </select>
                                        </div>

                                        <div className='flex flex-col'>
                                            <label htmlFor="comment">Comment</label>
                                            <textarea
                                                name="comment" id="comment"
                                                rows="4"
                                                className='border-2 rounded w-1/3 mt-3 p-1 resize-none'
                                                placeholder='write your review here'
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            ></textarea>
                                            <button
                                                type='submit'
                                                disabled={loadingProductReview}
                                                className={`${loadingProductReview ? 'bg-gray-400' : 'bg-gray-900'} text-white p-1 rounded w-20 mt-4`}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <Message variant='bg-yellow-500'>
                                        Please <Link to='/login' className='text-blue-500 underline cursor-pointer'>sign in</Link> to write a review
                                    </Message>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ProductDetailsPage