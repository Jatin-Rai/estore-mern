import React from 'react'

import { FaEdit, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';
import Message from '../../../components/Message';
import Loader from '../../../components/Loader';
import {
    useGetUsersQuery,
    useDeleteUserMutation
} from '../../../features/slices/usersApiSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const UsersListPage = () => {

    const { data: users, isLoading, error, refetch } = useGetUsersQuery();

    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await deleteUser(id);
                toast.success('User Deleted Successfully');
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    }

    return (
        <>
            <h1 className='text-3xl font-semibold'>Users</h1>

            {loadingDelete && <Loader />}

            {isLoading
                ? <Loader />
                : error
                    ? <Message variant='bg-red-500'>{error}</Message>
                    : (
                        <table className='w-full mt-5'>
                            <thead>
                                <tr className='text-left border-b-2 border-gray-300'>
                                    <th className='py-2 pr-2'>ID</th>
                                    <th className='py-2 pr-2'>NAME</th>
                                    <th className='py-2 pr-2'>EMAIL</th>
                                    <th className='py-2 pr-2'>ADMIN</th>
                                    <th className='py-2 pr-2'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className='hover:bg-gray-100'>
                                        <td className='py-2 pr-2'>{user._id}</td>
                                        <td className='py-2 pr-2'>{user.name}</td>
                                        <td className='py-2 pr-2'><a href={`mailto:${user.email}`}>
                                            {user.email}
                                        </a></td>
                                        <td className='py-2 pr-2'>
                                            {user.isAdmin
                                                ? (
                                                    <FaCheck className='text-green-500' />
                                                )
                                                : (
                                                    <FaTimes className='text-red-500' />
                                                )
                                            }
                                        </td>

                                        <td className='flex items-center gap-3 py-2 pr-2'>
                                            {!user.isAdmin
                                                && (
                                                    <>
                                                        <Link to={`/admin/user/${user._id}/edit`} className='hover:bg-gray-300 p-2 rounded'>
                                                            <FaEdit className='text-gray-700' />
                                                        </Link>
                                                        <button className='bg-red-500 hover:bg-red-600 rounded p-2'
                                                            onClick={() => deleteHandler(user._id)}
                                                        >
                                                            <FaTrash className='text-white' />
                                                        </button>
                                                    </>
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
            }
        </>
    )
}

export default UsersListPage;