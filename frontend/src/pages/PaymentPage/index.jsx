import React, { useState, useEffect } from 'react';
import CheckoutSteps from '../../components/CheckoutSteps';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../../features/slices/cartSlice';

const PaymentPage = () => {

    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    }

    return (
        <div className='h-screen'>
            <CheckoutSteps step1 step2 step3 />
            <div className='flex justify-center items-center'>
                <div className='mt-4'>
                    <form onSubmit={submitHandler}>
                        <div className='mt-5'>
                            <h1 className='font-bold text-2xl'>Payment Method</h1>
                        </div>
                        <div className='flex flex-col'>
                            <label className='my-5'>Select Method</label>
                            <div className='flex items-center'>
                                <input
                                    type='radio'
                                    id='PayPal'
                                    name='paymentMethod'
                                    value='PayPal'
                                    checked
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label className='ml-4 text-sm'>PayPal or Credit Card</label>
                            </div>
                        </div>
                        <button type="submit" className='bg-gray-900 text-white p-2 mt-5 rounded'>Continue</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PaymentPage;