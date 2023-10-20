import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../../components/CheckoutSteps';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useCreateOrderMutation } from '../../features/slices/ordersApiSlice';
import { clearCartItems } from '../../features/slices/cartSlice';

import { MdError } from 'react-icons/md';

const PlaceOrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <div className='h-screen'>
            <CheckoutSteps step1 step2 step3 step4 />
            <div className='grid grid-cols-4 px-28 sm:px-0 pt-10'>
                <div className='col-span-3'>
                    <ul className='flex flex-col gap-5'>
                        <li>
                            <h2 className='font-bold text-xl mb-4'>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {cart.shippingAddress.address},{" "}{cart.shippingAddress.city}, {" "}{cart.shippingAddress.province} - {cart.shippingAddress.postalCode},{" "}{cart.shippingAddress.country}
                            </p>
                        </li>
                        <li>
                            <h2 className='font-bold text-xl mb-4'>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {cart.paymentMethod}
                            </p>
                        </li>
                        <li>
                            <h2 className='font-bold text-xl mb-4'>Order Items</h2>
                            <p>
                                {cart.cartItems.length === 0
                                    ? (<Message>Your cart is empty</Message>)
                                    : (
                                        <ul>
                                            {cart.cartItems.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className='flex items-center gap-10 mb-2'
                                                >
                                                    <img src={item.image} alt={item.name} className='h-10 rounded' />
                                                    <Link to={`/product/${item._id}`}
                                                        className='text-sm underline'
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <p className='italic'>{item.qty} x {item.price} = ${item.qty * item.price}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </p>
                        </li>
                    </ul>
                </div>
                <div className='col-span-1'>
                    <div className='shadow p-2'>
                        <h2 className='font-bold text-lg text-center'>Order Summary</h2>
                        <hr />
                        <table className='w-full'>
                            <tr>
                                <td>Items:</td>
                                <td className='text-end'>${cart.itemsPrice}</td>
                            </tr>
                            <tr>
                                <td>Shipping:</td>
                                <td className='text-end'>${cart.shippingPrice}</td>
                            </tr>
                            <tr>
                                <td>Tax:</td>
                                <td className='text-end'>${cart.taxPrice}</td>
                            </tr>

                            <tr className='border-t-2 font-bold'>
                                <td>Total:</td>
                                <td className='text-end'>${cart.totalPrice}</td>
                            </tr>
                            <tr className='border-t-2'>
                                <td className='pt-2'>
                                    <button
                                        className={`${cart.cartItems.length === 0 ? "bg-gray-400" : "bg-gray-900"} text-white p-2`}
                                        disabled={cart.cartItems.length === 0}
                                        onClick={placeOrderHandler}
                                    >
                                        Place Order
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {isLoading && <Loader /> || error && <Message
                                        icon={<MdError />}
                                        variant={`bg-red-500`}
                                    >
                                        {error.data.message}
                                    </Message>}
                                </td>
                            </tr>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PlaceOrderPage