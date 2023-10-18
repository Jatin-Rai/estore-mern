import React from 'react'
import { Link } from 'react-router-dom';
import { GoHorizontalRule } from 'react-icons/go';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <div className='flex justify-center'>
            <ul className='flex'>
                <li>
                    {step1
                        ? <span className='flex items-center text-green-500 '>
                            <Link to='/cart'>
                                Cart
                            </Link>
                            <GoHorizontalRule />
                        </span>
                        : <span
                            className='flex items-center text-gray-400' disabled
                        >
                            Cart
                            <GoHorizontalRule />
                        </span>
                    }
                </li>
                <li>
                    {step2
                        ? <span className='flex items-center text-green-500'>
                            <Link to='/shipping'>
                                Shipping
                            </Link>
                            <GoHorizontalRule />

                        </span>
                        : <span
                            className='flex items-center text-gray-400' disabled
                        >
                            Shipping
                            <GoHorizontalRule />

                        </span>
                    }
                </li>
                <li>
                    {step3
                        ? <span className='flex items-center text-green-500'>
                            <Link to='/payment'>
                                Payment
                            </Link>
                            <GoHorizontalRule />

                        </span>
                        : <span
                            className='flex items-center text-gray-400' disabled
                        >
                            Payment
                            <GoHorizontalRule />

                        </span>
                    }
                </li>
                <li>
                    {step4
                        ? <span className='flex items-center text-green-500'>
                            <Link to='/placeorder'>
                                Place Order
                            </Link>
                        </span>
                        : <span
                            className='flex items-center text-gray-400'
                            disabled
                        >
                            Place Order
                        </span>
                    }
                </li>
            </ul>
        </div>
    )
}

export default CheckoutSteps;