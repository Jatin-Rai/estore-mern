import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
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

    const [updateProfile, { isLoading: updateProfileLoading }] = useProfileMutation();
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
            toast.error('Passwords do not match');
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
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="mb-4">
                    <h2 className="text-xl lg:text-2xl font-semibold">Profile</h2>
                    <form onSubmit={submitHandler} className="mt-4 space-y-4">
                        <div className="mb-4">
                            <label htmlFor="name" className="block font-semibold">Name</label>
                            <input
                                type="text"
                                className="border border-gray-300 p-1 rounded w-full"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block font-semibold">Email</label>
                            <input
                                type="email"
                                className="border border-gray-300 p-1 rounded w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block font-semibold">Password</label>
                            <input
                                type="password"
                                className="border border-gray-300 p-1 rounded w-full"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block font-semibold">Confirm Password</label>
                            <input
                                type="password"
                                className="border border-gray-300 p-1 rounded w-full"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <button type="submit" className="bg-gray-700 hover:bg-gray-900 p-2 text-white rounded">
                                Update
                            </button>
                        </div>
                        {updateProfileLoading && <Loader />}
                    </form>
                </div>
                <div className="col-span-2">
                    <h2 className="text-xl lg:text-2xl font-semibold mb-4">My Orders</h2>
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="bg-red-500">{error?.data?.message || error.error}</Message>
                    ) : (
                        <div className="table-container">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className='text-start'>ID</th>
                                        <th className='text-start'>DATE</th>
                                        <th className='text-start'>TOTAL</th>
                                        <th className='text-start'>PAID</th>
                                        <th className='text-start'>DELIVERED</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-100 cursor-pointer">
                                            <td>{order._id}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>
                                                {order.isPaid ? order.paidAt.substring(0, 10) : <MdClose className="text-red-500 text-lg" />}
                                            </td>
                                            <td>
                                                {order.isDelivered ? order.deliveredAt.substring(0, 10) : <MdClose className="text-red-500 text-lg" />}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/order/${order._id}`}
                                                    className="text-sm underline text-blue-500"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
