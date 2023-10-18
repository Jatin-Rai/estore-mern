import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

import { BsArrowLeft } from 'react-icons/bs';

import Message from '../../../components/Message';
import Loader from '../../../components/Loader';
import { toast } from 'react-toastify';
import {
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} from '../../../features/slices/usersApiSlice';

const UserEditPage = () => {
    const { id: userId } = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId);

    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();



    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateUser({ userId, name, email, isAdmin });
            toast.success('User Updated Successfully');
            refetch();
            navigate('/admin/userslist');
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    }


    return (
        <>
            <Link to="/admin/userslist">
                <BsArrowLeft className='text-3xl font-bold cursor-pointer' />
            </Link>
            <div className='mt-5 grid grid-cols-3'>
                <h1 className="font-semibold text-2xl">Edit User</h1>
                {loadingUpdate && <Loader />}

                {isLoading
                    ? <Loader />
                    : error
                        ? <Message variant='bg-red-500'>{error.message}</Message>
                        : (
                            <form onSubmit={submitHandler} className='mt-5 flex flex-col'>
                                <div className='flex gap-4 my-2'>
                                    <label htmlFor="name" className='font-semibold'>Name:</label>
                                    <input
                                        type="text"
                                        value={name}
                                        className='w-full border-2 border-gray-300 py-1 px-2 rounded'
                                        placeholder='Enter product name'
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='flex gap-4 my-2'>
                                    <label htmlFor="" className='font-semibold'>Email:</label>
                                    <input
                                        type="email"
                                        value={email}
                                        className='w-full border-2 border-gray-300 py-1 px-2 rounded'

                                        placeholder='Enter price'
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className='flex gap-4 my-2'>
                                    <label htmlFor="" className='font-semibold'>Admin:</label>
                                    <input
                                        type="checkbox"
                                        value={isAdmin}
                                        className='w-full border-2 border-gray-300 py-1 px-2 rounded'
                                        checked={isAdmin}
                                        placeholder='Enter price'
                                        onChange={(e) => setIsAdmin(e.target.checked)}
                                    />
                                </div>
                                <div className='my-2 text-end'>
                                    <button className='p-2 bg-gray-800 hover:bg-gray-900 text-white rounded'>Update</button>
                                </div>
                            </form>
                        )
                }
            </div>
        </>
    );
}

export default UserEditPage;