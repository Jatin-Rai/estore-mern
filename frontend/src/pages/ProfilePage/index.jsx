import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { MdDone, MdClose } from 'react-icons/md';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

import { useProfileMutation } from '../../features/slices/usersApiSlice';
import { setCredentials } from '../../features/slices/authSlice';
import { useGetMyOrdersQuery } from '../../features/slices/ordersApiSlice';


const ProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);

    const [updateProfile, { isLoading: updateProfileLoading }]
        = useProfileMutation();

    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Password do not match');
        } else {
            try {
                const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
                dispatch(setCredentials(res));
                toast.success('Profile updated successfully');
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    }


    return (
        <div className="lg:container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                <div className="mb-4">
                    <h2 className="text-xl lg:text-2xl font-semibold">Profile</h2>
                    <form onSubmit={submitHandler} className="mt-4 space-y-4">
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="name">Name</label>
                            <input
                                type='text'
                                className='border border-gray-500 p-1 rounded'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="email">Email</label>
                            <input
                                type='email'
                                className='border border-gray-500 p-1 rounded'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="password">Password</label>
                            <input
                                type='password'
                                className='border border-gray-500 p-1 rounded'
                                placeholder='Enter Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="password">Confirm Password</label>
                            <input
                                type='password'
                                className='border border-gray-500 p-1 rounded'
                                placeholder='Confirm Password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className='py-4'>
                            <button type='submit' className='bg-gray-900 p-2 text-white rounded'>Update</button>
                        </div>
                        {updateProfileLoading && <Loader />}
                    </form>
                </div>
                <div className='lg:col-span-2'>
                    <h2 className="text-xl lg:text-2xl font-semibold mb-4">My Orders</h2>
                    {isLoading
                        ? (
                            <Loader />
                        )
                        : error
                            ? (
                                <Message variant='bg-red-500'>{error?.data?.message || error.error}</Message>
                            )
                            : (
                                <table className="min-w-full">
                                    <thead>
                                        <tr>
                                            <th className="py-2 lg:py-3 text-left leading-5 tracking-wider">ID</th>
                                            <th className="py-2 lg:py-3 text-left text-sm leading-5 tracking-wider">DATE</th>
                                            <th className="py-2 lg:py-3 text-left text-sm leading-5 tracking-wider">TOTAL</th>
                                            <th className="py-2 lg:py-3 text-left text-sm leading-5 tracking-wider">PAID</th>
                                            <th className="py-2 lg:py-3 text-left text-sm leading-5 tracking-wider">DELIVERED</th>
                                            <th className="py-2 lg:py-3 text-left text-sm leading-5 tracking-wider"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {orders.map((order) => (
                                            <tr key={order._id} className='hover:bg-gray-100 cursor-pointer'>
                                                <td className="px-2 border-b border-gray-500 text-xs">{order._id}</td>
                                                <td className="px-2 border-b border-gray-500 text-xs">{order.createdAt.substring(0, 10)}</td>
                                                <td className="px-2 border-b border-gray-500 text-xs">${order.totalPrice}</td>
                                                <td className="px-2 border-b border-gray-500 text-xs">
                                                    {order.isPaid ? order.paidAt.substring(0, 10) : <MdClose className='text-red-500 text-xl' />}
                                                </td>
                                                <td className="px-2 border-b border-gray-500 text-xs">
                                                    {order.isDelivered ? order.deliveredAt.substring(0, 10) : <MdClose className='text-red-500 text-2xl' />}
                                                </td>
                                                <td className="px-6 border-b border-gray-500 text-xs text-blue-500">
                                                    <Link to={`/order/${order._id}`} className='text-xs underline'>View Details</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;