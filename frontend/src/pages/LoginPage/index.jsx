import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { useLoginMutation } from '../../features/slices/usersApiSlice';
import { setCredentials } from '../../features/slices/authSlice';
import { toast } from 'react-toastify';


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector(state => state.auth);

    const { search } = useLocation();

    const searchParams = new URLSearchParams(search);

    const redirect = searchParams.get('redirect') || '/';


    useEffect(() => {
        if (userInfo) {
            navigate(redirect); 
        }
    }, [userInfo, redirect, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    }

    return (
        <div className='flex items-center justify-center min-w-screen min-h-full pb-48 sm:pb-5'>
            <div className='md:sm:w-1/2 w-full flex flex-col shadow-2xl rounded p-10'>
                <h1 className='text-2xl font-semibold capitalize text-center'>sign in</h1>
                <form
                    onSubmit={submitHandler}
                    className='flex flex-col pt-3 gap-3'
                >
                    <div className='flex flex-col pt-3 gap-3'>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            placeholder='Enter email'
                            className='outline outline-gray-300 p-2 rounded'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col py-4 gap-3'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder='Enter password'
                            className='outline outline-gray-300 p-2 rounded'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type='submit'
                        className='bg-blue-500 hover:bg-blue-700 w-full rounded text-white py-2 shadow'
                        disabled={isLoading}
                    >
                        Sign In
                    </button>
                    {isLoading && <Loader />}
                </form>
                <div className='pt-4 text-center'>
                    <p>New Customer?{" "}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className='text-blue-500 cursor-pointer'>Register</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
